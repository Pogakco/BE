import camelcaseKeys from "camelcase-keys";
import { SOCKET_TIMER_EVENTS } from "../../../constants.js";
import timerService from "../../../services/timerService.js";
import { calculateTimerTotalMs } from "./calculateMs.js";
import getRoomIdFromNamespace from "./getRoomIdFromNamespace.js";

const finishCyclesTimeoutGetter = ({ connection, socket, roomInfo }) => {
  let finishCyclesTimeout; // 클로저의 자유 변수

  const { totalCycles, focusTime, shortBreakTime, longBreakTime } = roomInfo;

  const roomDetailNamespace = socket.nsp;
  const roomId = getRoomIdFromNamespace(roomDetailNamespace);

  const clearFinishCyclesTimeout = () => {
    if (!finishCyclesTimeout) return;

    clearTimeout(finishCyclesTimeout);
  };

  const startFinishCyclesTimeout = () =>
    new Promise((resolve, reject) => {
      finishCyclesTimeout = setTimeout(async () => {
        try {
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

          resolve();
        } catch (error) {
          clearTimeout(finishCyclesTimeout);
          reject(error);
        }
      }, calculateTimerTotalMs({ focusTime, shortBreakTime, totalCycles, longBreakTime }));
    });

  return { clearFinishCyclesTimeout, startFinishCyclesTimeout };
};

export default finishCyclesTimeoutGetter;
