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

  async createRoom({
    connection,
    roomTitle,
    ownerId,
    roomDescription,
    maxParticipants,
  }) {
    const SQL = `
      INSERT INTO rooms (room_title, owner_id, room_description, max_participants) 
      VALUES(?, ?, ?, ?);
    `;

    const values = [roomTitle, ownerId, roomDescription, maxParticipants];
    const [result] = await connection.query(SQL, values);
    return result;
  },

  async updateRoomTimer({ connection, roomId, timerId }) {
    const SQL = `
      UPDATE rooms SET timer_id = ? WHERE id = ?;
    `;
    const values = [timerId, roomId];
    await connection.query(SQL, values);
  },

  async delteRoom({ connection, roomId }) {
    const SQL = `
      DELETE FROM rooms WHERE id = ?;
    `;
    await connection.query(SQL, [roomId]);
  },
};

export default roomRepository;
