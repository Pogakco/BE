const SECOND_MS = 1000;
const MINUTE_MS = SECOND_MS;
// const MINUTE_MS = 60 * SECOND_MS TODO: 타이머 개발단계 마무리 되면 해당 코드 적용

export const calculateOnePomodoroMs = ({ focusTime, shortBreakTime }) => {
  return (focusTime + shortBreakTime) * MINUTE_MS;
};

const calculateLongBreakTimeMs = (longBreakTime) => {
  return longBreakTime * MINUTE_MS;
};

export const calculateTimerTotalMs = ({
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
