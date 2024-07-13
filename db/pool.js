import mysql from "mysql2/promise";
import { IS_DEV_MODE } from "../constants.js";

export const poolOption = {
  host: IS_DEV_MODE ? "localhost" : process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 100,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

const pool = mysql.createPool(poolOption);

export default pool;
