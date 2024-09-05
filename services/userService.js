import axios from "axios";
import { randomUUID } from "crypto";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_ISSUER,
  AUTHENTICATE_ERROR_TYPE,
} from "../constants.js";
import pool from "../db/pool.js";
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

  /**
   * 사용자를 인증하고 인증 상태를 반환합니다.
   *
   * 이 함수는 주어진 accessToken과 refreshToken을 사용하여 사용자의 인증 상태를 검증합니다.
   * accessToken이 유효하면 사용자는 바로 인증됩니다. accessToken이 만료된 경우,
   * refreshToken을 사용하여 accessToken을 갱신하고, 새로운 accessToken으로 사용자를 인증합니다.
   *
   * @param {Object} tokens - 인증에 사용될 토큰 객체입니다.
   * @param {string} tokens.accessToken - 사용자의 액세스 토큰입니다.
   * @param {string} tokens.refreshToken - 사용자의 리프레시 토큰입니다.
   * @returns {Promise<{isAuthError: boolean, authErrorType?: string, authErrorMessage?: string, newAccessToken?: string, userId?: number}>} 인증 결과를 나타내는 객체를 프로미스로 반환합니다.
   *                             반환된 객체는 인증 성공 여부와 새로운 토큰 정보를 포함할 수 있습니다.
   * @throws {Error} 인증 과정에서 오류가 발생했을 때 예외가 발생합니다.
   */
  async authenticate({ accessToken, refreshToken }) {
    if (!accessToken || !refreshToken) {
      return {
        isAuthError: true,
        authErrorType: AUTHENTICATE_ERROR_TYPE.TOKEN_NOT_FOUND,
        authErrorMessage: "토큰이 존재하지 않습니다.",
      };
    }

    const refreshTokenInfo = await this.getRefreshTokenInfoByValue({
      refreshToken,
    });
    if (!refreshTokenInfo) {
      return {
        isAuthError: true,
        authErrorType: AUTHENTICATE_ERROR_TYPE.INVALID_REFRESH_TOKEN,
        authErrorMessage: "유효하지 않은 리프레시 토큰 입니다.",
      };
    }

    const { user_id: userId, expire_date: refreshTokenExpireDate } =
      refreshTokenInfo;

    const isTokenRefreshable = dayjs().isBefore(dayjs(refreshTokenExpireDate));
    if (!isTokenRefreshable) {
      await this.deleteRefreshToken({ userId, refreshToken });

      return {
        isAuthError: true,
        authErrorType: AUTHENTICATE_ERROR_TYPE.EXPIRED_REFRESH_TOKEN,
        authErrorMessage: "만료된 리프레시 토큰 입니다.",
      };
    }

    try {
      const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
      jwt.verify(accessToken, JWT_PRIVATE_KEY);

      return { userId };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        const newAccessToken = this.issueAccessToken({
          userId,
        });

        return {
          newAccessToken,
          userId,
        };
      }

      return {
        isAuthError: true,
        authErrorType: AUTHENTICATE_ERROR_TYPE.INVALID_ACCESS_TOKEN,
        authErrorMessage: "유효하지 않은 토큰 입니다.",
      };
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

  async socialSignup({ email, nickname, provider, socialAccessToken }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const userId = (
        await userRepository.createUser({
          connection,
          email,
          nickname,
          hashedPassword: null,
          salt: null,
          isSocialLogin: true,
        })
      ).insertId;

      const providerId = await this.getSocialLoginProviderId({
        socialAccessToken,
        provider,
      });

      await userRepository.createSocialLoginInfo({
        connection,
        userId,
        provider,
        providerId,
      });

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async validateUser({ email, password }) {
    const connection = await pool.getConnection();

    try {
      const dbUserData = await userRepository.findUserByEmail({
        connection,
        email,
      });

      if (!dbUserData) {
        return null;
      }

      if (
        dbUserData.password !== convertHashedPassword(password, dbUserData.salt)
      ) {
        return null;
      }

      return dbUserData;
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  },

  issueAccessToken({ userId }) {
    const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
    const accessToken = jwt.sign({ id: userId }, JWT_PRIVATE_KEY, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      issuer: ACCESS_TOKEN_ISSUER,
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

  async getRefreshTokenInfoByValue({ refreshToken }) {
    const connection = await pool.getConnection();
    let result = null;

    try {
      result = await userRepository.findRefreshTokenByValue({
        connection,
        refreshToken,
      });
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }

    return result;
  },

  async createRefreshToken({ userId }) {
    const connection = await pool.getConnection();
    const refreshToken = randomUUID();

    try {
      await userRepository.createRefreshToken({
        connection,
        userId,
        refreshToken,
      });
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }

    return refreshToken;
  },

  async deleteRefreshToken({ userId, refreshToken }) {
    const connection = await pool.getConnection();

    try {
      await userRepository.deleteRefreshToken({
        connection,
        userId,
        refreshToken,
      });
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  },

  async getKakaoUserId({ socialAccessToken }) {
    try {
      const kakaoUser = (
        await axios.post("https://kapi.kakao.com/v2/user/me", null, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            Authorization: `Bearer ${socialAccessToken}`,
          },
        })
      ).data;
      return kakaoUser.id;
    } catch (error) {
      throw error;
    }
  },

  async getSocialLoginProviderId({ socialAccessToken, provider }) {
    if (provider === "KAKAO") {
      return this.getKakaoUserId({ socialAccessToken });
    }
  },

  async getSocialLoginInfo({ socialAccessToken, provider }) {
    const connection = await pool.getConnection();

    try {
      const providerId = await this.getSocialLoginProviderId({
        socialAccessToken,
        provider,
      });
      const socialLoginInfo = await userRepository.findSocialLoginInfo({
        connection,
        providerId,
        provider,
      });
      return socialLoginInfo;
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  },
};

export default userService;
