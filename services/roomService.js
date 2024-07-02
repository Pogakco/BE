import roomRepository from "../repositories/roomRepository.js";
import isEmptyArray from "../utils/isEmptyArray.js";

const roomService = {
  async getRoomById({ connection, roomId }) {
    const data = await roomRepository.findRoomById({
      connection,
      roomId,
    });

    return data;
  },

  async getUsersInRoom({ connection, roomId }) {
    const participants = await roomRepository.findParticipants({
      connection,
      roomId,
    });
    const users = participants.map((user) => ({
      nickname: user.nickname,
      profileImageUrl: user.profile_image_url,
      pomodoroCount: user.pomodoro_count,
      isActive: user.is_active,
    }));
    const activeParticipants = users.filter((user) => user.isActive).length;

    return {
      activeParticipants,
      users,
    };
  },
};

export default roomService;
