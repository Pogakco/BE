const roomRepository = {
  async findAllRooms({ connection, offset, limit }) {
    const SQL = `SELECT SQL_CALC_FOUND_ROWS
      rooms.id,
      room_title,
      room_description,
      total_cycles,
      current_cycles,
      focus_time,
      short_break_time,
      is_running,
      max_participants,
      users.nickname AS ownerName,
      users.profile_image_url AS ownerProfileImageUrl,
      COUNT(user_rooms.user_id) AS currentParticipants
    FROM rooms
    LEFT JOIN timers ON rooms.timer_id = timers.id
    LEFT JOIN users ON rooms.owner_id = users.id
    LEFT JOIN user_rooms ON rooms.id = user_rooms.room_id
    GROUP BY rooms.id
    LIMIT ? OFFSET ?;`;

    const [data] = await connection.query(SQL, [limit, offset]);

    const [totalCount] = await connection.query("SELECT FOUND_ROWS()");
    const totalElements = totalCount[0]["FOUND_ROWS()"];

    return {
      data,
      totalElements,
    };
  },
};

export default roomRepository;
