import {
  SOCKET_TIMER_ERRORS,
  SOCKET_TIMER_EVENTS,
} from "../../../constants.js";
import timerService from "../../../services/timerService.js";
import getUserIdFromSocket from "../../helpers/getUserIdFromSocket.js";
import getFinishCyclesTimeout from "../helpers/getFinishCyclesTimeout.js";
import getPomodoroInterval from "../helpers/getPomodoroInterval.js";
import getRoomIdFromNamespace from "../helpers/getRoomIdFromNamespace.js";
import getRoomInfoSafety from "../helpers/getRoomInfoSafety.js";
import startTimer from "../helpers/startTimer.js";

const onStartCycles = async (socket) => {
  const { roomInfo, isErrorGetRoomInfo } = await getRoomInfoSafety({
    socket,
  });
  if (isErrorGetRoomInfo) {
    return;
  }

  const { clearPomodoroInterval, startPomodoroInterval } = getPomodoroInterval({
    socket,
    roomInfo,
  });
  const { clearFinishCyclesTimeout, startFinishCyclesTimeout } =
    getFinishCyclesTimeout({ socket, roomInfo });

  try {
    const { isRunning, ownerId } = roomInfo;

    if (isRunning) {
      return;
    }

    const userId = getUserIdFromSocket(socket);
    if (!userId || Number(userId) !== Number(ownerId)) {
      socket.emit(SOCKET_TIMER_EVENTS.ERROR, {
        message: SOCKET_TIMER_ERRORS.IS_NOT_OWNER,
      });
      return;
    }

    await startTimer({ socket });
    await Promise.all([startPomodoroInterval(), startFinishCyclesTimeout()]);
  } catch (error) {
    clearPomodoroInterval();
    clearFinishCyclesTimeout();

    socket.emit(SOCKET_TIMER_EVENTS.ERROR, {
      message: SOCKET_TIMER_ERRORS.INTERNAL_SERVER_ERROR,
    });
    console.error(error);

    await timerService
      .finishTimer({
        roomId: getRoomIdFromNamespace(socket.nsp),
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

export default onStartCycles;
