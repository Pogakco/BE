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

  async createUser({ connection, email, nickname, hashedPassword, salt }) {
    const SQL =
      "INSERT INTO `users` (`email`, `nickname`, `password`, `salt`) VALUES (?, ?, ?, ?)";

    await connection.query(SQL, [email, nickname, hashedPassword, salt]);
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
};

export default userRepository;
