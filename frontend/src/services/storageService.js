import { STORAGE_KEYS } from '../constants';

class StorageService {
  /**
   * Check if localStorage is available
   * @returns {boolean} True if localStorage is available
   */
  isAvailable() {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get item from localStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if item doesn't exist
   * @returns {*} Parsed value or default value
   */
  getItem(key, defaultValue = null) {
    if (!this.isAvailable()) {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Failed to get item from localStorage:', error);
      return defaultValue;
    }
  }

  /**
   * Set item in localStorage
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @returns {boolean} True if successful
   */
  setItem(key, value) {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Failed to set item in localStorage:', error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} True if successful
   */
  removeItem(key) {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to remove item from localStorage:', error);
      return false;
    }
  }

  /**
   * Get search history
   * @returns {Array} Array of search history items
   */
  getSearchHistory() {
    return this.getItem(STORAGE_KEYS.SEARCH_HISTORY, []);
  }

  /**
   * Add search to history
   * @param {Object} searchData - Search data to store
   * @param {string} searchData.from - Origin city
   * @param {string} searchData.to - Destination city
   * @param {number} searchData.resultCount - Number of results found
   */
  addToSearchHistory({ from, to, resultCount }) {
    const history = this.getSearchHistory();
    const newSearch = {
      id: Date.now(),
      from,
      to,
      resultCount,
      timestamp: new Date().toISOString(),
    };

    // Remove duplicate searches (same from/to combination)
    const filteredHistory = history.filter(
      item => !(item.from === from && item.to === to)
    );

    // Add new search to beginning and limit to 10 items
    const updatedHistory = [newSearch, ...filteredHistory].slice(0, 10);
    
    this.setItem(STORAGE_KEYS.SEARCH_HISTORY, updatedHistory);
  }

  /**
   * Clear search history
   */
  clearSearchHistory() {
    this.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
  }

  /**
   * Get user preferences
   * @returns {Object} User preferences object
   */
  getUserPreferences() {
    return this.getItem(STORAGE_KEYS.USER_PREFERENCES, {
      theme: 'light',
      mapType: 'roadmap',
      showAlternativeRoutes: true,
    });
  }

  /**
   * Update user preferences
   * @param {Object} preferences - Preferences to update
   */
  updateUserPreferences(preferences) {
    const current = this.getUserPreferences();
    const updated = { ...current, ...preferences };
    this.setItem(STORAGE_KEYS.USER_PREFERENCES, updated);
  }
}

export default new StorageService();
