import cookie from "cookie";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_KEY } from "../../constants.js";

const getUserIdFromSocket = (socket) => {
  const cookies = socket.handshake.headers.cookie;

  if (!cookies) {
    return null;
  }

  const accessToken = cookie.parse(cookies)[ACCESS_TOKEN_KEY];

  if (!accessToken) {
    return null;
  }

  try {
    const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

    jwt.verify(accessToken, JWT_PRIVATE_KEY);
    const { id } = jwt.decode(accessToken);

    return id;
  } catch (error) {
    return null;
  }
};

export default getUserIdFromSocket;
