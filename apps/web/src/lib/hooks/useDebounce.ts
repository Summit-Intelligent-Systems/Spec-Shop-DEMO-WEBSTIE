import { useEffect, useRef, useState } from 'react';

/**
 * Debounce a value by a specified delay.
 * Useful for search inputs to avoid firing an API call on every keystroke.
 *
 * @example
 * const debouncedSearch = useDebounce(searchQuery, 400);
 * // debouncedSearch only updates 400ms after the last change
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttle a callback — executes at most once per interval.
 * Useful for scroll handlers and resize events.
 */
export function useThrottle<T>(value: T, interval = 200): T {
  const [throttled, setThrottled] = useState<T>(value);
  const lastUpdated = useRef<number | null>(null);

  useEffect(() => {
    const now = Date.now();
    if (lastUpdated.current === null || now - lastUpdated.current >= interval) {
      lastUpdated.current = now;
      setThrottled(value);
    } else {
      const id = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottled(value);
      }, interval);
      return () => clearTimeout(id);
    }
  }, [value, interval]);

  return throttled;
}
