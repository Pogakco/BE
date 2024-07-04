import roomRepository from "../repositories/roomRepository.js";

const roomService = {
  async getRoomById({ connection, roomId }) {
    const room = await roomRepository.findRoomById({
      connection,
      roomId,
    });

    return room;
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
