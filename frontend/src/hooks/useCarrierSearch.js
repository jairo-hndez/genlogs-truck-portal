import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import apiService from '../services/apiService';
import storageService from '../services/storageService';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';

export const useCarrierSearch = () => {
  const [carriers, setCarriers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [route, setRoute] = useState({ from: null, to: null });

  const searchCarriers = useCallback(async ({ from, to }) => {
    if (!from || !to) {
      const error = ERROR_MESSAGES.CITY_REQUIRED;
      setError(error);
      toast.error(error);
      return;
    }

    setIsLoading(true);
    setError(null);
    setCarriers([]);

    try {
      const data = await apiService.searchCarriers({ from, to });
      
      setCarriers(data || []);
      setRoute({ from, to });
      
      // Add to search history
      storageService.addToSearchHistory({
        from,
        to,
        resultCount: data?.length || 0,
      });

      // Show success message
      toast.success(
        `Found ${data?.length || 0} carriers for ${from} to ${to}`
      );

    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.API_ERROR;
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Search failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setCarriers([]);
    setRoute({ from: null, to: null });
    setError(null);
  }, []);

  const retrySearch = useCallback(() => {
    if (route.from && route.to) {
      searchCarriers(route);
    }
  }, [route, searchCarriers]);

  return {
    carriers,
    isLoading,
    error,
    route,
    searchCarriers,
    clearSearch,
    retrySearch,
  };
};
