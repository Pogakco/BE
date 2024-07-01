import isEmptyArray from "../utils/isEmptyArray.js";

const roomRepository = {
  async findRoomById({ connection, id }) {
    const SQL = `
      SELECT *
      FROM rooms
      JOIN timers
        ON rooms.timer_id = timers.id
      WHERE rooms.id = ?
    `;

    const [data] = await connection.query(SQL, [id]);

    return isEmptyArray(data) ? null : data[0];
  },

  async updateTimerStartedAtNow({ connection, id }) {
    const SQL = `
      UPDATE timers
      SET started_at = NOW()
      WHERE room_id = ?
    `;

    const [data] = await connection.query(SQL, [id]);

    return data;
  },

  async updateTimerRunningStatus({ connection, roomId, isRunning }) {
    const SQL = `
      UPDATE timers
      SET is_running = ?
      WHERE room_id = ?
    `;

    await connection.query(SQL, [isRunning, roomId]);
  },

  async updateTimerCurrentCycles({ connection, roomId, currentCycles }) {
    const SQL = `
      UPDATE timers
      SET current_cycles = ?
      WHERE room_id = ?
    `;

    await connection.query(SQL, [currentCycles, roomId]);
  },

  async findParticipants({ connection, roomId }) {
    const SQL = `
      SELECT
        user_rooms.*,
        users.nickname,
        users.profile_image_url
      FROM user_rooms
      JOIN users
        ON user_rooms.user_id = users.id
      WHERE 
        room_id = ? 
    `;
    const [data] = await connection.query(SQL, [roomId]);

    return data;
  },

  async updateParticipantsActiveStatus({
    connection,
    isActive,
    roomId,
    userIds,
  }) {
    const SQL = `
      UPDATE user_rooms
      SET is_active = ?
      WHERE 
        room_id = ?
        AND user_id in (?)
  `;

    await connection.query(SQL, [isActive, roomId, userIds]);
  },

  async updateAllParticipantsActiveStatus({ connection, roomId, isActive }) {
    const SQL = `
    UPDATE user_rooms
    SET is_active = ?
    WHERE 
      room_id = ?
`;

    await connection.query(SQL, [isActive, roomId]);
  },

  async increaseAllActiveParticipantsPomodoroCount({ connection, roomId }) {
    const SQL = `
      UPDATE user_rooms
      SET pomodoro_count = pomodoro_count + 1
      WHERE 
        room_id = ?
        AND is_active = 1
    `;

    await connection.query(SQL, [roomId]);
  },
};

export default roomRepository;
