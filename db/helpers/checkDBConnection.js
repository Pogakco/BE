import pool from "../pool.js";

const checkDBConnection = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query("SELECT 1");
    connection.release();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default checkDBConnection;
