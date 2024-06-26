import camelcaseKeys from "camelcase-keys";

export const convertSnakeToCamelResponse = () => {
  const snakeCaseResHandler = (_req, res, next) => {
    const send = res.send;
    res.send = function (body) {
      if (body != null) {
        body = camelcaseKeys(JSON.parse(body.toString()), { deep: true });
      }
      send.call(this, Buffer.from(JSON.stringify(body)));
      return res;
    };
    next();
  };

  return [snakeCaseResHandler];
};

export default convertSnakeToCamelResponse;
