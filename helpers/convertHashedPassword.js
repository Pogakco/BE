import crypto from "crypto";

const convertHashedPassword = (password, salt) => {
  const ITERATIONS = 10000;
  const KEYLEN = 64;
  const DIGEST = "sha512";
  const ENCODING = "base64";

  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST)
    .toString(ENCODING);

  return hashedPassword;
};

export default convertHashedPassword;
