import { StatusCodes } from "http-status-codes";
import {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  ACCESS_TOKEN_KEY,
  AWS_S3_DIRECTORY,
} from "../constants.js";
import deleteFileFromS3 from "../helpers/deleteFileFromS3.js";
import uploadFileToS3 from "../helpers/uploadFileToS3.js";
import userService from "../services/userService.js";
import errorHandler from "./helpers/errorHandler.js";

const userController = {
  auth: errorHandler(async (req, res) => {
    const accessToken = req.cookies[ACCESS_TOKEN_KEY];

    const isLogin = await userService.verifyLoginStatus({ accessToken });

    return res.status(StatusCodes.OK).json({ isLogin });
  }),

  signup: errorHandler(async (req, res) => {
    const { connection } = req;
    const { email, password, nickname } = req.body;

    const userByEmail = await userService.getUserByEmail({ connection, email });
    if (userByEmail) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "이미 존재하는 이메일 입니다." });
    }

    const userByNickname = await userService.getUserByNickname({
      connection,
      nickname,
    });
    if (userByNickname) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "이미 존재하는 닉네임 입니다." });
    }

    await userService.signup({ connection, email, nickname, password });

    return res.status(StatusCodes.CREATED).end();
  }),

  login: errorHandler(async (req, res) => {
    const { connection } = req;
    const { email, password } = req.body;

    const isValidUser = await userService.validateUser({
      connection,
      email,
      password,
    });
    if (!isValidUser) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "회원 정보가 잘못되었습니다." });
    }

    const accessToken = await userService.issueAccessToken({
      connection,
      email,
    });
    res.cookie(ACCESS_TOKEN_KEY, accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);

    return res.status(StatusCodes.NO_CONTENT).end();
  }),

  logout: errorHandler(async (req, res) => {
    res.clearCookie(ACCESS_TOKEN_KEY);
    return res.status(StatusCodes.NO_CONTENT).end();
  }),

  checkEmail: errorHandler(async (req, res) => {
    const { connection } = req;
    const { email } = req.body;

    const user = await userService.getUserByEmail({ connection, email });

    if (user) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "이미 존재하는 이메일 입니다." });
    }

    return res.status(StatusCodes.NO_CONTENT).end();
  }),

  checkNickname: errorHandler(async (req, res) => {
    const { connection } = req;
    const { nickname } = req.body;

    const user = await userService.getUserByNickname({ connection, nickname });

    if (user) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "이미 존재하는 닉네임 입니다." });
    }

    return res.status(StatusCodes.NO_CONTENT).end();
  }),

  myProfile: errorHandler(async (req, res) => {
    const { connection, userId } = req;

    const profile = await userService.getUserProfile({ connection, userId });

    return res.status(StatusCodes.OK).json(profile);
  }),

  updateMyProfile: errorHandler(async (req, res) => {
    const { connection, userId, file } = req;
    const { password, nickname } = req.body;

    const userByNickname = await userService.getUserByNickname({
      connection,
      nickname,
    });
    if (userByNickname && userByNickname.id !== userId) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "이미 존재하는 닉네임 입니다." });
    }

    let profileImageUrl;
    let profileImagePathname; // '/' 문자 뒤 URL의 경로로, 이후 에러 발생시 S3에 업로드된 이미지를 삭제하기 위해 값을 저장
    if (file) {
      const { fileUrl, filePathname } = await uploadFileToS3({
        file,
        directory: AWS_S3_DIRECTORY.USER_PROFILE_IMAGE,
      });

      profileImageUrl = fileUrl;
      profileImagePathname = filePathname;
    }

    try {
      await userService.updateUserProfile({
        connection,
        userId,
        password,
        nickname,
        profileImageUrl,
      });

      return res.status(StatusCodes.NO_CONTENT).end();
    } catch (error) {
      if (file) {
        await deleteFileFromS3({ pathname: profileImagePathname });
      }
      throw error; // errorHandler로 에러 rethrow
    }
  }),

  confirmPassword: errorHandler(async (req, res) => {
    const { connection, userId } = req;
    const { password } = req.body;

    const isValidPassword = await userService.validatePassword({
      connection,
      userId,
      password,
    });

    if (!isValidPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "비밀번호가 틀렸습니다." });
    }

    return res.status(StatusCodes.NO_CONTENT).end();
  }),
};

export default userController;
