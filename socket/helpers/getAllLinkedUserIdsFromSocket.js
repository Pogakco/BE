import cookie from "cookie";
import jwt from "jsonwebtoken";

const getAllLinkedUserIdsFromSocket = (socket) => {
  const participantsAccessToken = Object.values(
    Object.fromEntries(socket.sockets)
  ).map(({ handshake }) => cookie.parse(handshake.headers.cookie).access_token);

  const userIds = new Set();
  for (const accessToken of participantsAccessToken) {
    if (!accessToken) continue;

    try {
      const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
      jwt.verify(accessToken, JWT_PRIVATE_KEY);

      const decoded = jwt.decode(accessToken);
      userIds.add(decoded.id);
    } catch (error) {}
  }

  return [...userIds];
};

export default getAllLinkedUserIdsFromSocket;
