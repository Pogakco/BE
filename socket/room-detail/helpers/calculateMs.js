const SECOND_MS = 1000;
const MINUTE_MS = SECOND_MS;
// const MINUTE_MS = 60 * SECOND_MS TODO: 타이머 개발단계 마무리 되면 해당 코드 적용

export const calculateOnePomodoroMs = ({ focusTime, shortBreakTime }) => {
  return (focusTime + shortBreakTime) * MINUTE_MS;
};

const calculateLongBreakTimeMs = (longBreakTime) => {
  return longBreakTime * MINUTE_MS;
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
