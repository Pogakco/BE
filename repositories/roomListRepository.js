const roomListRepository = {
  async findDataAndTotalElements({ connection, SQL, values }) {
    const [data] = await connection.query(SQL, values);
    const [totalCount] = await connection.query("SELECT FOUND_ROWS()");
    const totalElements = totalCount[0]["FOUND_ROWS()"];

    return {
      data,
      totalElements,
    };
  },

  async findRooms({ connection, offset, limit, isRunning, userId }) {
    let SQL = `SELECT SQL_CALC_FOUND_ROWS
        rooms.id,
        room_title,
        room_description,
        total_cycles,
        current_cycles,
        focus_time,
        short_break_time,
        long_break_time,
        is_running,
        max_participants,
        users.nickname AS ownerName,
        users.profile_image_url AS ownerProfileImageUrl,
        COUNT(user_rooms.user_id) AS currentParticipants
      FROM rooms
      LEFT JOIN timers ON rooms.timer_id = timers.id
      LEFT JOIN users ON rooms.owner_id = users.id
      LEFT JOIN user_rooms ON rooms.id = user_rooms.room_id
      `;
    const values = [parseInt(limit), parseInt(offset)];

    if (userId) {
      SQL += "WHERE user_rooms.user_id = ? ";
      values.unshift(userId);
    }

    SQL += "GROUP BY rooms.id ";

    if (isRunning === "false") {
      SQL += `HAVING timers.is_running = 0 `;
    } else if (isRunning === "true") {
      SQL += `HAVING timers.is_running = 1 `;
    }

    SQL += "LIMIT ? OFFSET ?;";

    return this.findDataAndTotalElements({ connection, SQL, values });
  },
};

export default roomListRepository;
