import roomRepository from "../repositories/roomRepository.js";
import timerRepository from "../repositories/timerRepository.js";
import isEmptyArray from "../utils/isEmptyArray.js";

const timerService = {
  async startTimer({ connection, roomId, userIds }) {
    await timerRepository.updateTimerToStart({
      connection,
      roomId,
    });

    if (!isEmptyArray(userIds)) {
      await roomRepository.createOrUpdateActiveParticipants({
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
    await roomRepository.updateAllParticipantsActiveStatus({
      connection,
      isActive: false,
      roomId,
    });

    await timerRepository.updateTimerToFinish({
      connection,
      roomId,
    });

    const allParticipants = await roomRepository.findParticipants({
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

    await roomRepository.increaseAllActiveParticipantsPomodoroCount({
      connection,
      roomId,
    });

    const allParticipants = await roomRepository.findParticipants({
      connection,
      roomId,
    });

    return { increasedCurrentCycles, allParticipants };
  },
};

export default timerService;
