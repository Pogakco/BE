/**
 * '/' 문자 뒤 URL의 경로를 반환 하는 함수 입니다.
 * @param {string} url
 * @returns string
 */
const getPathnameFromUrl = (url) => {
  const urlObj = new URL(url);

  return urlObj.pathname.slice(1);
};

export default getPathnameFromUrl;
