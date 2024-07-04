import camelcaseKeys from "camelcase-keys";
import { SOCKET_TIMER_EVENTS } from "../../../constants.js";
import pool from "../../../db/pool.js";
import roomService from "../../../services/roomService.js";
import timerService from "../../../services/timerService.js";
import getAllLinkedUserIdsFromNamespace from "../../helpers/getAllLinkedUserIdsFromNamespace.js";
import {
  calculateOnePomodoroMs,
  calculateTimerTotalMs,
} from "../helpers/calculateMs.js";
import getRoomIdFromNamespace from "../helpers/getRoomIdFromNamespace.js";

const onStartCycles = async (socket) => {
  const connection = await pool.getConnection();

  const roomDetailNamespace = socket.nsp;
  const roomId = getRoomIdFromNamespace(roomDetailNamespace);
  const allLinkedUserIds =
    getAllLinkedUserIdsFromNamespace(roomDetailNamespace);

  const { totalCycles, focusTime, shortBreakTime, longBreakTime, isRunning } =
    camelcaseKeys(await roomService.getRoomById({ connection, id: roomId }));

  if (isRunning) {
    return;
  }

  const startedAt = await timerService.startTimer({
    connection,
    roomId,
    userIds: allLinkedUserIds,
  });

  roomDetailNamespace
    .to(roomId)
    .emit(SOCKET_TIMER_EVENTS.SYNC_STARTED_AT, startedAt);
  roomDetailNamespace
    .to(roomId)
    .emit(SOCKET_TIMER_EVENTS.SYNC_IS_RUNNING, true);

  let pomodoroCount = 0;
  const intervalOnFinishedPomodoro = setInterval(async () => {
    console.log(pomodoroCount + 1, "뽀모도로 끝");

    const { increasedCurrentCycles, allParticipants } =
      await timerService.finishPomodoro({ connection, roomId });

    roomDetailNamespace
      .to(roomId)
      .emit(
        SOCKET_TIMER_EVENTS.SYNC_ALL_PARTICIPANTS,
        camelcaseKeys(allParticipants)
      );
    roomDetailNamespace
      .to(roomId)
      .emit(SOCKET_TIMER_EVENTS.SYNC_CURRENT_CYCLES, increasedCurrentCycles);

    pomodoroCount += 1;

    if (pomodoroCount === totalCycles) {
      clearInterval(intervalOnFinishedPomodoro);
    }
  }, calculateOnePomodoroMs({ focusTime, shortBreakTime }));

  setTimeout(async () => {
    console.log("모든 사이클 끝");

    roomDetailNamespace
      .to(roomId)
      .emit(SOCKET_TIMER_EVENTS.SYNC_IS_RUNNING, false);
    roomDetailNamespace
      .to(roomId)
      .emit(SOCKET_TIMER_EVENTS.SYNC_CURRENT_CYCLES, 0);

    const { allParticipants } = await timerService.finishTimer({
      connection,
      roomId,
    });

    roomDetailNamespace
      .to(roomId)
      .emit(
        SOCKET_TIMER_EVENTS.SYNC_ALL_PARTICIPANTS,
        camelcaseKeys(allParticipants)
      );
  }, calculateTimerTotalMs({ focusTime, shortBreakTime, totalCycles, longBreakTime }));
};

export default onStartCycles;
