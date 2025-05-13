
// Base service for localStorage initialization

// Function to ensure localStorage is available
const isLocalStorageAvailable = (): boolean => {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

// Initialize localStorage if available
export const initializeStorage = (key: string, defaultValue: any): void => {
  if (isLocalStorageAvailable() && !localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
  }
};

// Generic get method for localStorage
export const getFromStorage = <T>(key: string): T => {
  return JSON.parse(localStorage.getItem(key) || '[]') as T;
};

// Generic set method for localStorage
export const setInStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};
