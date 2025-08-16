import { useState, useCallback } from 'react';
import storageService from '../services/storageService';

export const useLocalStorage = (key, defaultValue = null) => {
  const [value, setValue] = useState(() => {
    return storageService.getItem(key, defaultValue);
  });

  const setStoredValue = useCallback((newValue) => {
    try {
      // Allow value to be a function for the same API as useState
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      
      setValue(valueToStore);
      storageService.setItem(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  const removeStoredValue = useCallback(() => {
    try {
      setValue(defaultValue);
      storageService.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  return [value, setStoredValue, removeStoredValue];
};

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useLocalStorage('genlogs_search_history', []);

  const addToHistory = useCallback((searchData) => {
    storageService.addToSearchHistory(searchData);
    setSearchHistory(storageService.getSearchHistory());
  }, [setSearchHistory]);

  const clearHistory = useCallback(() => {
    storageService.clearSearchHistory();
    setSearchHistory([]);
  }, [setSearchHistory]);

  return {
    searchHistory,
    addToHistory,
    clearHistory,
  };
};

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useLocalStorage(
    'genlogs_user_preferences',
    {
      theme: 'light',
      mapType: 'roadmap',
      showAlternativeRoutes: true,
    }
  );

  const updatePreferences = useCallback((updates) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    storageService.updateUserPreferences(updates);
  }, [preferences, setPreferences]);

  return {
    preferences,
    updatePreferences,
  };
};
