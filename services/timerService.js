import pool from "../db/pool.js";
import roomRepository from "../repositories/roomRepository.js";
import timerRepository from "../repositories/timerRepository.js";
import userRoomRepository from "../repositories/userRoomRepository.js";
import isEmptyArray from "../utils/isEmptyArray.js";

const timerService = {
  async startTimer({ roomId, userIds }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      await timerRepository.updateTimerToStart({
        connection,
        roomId,
      });

      if (!isEmptyArray(userIds)) {
        await userRoomRepository.updateParticipantsToActive({
          connection,
          roomId,
          userIds,
        });
      }

      const data = await roomRepository.findRoomById({
        connection,
        roomId,
      });

      await connection.commit();

      return data.started_at;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async finishTimer({ roomId }) {
    const connection = await pool.getConnection();

    try {
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
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  },

  async finishPomodoro({ roomId }) {
    const connection = await pool.getConnection();

    try {
      const { current_cycles: currentCycles } =
        await roomRepository.findRoomById({
          connection,
          roomId,
        });

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
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  },
};

export default timerService;
