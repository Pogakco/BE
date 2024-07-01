import camelcaseKeys from "camelcase-keys";
import pool from "../../../db/pool.js";
import roomService from "../../../services/roomService.js";
import calculateLongBreakTimeMs from "../../helpers/calculateLongBreakTimeMs.js";
import calculateOnePomodoroMs from "../../helpers/calculateOnePomodoroMs.js";
import getAllLinkedUserIdsFromSocket from "../../helpers/getAllLinkedUserIdsFromSocket.js";
import getRoomIdFromSocket from "../../helpers/getRoomIdFromSocket.js";

const startCycles = async (socket) => {
  const connection = await pool.getConnection();

  const roomId = getRoomIdFromSocket(socket);
  const roomDetailNamespace = socket.nsp;
  const activeUserIds = getAllLinkedUserIdsFromSocket(roomDetailNamespace);

  const { totalCycles, focusTime, shortBreakTime, longBreakTime, isRunning } =
    camelcaseKeys(await roomService.getRoomById({ connection, id: roomId }));

  if (isRunning) {
    return;
  }

  const startedAt = await roomService.startTimer({
    connection,
    roomId,
    userIds: activeUserIds,
  });

  roomDetailNamespace.to(roomId).emit("sync-is-running", true);
  roomDetailNamespace.to(roomId).emit("sync-started-at", startedAt);

  let pomodoroCount = 0;
  const intervalOnFinishedPomodoro = setInterval(() => {
    console.log(pomodoroCount + 1, "뽀모도로 끝");

    roomService
      .increaseAllActiveParticipantsPomodoroCount({ connection, roomId })
      .then((allParticipants) => {
        roomDetailNamespace
          .to(roomId)
          .emit("sync-all-participants", camelcaseKeys(allParticipants));
      });

    roomService
      .increaseCurrentCycles({ connection, roomId })
      .then((currentCycles) => {
        roomDetailNamespace
          .to(roomId)
          .emit("sync-current-cycles", currentCycles);
      });
    pomodoroCount += 1;

    if (pomodoroCount === totalCycles) {
      clearInterval(intervalOnFinishedPomodoro);
    }
  }, calculateOnePomodoroMs({ focusTime, shortBreakTime }));

  setTimeout(() => {
    console.log("모든 사이클 끝");

    roomDetailNamespace.to(roomId).emit("sync-is-running", false);

    roomService
      .inactiveAllParticipants({ connection, roomId })
      .then((allParticipants) => {
        roomDetailNamespace
          .to(roomId)
          .emit("sync-all-participants", camelcaseKeys(allParticipants));
      });

    roomService.finishTimer({ connection, roomId }).then(() => {
      roomDetailNamespace.to(roomId).emit("sync-current-cycles", 0);
      roomDetailNamespace.to(roomId).emit("sync-is-running", false);
    });
  }, calculateOnePomodoroMs({ focusTime, shortBreakTime }) * totalCycles + calculateLongBreakTimeMs(longBreakTime));
};

export default startCycles;
