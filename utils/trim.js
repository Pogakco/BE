export const trimStart = (str, trimChar) => {
  while (str.startsWith(trimChar)) {
    str = str.slice(trimChar.length);
  }
  return str;
};

export const trimEnd = (str, trimChar) => {
  while (str.endsWith(trimChar)) {
    str = str.slice(0, -trimChar.length);
  }
  return str;
};

export const trim = (str, trimChar) => {
  let result = str;

  result = trimStart(result, trimChar);
  result = trimEnd(result, trimChar);

  return result;
};
