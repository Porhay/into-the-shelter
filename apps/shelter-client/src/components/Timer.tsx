import React, { useEffect, useRef, useState } from 'react';

interface TimerProps {
  timerEndTime: number;
  onTimerEnd: () => void;
}

const Timer: React.FC<TimerProps> = ({ timerEndTime, onTimerEnd }) => {
  const calculateTimeRemaining = () => {
    const now = new Date().getTime();
    const timeRemaining = Math.max(0, timerEndTime - now);
    return Math.floor(timeRemaining / 1000); // Convert milliseconds to seconds
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startTimer = () => {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime === 0) {
            clearInterval(intervalRef.current!);
            onTimerEnd();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    };

    startTimer();

    return () => {
      clearInterval(intervalRef.current!);
    };
  }, [onTimerEnd]);

  return <span>{timeRemaining}</span>;
};

export default Timer;
