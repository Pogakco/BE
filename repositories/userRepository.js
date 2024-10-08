import dayjs from "dayjs";
import { REFRESH_TOKEN_MAX_AGE, TIMESTAMP_FORMAT } from "../constants.js";
import isEmptyArray from "../utils/isEmptyArray.js";

const userRepository = {
  async findUserById({ connection, userId }) {
    const SQL = "SELECT * FROM `users` WHERE `id` = ?";

    const [data] = await connection.query(SQL, [userId]);

    return isEmptyArray(data) ? null : data[0];
  },

  async findUserByEmail({ connection, email }) {
    const SQL = "SELECT * FROM `users` WHERE `email` = ?";

    const [data] = await connection.query(SQL, [email]);

    return isEmptyArray(data) ? null : data[0];
  },

  async findUserByNickname({ connection, nickname }) {
    const SQL = "SELECT * FROM `users` WHERE `nickname` = ?";

    const [data] = await connection.query(SQL, [nickname]);

    return isEmptyArray(data) ? null : data[0];
  },

  async createUser({
    connection,
    email,
    nickname,
    hashedPassword,
    salt,
    isSocialLogin,
  }) {
    const SQL =
      "INSERT INTO `users` (`email`, `nickname`, `password`, `salt`, `is_social_login`) VALUES (?, ?, ?, ?, ?)";

    const [result] = await connection.query(SQL, [
      email,
      nickname,
      hashedPassword,
      salt,
      isSocialLogin ?? false,
    ]);

    return result;
  },

  async updateUser({
    connection,
    userId,
    hashedPassword,
    salt,
    nickname,
    profileImageUrl,
  }) {
    const SQL = `
      UPDATE users
      SET
        ${hashedPassword ? "password = ?," : ""}
        ${salt ? "salt = ?," : ""}
        profile_image_url = ${profileImageUrl ? "?" : "NULL"},
        nickname = ?
      WHERE id = ?
    `;

    await connection.query(
      SQL,
      [hashedPassword, salt, profileImageUrl, nickname, userId].filter(
        (field) => !!field
      )
    );
  },

  async findRefreshTokenByValue({ connection, refreshToken }) {
    const SQL = `
      SELECT *
      FROM refresh_tokens
      WHERE value = ?
    `;

    const [data] = await connection.query(SQL, [refreshToken]);

    return isEmptyArray(data) ? null : data[0];
  },

  async createRefreshToken({ connection, userId, refreshToken }) {
    const SQL = `
      INSERT INTO refresh_tokens (user_id, expire_date, value)
      VALUES (?, ?, ?)
    `;

    const expireDate = dayjs()
      .add(REFRESH_TOKEN_MAX_AGE, "millisecond")
      .format(TIMESTAMP_FORMAT);

    await connection.query(SQL, [userId, expireDate, refreshToken]);
  },

  async deleteRefreshToken({ connection, userId, refreshToken }) {
    const SQL = `
      DELETE FROM refresh_tokens
      WHERE user_id = ? AND value = ?;
    `;

    await connection.query(SQL, [userId, refreshToken]);
  },

  async findSocialLoginInfo({ connection, providerId, provider }) {
    const SQL = `
      SELECT *
      FROM social_logins
      WHERE
        provider_id = ?
        AND provider = ?
    `;

    const [data] = await connection.query(SQL, [providerId, provider]);

    return isEmptyArray(data) ? null : data[0];
  },

  async createSocialLoginInfo({ connection, userId, provider, providerId }) {
    const SQL = `
      INSERT INTO social_logins (user_id, provider, provider_id)
      VALUES (?, ?, ?)
    `;

    await connection.query(SQL, [userId, provider, providerId]);
  },
};

export default userRepository;
