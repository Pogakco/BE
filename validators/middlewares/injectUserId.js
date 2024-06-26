import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_KEY } from "../../constants.js";

const injectUserId = (req, res, next) => {
  const accessToken = req.cookies[ACCESS_TOKEN_KEY];

  if (!accessToken) {
    return next();
  }

  try {
    const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
    const decodedJwt = jwt.verify(accessToken, JWT_PRIVATE_KEY);
    req.userId = decodedJwt.id;
  } catch (error) {
  } finally {
    return next();
  }
};

export default injectUserId;
