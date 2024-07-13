import camelcaseKeys from "camelcase-keys";
import pool from "../db/pool.js";
import roomRepository from "../repositories/roomRepository.js";
import timerRepository from "../repositories/timerRepository.js";
import userRoomRepository from "../repositories/userRoomRepository.js";

const roomService = {
  async getRoomById({ connection, roomId }) {
    const room = await roomRepository.findRoomById({
      connection,
      roomId,
    });

    return room;
  },

  async getRoomUsersAndActiveCount({ roomId }) {
    const connection = await pool.getConnection();

    try {
      const participants = await userRoomRepository.findParticipants({
        connection,
        roomId,
      });
      const users = camelcaseKeys(participants, { deep: true });
      const activeParticipants = users.filter((user) => user.isActive).length;

      return {
        activeParticipants, // 카운트 수
        users,
      };
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  },

  async inactiveParticipant({ roomId, userId }) {
    const connection = await pool.getConnection();
    try {
      await userRoomRepository.inactiveParticipant({
        connection,
        roomId,
        userId,
      });
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  },

  async createRoom({
    roomTitle,
    userId: ownerId,
    roomDescription,
    focusTime,
    shortBreakTime,
    longBreakTime,
    totalCycles,
    maxParticipants,
  }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
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

      await userRoomRepository.addUserToRoom({
        connection,
        userId: ownerId,
        roomId,
      });

      await connection.commit();

      return { roomId };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async checkUserAlreadyJoined({ connection, roomId, userId }) {
    const participant = await userRoomRepository.findUserInRoom({
      connection,
      userId,
      roomId,
    });

    return participant !== null;
  },

  async checkRoomFull({ connection, roomId }) {
    const roomInfo = await roomRepository.findRoomById({ connection, roomId });
    const maxParticipants = roomInfo.max_participants;
    const currentParticipants = await userRoomRepository.findParticipants({
      connection,
      roomId,
    });
    return currentParticipants.length >= maxParticipants;
  },

  async joinRoom({ connection, userId, roomId }) {
    await userRoomRepository.addUserToRoom({ connection, userId, roomId });
  },

  async leaveRoom({ connection, userId, roomId }) {
    await userRoomRepository.removeUserFromRoom({ connection, userId, roomId });
  },

  async deleteRoom({ roomId }) {
    const connection = await pool.getConnection();

    try {
      await roomRepository.deleteRoom({ connection, roomId });
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  },
};

export default roomService;
