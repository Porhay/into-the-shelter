import React, { useEffect, useRef, useState } from 'react';

interface TimerProps {
  duration: number;
  onTimerEnd: () => void;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimerEnd }) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
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
