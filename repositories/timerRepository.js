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
};

export default timerRepository;
