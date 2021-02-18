import { useEffect, useRef } from 'react';

export default function useInterval(
  callback: () => unknown,
  delay: number,
): void {
  const savedCallback = useRef<() => unknown>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
