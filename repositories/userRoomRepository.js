const userRoomRepository = {
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

  async updateParticipantsToActive({ connection, roomId, userIds }) {
    const SQL = `
      UPDATE user_rooms
      SET 
        is_active = true
      WHERE 
        room_id = ?
        AND user_id IN (?)
    `;

    await connection.query(SQL, [roomId, userIds]);
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

  async addUserToRoom({ connection, userId, roomId }) {
    const SQL = `
      INSERT INTO user_rooms (user_id, room_id, is_active)
      VALUES (?, ?, 0);
    `;
    const values = [userId, roomId];
    await connection.query(SQL, values);
  },

  async findUserInRoom({ connection, userId, roomId }) {
    const SQL = `
      SELECT * FROM user_rooms
      WHERE user_id =? AND room_id =?;
    `;
    const [data] = await connection.query(SQL, [userId, roomId]);
    return data.length > 0 ? data[0] : null;
  },
};

export default userRoomRepository;
