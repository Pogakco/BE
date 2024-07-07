const timerRepository = {
  async updateTimerToStart({ connection, roomId }) {
    const SQL = `
      UPDATE timers
      SET 
        started_at = NOW(),
        is_running = true
      WHERE room_id = ?
    `;

    await connection.query(SQL, [roomId]);
  },

  async updateTimerToFinish({ connection, roomId }) {
    const SQL = `
      UPDATE timers
      SET
        started_at = NULL,
        is_running = false,
        current_cycles = 0
      WHERE room_id = ?
    `;

    await connection.query(SQL, [roomId]);
  },

  async updateTimerCurrentCycles({ connection, roomId, currentCycles }) {
    const SQL = `
      UPDATE timers
      SET
        current_cycles = ?
      WHERE room_id = ?
    `;

    await connection.query(SQL, [currentCycles, roomId]);
  },

  async createTimer({connection, roomId, totalCycles, focusTime, shortBreakTime, longBreakTime}) {
    const SQL = `
      INSERT INTO timers 
        (room_id, total_cycles, current_cycles, focus_time, short_break_time, long_break_time, is_running)
      VALUES (?, ?, 0, ?, ?, ?, 0)
    `;

    const values = [roomId, totalCycles, focusTime, shortBreakTime, longBreakTime];
    const [result] = await connection.query(SQL, values);
    return result;
  }
};

export default timerRepository;
