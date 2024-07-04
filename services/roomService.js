import roomRepository from "../repositories/roomRepository.js";

const roomService = {
  async getRoomById({ connection, id }) {
    const data = await roomRepository.findRoomById({
      connection,
      id,
    });

    return data;
  },

  async inactiveParticipant({ connection, roomId, userId }) {
    await roomRepository.inactiveParticipant({
      connection,
      roomId,
      userId,
    });
  },
};

export default roomService;
