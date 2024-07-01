const calculateOnePomodoroMs = ({ focusTime, shortBreakTime }) => {
  // return (focusTime * 60 + shortBreakTime * 60) * 1000;
  return (focusTime + shortBreakTime) * 1000;
};

export default calculateOnePomodoroMs;
