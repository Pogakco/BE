import camelcaseKeys from "camelcase-keys";
import { SOCKET_TIMER_EVENTS } from "../../../constants.js";
import timerService from "../../../services/timerService.js";
import { calculateOnePomodoroMs } from "./calculateMs.js";
import getRoomIdFromNamespace from "./getRoomIdFromNamespace.js";

const getPomodoroInterval = ({ connection, socket, roomInfo }) => {
  let pomodoroInterval; // 클로저의 자유 변수

  const { totalCycles, focusTime, shortBreakTime } = roomInfo;

  const roomDetailNamespace = socket.nsp;
  const roomId = getRoomIdFromNamespace(roomDetailNamespace);

  const clearPomodoroInterval = () => {
    if (!pomodoroInterval) return;

    clearInterval(pomodoroInterval);
  };

  const startPomodoroInterval = () =>
    new Promise((resolve, reject) => {
      let pomodoroCount = 0;
      pomodoroInterval = setInterval(async () => {
        try {
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
            .emit(
              SOCKET_TIMER_EVENTS.SYNC_CURRENT_CYCLES,
              increasedCurrentCycles
            );

          pomodoroCount += 1;

          if (pomodoroCount === totalCycles) {
            clearInterval(pomodoroInterval);
          }
          resolve();
        } catch (error) {
          clearInterval(pomodoroInterval);
          reject(error);
        }
      }, calculateOnePomodoroMs({ focusTime, shortBreakTime }));
    });

  return { clearPomodoroInterval, startPomodoroInterval };
};

export default getPomodoroInterval;
