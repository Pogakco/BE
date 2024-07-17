import { SECOND_MS } from "../../../constants.js";

export const calculateOnePomodoroMs = ({ focusTime, shortBreakTime }) => {
  return (focusTime + shortBreakTime) * SECOND_MS; // TODO: 타이머 개발단계 마무리 되면 MINUTE_MS으로 변경
};

const calculateLongBreakTimeMs = (longBreakTime) => {
  return longBreakTime * SECOND_MS; // TODO: 타이머 개발단계 마무리 되면 MINUTE_MS으로 변경
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
  const delayMs = 2 * SECOND_MS; // 각 클라이언트들의 타이머 종료를 기다리고, 맞지 않는 싱크를 보정하기 위해 사용되는 값

  return (
    calculateTimerTotalMs({
      focusTime,
      shortBreakTime,
      totalCycles,
      longBreakTime,
    }) + delayMs
  );
};
