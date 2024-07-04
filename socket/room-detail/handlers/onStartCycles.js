import { SOCKET_TIMER_EVENTS } from "../../../constants.js";
import pool from "../../../db/pool.js";
import timerService from "../../../services/timerService.js";
import getFinishCyclesTimeout from "../helpers/getFinishCyclesTimeout.js";
import getPomodoroInterval from "../helpers/getPomodoroInterval.js";
import getRoomIdFromNamespace from "../helpers/getRoomIdFromNamespace.js";
import getRoomInfoSafety from "../helpers/getRoomInfoSafety.js";
import startTimer from "../helpers/startTimer.js";

const onStartCycles = async (socket) => {
  const connection = await pool.getConnection();

  const { roomInfo, isErrorGetRoomInfo } = await getRoomInfoSafety({
    connection,
    socket,
  });
  if (isErrorGetRoomInfo) {
    return;
  }

  const { clearPomodoroInterval, startPomodoroInterval } = getPomodoroInterval({
    connection,
    socket,
    roomInfo,
  });
  const { clearFinishCyclesTimeout, startFinishCyclesTimeout } =
    getFinishCyclesTimeout({ connection, socket, roomInfo });

  try {
    if (roomInfo.isRunning) {
      return;
    }
    await startTimer({ connection, socket });
    await Promise.all([startPomodoroInterval(), startFinishCyclesTimeout()]);
  } catch (error) {
    clearPomodoroInterval();
    clearFinishCyclesTimeout();

    socket.emit(SOCKET_TIMER_EVENTS.ERROR, {
      message: "타이머 소켓 오류가 발생했습니다.",
    });
    console.error(error);

    await timerService
      .finishTimer({
        connection,
        roomId: getRoomIdFromNamespace(socket.nsp),
      })
      .catch(() => {});
  } finally {
    connection.release();
  }
};

export default onStartCycles;
