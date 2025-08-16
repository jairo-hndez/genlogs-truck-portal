import { API_BASE_URL, ERROR_MESSAGES } from '../constants';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Format city name for API consumption
   * @param {string} city - City name to format
   * @returns {string} Formatted city name
   */
  formatCity(city) {
    const base = city.split(',')[0].trim();
    if (/dc/i.test(city)) {
      return `${base} DC`;
    }
    return base;
  }

  /**
   * Search for carriers between two cities
   * @param {Object} params - Search parameters
   * @param {string} params.from - Origin city
   * @param {string} params.to - Destination city
   * @returns {Promise<Array>} Array of carrier data
   */
  async searchCarriers({ from, to }) {
    try {
      const response = await fetch(`${this.baseURL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from_city: this.formatCity(from),
          to_city: this.formatCity(to),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch carriers:', error);
      
      // Handle different types of errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
      }
      
      throw new Error(error.message || ERROR_MESSAGES.API_ERROR);
    }
  }

  /**
   * Check API health
   * @returns {Promise<Object>} Health status
   */
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      if (!response.ok) {
        throw new Error('Health check failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}

export default new ApiService();
