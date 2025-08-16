import { useState, useEffect, useRef, useCallback } from 'react';
import googleMapsService from '../services/googleMapsService';

export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        setIsLoading(true);
        await googleMapsService.waitForLoad();
        setIsLoaded(true);
      } catch (error) {
        setLoadError(error.message);
        console.error('Failed to load Google Maps:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGoogleMaps();
  }, []);

  return {
    isLoaded,
    isLoading,
    loadError,
    isAvailable: googleMapsService.isAvailable(),
  };
};

export const useAutocomplete = (onPlaceSelected) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = googleMapsService.createAutocomplete(
        inputRef.current,
        onPlaceSelected
      );
    }

    return () => {
      if (autocompleteRef.current) {
        // Clean up autocomplete listeners
        window.google?.maps?.event?.clearInstanceListeners?.(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [isLoaded, onPlaceSelected]);

  return {
    inputRef,
    isReady: isLoaded && !!autocompleteRef.current,
  };
};

export const useGoogleMap = (options = {}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    if (isLoaded && mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = googleMapsService.createMap(mapRef.current, options);
    }
  }, [isLoaded, options]);

  const displayDirections = useCallback(async (origin, destination) => {
    if (mapInstanceRef.current && origin && destination) {
      try {
        await googleMapsService.displayDirections(
          mapInstanceRef.current,
          origin,
          destination
        );
      } catch (error) {
        console.error('Failed to display directions:', error);
        throw error;
      }
    }
  }, []);

  return {
    mapRef,
    map: mapInstanceRef.current,
    isReady: isLoaded && !!mapInstanceRef.current,
    displayDirections,
  };
};
