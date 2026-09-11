import { useState, useCallback } from 'react';
import { safeJsonParse, isBrowser } from '@nayan-sukh-eyewear/utils';

/**
 * Persist state to localStorage with JSON serialization.
 * Falls back gracefully if localStorage is unavailable (SSR, private mode).
 *
 * @example
 * const [recentlyViewed, setRecentlyViewed] = useLocalStorage<string[]>('recently-viewed', []);
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const readValue = useCallback((): T => {
    if (!isBrowser) return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? safeJsonParse<T>(item, initialValue) : initialValue;
    } catch (error) {
      console.warn(`useLocalStorage: Error reading "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const newValue = value instanceof Function ? value(storedValue) : value;
        setStoredValue(newValue);
        if (isBrowser) {
          window.localStorage.setItem(key, JSON.stringify(newValue));
          // Dispatch storage event for cross-tab sync
          window.dispatchEvent(new StorageEvent('storage', { key }));
        }
      } catch (error) {
        console.warn(`useLocalStorage: Error setting "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (isBrowser) {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`useLocalStorage: Error removing "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}
