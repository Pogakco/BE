import jwt from "jsonwebtoken";
import convertHashedPassword from "../helpers/convertHashedPassword.js";
import generateSalt from "../helpers/generateSalt.js";
import userRepository from "../repositories/userRepository.js";

const userService = {
  async getUserProfile({ connection, userId }) {
    const data = await userRepository.findUserById({ connection, userId });

    return {
      email: data.email,
      nickname: data.nickname,
      profileImageUrl: data.profile_image_url,
    };
  },

  async getUserByEmail({ connection, email }) {
    const data = await userRepository.findUserByEmail({ connection, email });

    return data;
  },

  async getUserByNickname({ connection, nickname }) {
    const data = await userRepository.findUserByNickname({
      connection,
      nickname,
    });

    return data;
  },

  async verifyLoginStatus({ accessToken }) {
    if (!accessToken) {
      return false;
    }

    try {
      const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
      jwt.verify(accessToken, JWT_PRIVATE_KEY);
      return true;
    } catch (error) {
      return false;
    }
  },

  async signup({ connection, email, nickname, password }) {
    const salt = generateSalt();
    const hashedPassword = convertHashedPassword(password, salt);

    await userRepository.createUser({
      connection,
      email,
      nickname,
      hashedPassword,
      salt,
    });
  },

  async validateUser({ connection, email, password }) {
    const dbUserData = await userRepository.findUserByEmail({
      connection,
      email,
    });

    if (!dbUserData) {
      return false;
    }
    if (
      dbUserData.password !== convertHashedPassword(password, dbUserData.salt)
    ) {
      return false;
    }

    return true;
  },

  async issueAccessToken({ connection, email }) {
    const user = await userRepository.findUserByEmail({ connection, email });

    const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
    const accessToken = jwt.sign({ id: user.id }, JWT_PRIVATE_KEY, {
      expiresIn: "30m",
      issuer: "pogakco",
    });

    return accessToken;
  },

  async validatePassword({ connection, userId, password }) {
    const userData = await userRepository.findUserById({ connection, userId });
    if (!userData) {
      return false;
    }

    const hashedPassword = convertHashedPassword(password, userData.salt);
    return hashedPassword === userData.password;
  },
};

export default userService;
