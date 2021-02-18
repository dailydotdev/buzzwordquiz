import { useState } from 'react';
import useInterval from './useInterval';

type UseTimerReturn = {
  millisecondsLeft: number;
  quantizedProgress: number;
};

export default function useTimer(
  milliseconds: number,
  paused: boolean,
  quanitzation: number,
  onTimeout: () => unknown,
): UseTimerReturn {
  const [accumulated, setAccumulated] = useState(0);
  const [lastTime, setLastTime] = useState(new Date());

  useInterval(() => {
    const now = new Date();
    if (!paused && milliseconds > accumulated) {
      const newAccumulated = accumulated + now.getTime() - lastTime.getTime();
      setAccumulated(newAccumulated);
      if (milliseconds <= newAccumulated) {
        onTimeout();
      }
    }
    setLastTime(now);
  }, 100);

  return {
    millisecondsLeft: Math.max(milliseconds - accumulated, 0),
    quantizedProgress: Math.min(
      Math.floor((accumulated * quanitzation) / milliseconds),
      quanitzation - 1,
    ),
  };
}
