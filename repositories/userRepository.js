import isEmptyArray from "../utils/isEmptyArray.js";

const userRepository = {
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
};

export default userRepository;
