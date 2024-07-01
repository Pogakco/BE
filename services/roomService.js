import roomRepository from "../repositories/roomRepository.js";
import isEmptyArray from "../utils/isEmptyArray.js";

const roomService = {
  async getRoomById({ connection, id }) {
    const data = await roomRepository.findRoomById({
      connection,
      id,
    });

    return data;
  },

  async startTimer({ connection, roomId, userIds }) {
    await roomRepository.updateTimerStartedAtNow({
      connection,
      roomId,
    });

    await roomRepository.updateTimerRunningStatus({
      connection,
      roomId,
      isRunning: 1,
    });

    if (!isEmptyArray(userIds)) {
      await roomRepository.updateParticipantsActiveStatus({
        connection,
        isActive: true,
        roomId,
        userIds,
      });
    }

    const data = await roomRepository.findRoomById({
      connection,
      id: roomId,
    });

    return data.started_at;
  },

  async finishTimer({ connection, roomId }) {
    await roomRepository.updateTimerRunningStatus({
      connection,
      roomId,
      isRunning: 0,
    });

    await roomRepository.updateTimerCurrentCycles({
      connection,
      roomId,
      currentCycles: 0,
    });
  },

  async inactiveAllParticipants({ connection, roomId }) {
    await roomRepository.updateAllParticipantsActiveStatus({
      connection,
      isActive: false,
      roomId,
    });

    const data = await roomRepository.findParticipants({
      connection,
      roomId,
    });

    return data;
  },

  async increaseCurrentCycles({ connection, roomId }) {
    const { current_cycles: currentCycles } = await roomRepository.findRoomById(
      {
        connection,
        id: roomId,
      }
    );

    const increasedCurrentCycles = currentCycles + 1;

    await roomRepository.updateTimerCurrentCycles({
      connection,
      roomId,
      currentCycles: increasedCurrentCycles,
    });

    return increasedCurrentCycles;
  },

  async increaseAllActiveParticipantsPomodoroCount({ connection, roomId }) {
    await roomRepository.increaseAllActiveParticipantsPomodoroCount({
      connection,
      roomId,
    });

    const data = await roomRepository.findParticipants({
      connection,
      roomId,
    });
    
    return data;
  },
};

export default roomService;
