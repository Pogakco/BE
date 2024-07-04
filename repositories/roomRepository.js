import isEmptyArray from "../utils/isEmptyArray.js";

const roomRepository = {
  async findRoomById({ connection, roomId }) {
    const SQL = `
      SELECT 
        rooms.id, 
        room_title, 
        room_description, 
        total_cycles, 
        current_cycles, 
        focus_time, 
        short_break_time, 
        long_break_time, 
        started_at, 
        is_running,
        max_participants,
        COUNT(user_rooms.user_id) AS currentParticipants,
        users.id AS ownerId,
        users.nickname AS ownerName,
        users.profile_image_url AS ownerProfileImageUrl
      FROM rooms
      JOIN timers ON rooms.timer_id = timers.id
      JOIN users ON rooms.owner_id = users.id
      LEFT JOIN user_rooms ON rooms.id = user_rooms.room_id
      WHERE rooms.id = ?;
    `;

    const [data] = await connection.query(SQL, [roomId]);

    return isEmptyArray(data) ? null : data[0];
  },

  async findParticipants({ connection, roomId }) {
    const SQL = `
      SELECT
        user_rooms.*,
        users.nickname,
        users.profile_image_url
      FROM user_rooms
      JOIN users ON user_rooms.user_id = users.id
      WHERE room_id = ?;
    `;
    const [data] = await connection.query(SQL, [roomId]);

    return data;
  },

  async createOrUpdateActiveParticipants({ connection, roomId, userIds }) {
    const SQL = `
      INSERT INTO user_rooms
        (user_id, room_id, is_active)
      VALUES
        ${userIds.map(() => "(?, ?, ?)").join(",")}
      ON DUPLICATE KEY UPDATE
        is_active = VALUES(is_active)
    `;

    await connection.query(
      SQL,
      userIds.flatMap((userId) => [userId, roomId, true])
    );
  },

  async updateAllParticipantsActiveStatus({ connection, roomId, isActive }) {
    const SQL = `
      UPDATE user_rooms
      SET 
        is_active = ?
      WHERE 
        room_id = ?
`;

    await connection.query(SQL, [isActive, roomId]);
  },

  async increaseAllActiveParticipantsPomodoroCount({ connection, roomId }) {
    const SQL = `
      UPDATE user_rooms
      SET
        pomodoro_count = pomodoro_count + 1
      WHERE 
        room_id = ?
        AND is_active = 1
    `;

    await connection.query(SQL, [roomId]);
  },

  async inactiveParticipant({ connection, roomId, userId }) {
    const SQL = `
      UPDATE user_rooms
      SET
        is_active = false
      WHERE
        is_active = true
        AND user_id = ?
        AND room_id = ?
    `;

    await connection.query(SQL, [userId, roomId]);
  },
};

export default roomRepository;
