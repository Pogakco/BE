import { IS_DEV_MODE, MINUTE_MS, SECOND_MS } from "../../../constants.js";

// 단위 시간을 개발(1초), 운영(1분) 환경 별로 다르게 설정
const TIME_UNIT = IS_DEV_MODE ? SECOND_MS : MINUTE_MS;

export const calculateOnePomodoroMs = ({ focusTime, shortBreakTime }) => {
  return (focusTime + shortBreakTime) * TIME_UNIT;
};

const calculateLongBreakTimeMs = (longBreakTime) => {
  return longBreakTime * TIME_UNIT;
};

const calculateTimerTotalMs = ({
  focusTime,
  shortBreakTime,
  totalCycles,
  longBreakTime,
}) => {
  return (
    calculateOnePomodoroMs({ focusTime, shortBreakTime }) * totalCycles +
    calculateLongBreakTimeMs(longBreakTime)
  );
};

export const calculateTimerTotalMsWithDelay = ({
  focusTime,
  shortBreakTime,
  totalCycles,
  longBreakTime,
}) => {
  const delayMs = 5 * SECOND_MS; // 각 클라이언트들의 타이머 종료를 기다리고, 맞지 않는 싱크를 보정하기 위해 사용되는 값

  return (
    calculateTimerTotalMs({
      focusTime,
      shortBreakTime,
      totalCycles,
      longBreakTime,
    }) + delayMs
  );
};
