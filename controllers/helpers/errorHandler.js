import { StatusCodes } from "http-status-codes";
import pool from "../../db/pool.js";

/**
 * 예외 처리 하지 않은 에러를 Internal Server Error로 Response하는 함수입니다.
 * transaction option 설정을 통해 에러 발생 시 rollback을 자동으로 처리할 수 있습니다.
 * @param {*} fn
 * @param {{ transaction: boolean }} options
 * @returns
 */
const errorHandler = (fn, options = {}) => {
  const { transaction } = options;

  return async (req, res) => {
    const connection = await pool.getConnection();
    req.connection = connection;

    try {
      await fn(req, res);
    } catch (error) {
      console.log(error);
      transaction && connection.rollback();
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "서버 오류가 발생했습니다." });
    } finally {
      connection.release();
    }
  };
};

export default errorHandler;
