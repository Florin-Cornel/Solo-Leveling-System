import { useState, useEffect, useCallback, useRef } from 'react';

export function useLocalStorage(key, initialValue) {
  // Use a ref to always have access to the latest stored value
  const storedValueRef = useRef(null);

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      const value = item ? JSON.parse(item) : initialValue;
      storedValueRef.current = value;
      return value;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      storedValueRef.current = initialValue;
      return initialValue;
    }
  });

  // Keep ref in sync with state
  useEffect(() => {
    storedValueRef.current = storedValue;
  }, [storedValue]);

  const setValue = useCallback((value) => {
    try {
      // Use ref to get latest value for function updates
      const currentValue = storedValueRef.current;
      const valueToStore = value instanceof Function ? value(currentValue) : value;
      storedValueRef.current = valueToStore;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        const newValue = JSON.parse(e.newValue);
        storedValueRef.current = newValue;
        setStoredValue(newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
