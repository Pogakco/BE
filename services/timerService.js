import roomRepository from "../repositories/roomRepository.js";
import timerRepository from "../repositories/timerRepository.js";
import isEmptyArray from "../utils/isEmptyArray.js";
import userRoomRepository from "../repositories/userRoomRepository.js";

const timerService = {
  async startTimer({ connection, roomId, userIds }) {
    await timerRepository.updateTimerToStart({
      connection,
      roomId,
    });

    if (!isEmptyArray(userIds)) {
      await userRoomRepository.createOrUpdateActiveParticipants({
        connection,
        roomId,
        userIds,
      });
    }

    const data = await roomRepository.findRoomById({
      connection,
      roomId,
    });

    return data.started_at;
  },

  async finishTimer({ connection, roomId }) {
    await userRoomRepository.updateAllParticipantsActiveStatus({
      connection,
      isActive: false,
      roomId,
    });

    await timerRepository.updateTimerToFinish({
      connection,
      roomId,
    });

    const allParticipants = await userRoomRepository.findParticipants({
      connection,
      roomId,
    });

    return { allParticipants };
  },

  async finishPomodoro({ connection, roomId }) {
    const { current_cycles: currentCycles } = await roomRepository.findRoomById(
      {
        connection,
        roomId,
      }
    );

    const increasedCurrentCycles = currentCycles + 1;

    await timerRepository.updateTimerCurrentCycles({
      connection,
      roomId,
      currentCycles: increasedCurrentCycles,
    });

    await userRoomRepository.increaseAllActiveParticipantsPomodoroCount({
      connection,
      roomId,
    });

    const allParticipants = await userRoomRepository.findParticipants({
      connection,
      roomId,
    });

    return { increasedCurrentCycles, allParticipants };
  },
};

export default timerService;
