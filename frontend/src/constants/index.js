// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Google Maps Configuration
export const GOOGLE_MAPS_CONFIG = {
  libraries: ['places', 'marker'],
  autocompleteOptions: {
    types: ['(cities)'],
    componentRestrictions: { country: 'us' }, // Restrict to US cities
  },
};

// Route Colors for Google Maps
export const ROUTE_COLORS = ['#1976D2', '#388E3C', '#F57C00'];

// Animation Variants
export const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const STAGGER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  API_ERROR: 'Failed to fetch data. Please try again later.',
  GOOGLE_MAPS_ERROR: 'Google Maps failed to load. Please refresh the page.',
  FORM_VALIDATION: 'Please fill in all required fields.',
  CITY_REQUIRED: 'Please select both a "From" and "To" city.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SEARCH_COMPLETE: 'Search completed successfully!',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  SEARCH_HISTORY: 'genlogs_search_history',
  USER_PREFERENCES: 'genlogs_user_preferences',
};
