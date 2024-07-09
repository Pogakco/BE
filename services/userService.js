import jwt from "jsonwebtoken";
import convertHashedPassword from "../helpers/convertHashedPassword.js";
import deleteFileFromS3 from "../helpers/deleteFileFromS3.js";
import generateSalt from "../helpers/generateSalt.js";
import userRepository from "../repositories/userRepository.js";
import getPathnameFromUrl from "../utils/getPathnameFromUrl.js";

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

  async updateUserProfile({
    connection,
    userId,
    password,
    nickname,
    profileImageUrl,
  }) {
    // 업데이트가 완료 되면 이전 프로필 이미지를 S3에서 삭제하기 위해 변수에 저장
    const { profile_image_url: previousProfileImageUrl } =
      await userRepository.findUserById({ connection, userId });

    const salt = password ? generateSalt() : null;
    const hashedPassword = password
      ? convertHashedPassword(password, salt)
      : null;

    await userRepository.updateUser({
      connection,
      userId,
      hashedPassword,
      salt,
      nickname,
      profileImageUrl,
    });

    if (previousProfileImageUrl) {
      await deleteFileFromS3({
        pathname: getPathnameFromUrl(previousProfileImageUrl),
      });
    }
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
};

export default userService;
