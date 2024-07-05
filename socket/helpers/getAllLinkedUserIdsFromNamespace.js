import cookie from "cookie";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_KEY } from "../../constants.js";

const getAllLinkedUserIdsFromNamespace = (namespace) => {
  const linkedSockets = Object.values(Object.fromEntries(namespace.sockets));

  const userCookies = linkedSockets
    .map(({ handshake }) => handshake.headers.cookie)
    .filter((cookies) => !!cookies);

  const participantAccessTokens = userCookies.map(
    (cookies) => cookie.parse(cookies)[ACCESS_TOKEN_KEY]
  );

  const userIds = new Set(); // 한 유저가 중복 접속하는 경우를 고려해서 Set 사용
  for (const accessToken of participantAccessTokens) {
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

export default getAllLinkedUserIdsFromNamespace;
