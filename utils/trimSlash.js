export const trimStartSlash = (str) => {
  if (str.startsWith("/")) {
    return str.slice(1);
  }

  return str;
};

export const trimEndSlash = (str) => {
  if (str.endsWith("/")) {
    return str.slice(0, -1);
  }

  return str;
};
