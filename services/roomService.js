import roomRepository from "../repositories/roomRepository.js";
import timerRepository from "../repositories/timerRepository.js";

const roomService = {
  async getRoomById({ connection, roomId }) {
    const room = await roomRepository.findRoomById({
      connection,
      roomId,
    });

    return room;
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

  async inactiveParticipant({ connection, roomId, userId }) {
    await roomRepository.inactiveParticipant({
      connection,
      roomId,
      userId,
    });
  },

  async createRoom({
    connection,
    roomTitle,
    userId: ownerId,
    roomDescription,
    focusTime,
    shortBreakTime,
    longBreakTime,
    totalCycles,
    maxParticipants,
  }) {
    const room = await roomRepository.createRoom({
      connection,
      roomTitle,
      ownerId,
      roomDescription,
      maxParticipants,
    });

    const roomId = room.insertId;

    const timer = await timerRepository.createTimer({
      connection,
      roomId,
      totalCycles,
      focusTime,
      shortBreakTime,
      longBreakTime,
    });

    const timerId = timer.insertId;

    await roomRepository.updateRoomTimer({
      connection,
      roomId,
      timerId,
    });

    await roomRepository.addUserToRoom({
      connection,
      userId: ownerId,
      roomId,
    });

    return { roomId };
  },
};

export default roomService;
