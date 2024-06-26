import crypto from "crypto";

const generateSalt = () => {
  const BYTE_SIZE = 32;
  const ENCODING = "base64";

  return crypto.randomBytes(BYTE_SIZE).toString(ENCODING);
};

export default generateSalt;
