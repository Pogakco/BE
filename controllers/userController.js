import { StatusCodes } from "http-status-codes";
import { ACCESS_TOKEN_KEY } from "../constants.js";
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
    res.cookie(ACCESS_TOKEN_KEY, accessToken, {
      httpOnly: true,
      // secure: !IS_DEV_MODE, TODO: 운영 환경 HTTPS 적용 후 주석 해제
      sameSite: "lax",
    });

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
};

export default userController;
