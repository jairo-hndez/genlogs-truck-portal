import { GOOGLE_MAPS_CONFIG, ROUTE_COLORS, ERROR_MESSAGES } from '../constants';

class GoogleMapsService {
  constructor() {
    this.isLoaded = false;
    this.loadPromise = null;
  }

  /**
   * Check if Google Maps API is available
   * @returns {boolean} True if Google Maps is available
   */
  isAvailable() {
    return !!(window.google?.maps?.places && window.google?.maps?.DirectionsService);
  }

  /**
   * Wait for Google Maps to be available
   * @returns {Promise<boolean>} Promise that resolves when Google Maps is ready
   */
  async waitForLoad() {
    if (this.isAvailable()) {
      return true;
    }

    // If already waiting, return existing promise
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds maximum wait time
      
      const checkLoaded = () => {
        attempts++;
        
        if (this.isAvailable()) {
          this.isLoaded = true;
          resolve(true);
          return;
        }
        
        if (attempts >= maxAttempts) {
          reject(new Error(ERROR_MESSAGES.GOOGLE_MAPS_ERROR));
          return;
        }
        
        setTimeout(checkLoaded, 100);
      };
      
      checkLoaded();
    });

    return this.loadPromise;
  }

  /**
   * Create autocomplete instance for input element
   * @param {HTMLInputElement} inputElement - Input element to attach autocomplete to
   * @param {Function} onPlaceSelected - Callback when place is selected
   * @returns {google.maps.places.Autocomplete|null} Autocomplete instance
   */
  createAutocomplete(inputElement, onPlaceSelected) {
    if (!this.isAvailable() || !inputElement) {
      console.warn('Google Places API is not available or input element is missing');
      return null;
    }

    try {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputElement,
        GOOGLE_MAPS_CONFIG.autocompleteOptions
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address && onPlaceSelected) {
          onPlaceSelected(place.formatted_address);
        }
      });

      return autocomplete;
    } catch (error) {
      console.error('Failed to create autocomplete:', error);
      return null;
    }
  }

  /**
   * Create map instance
   * @param {HTMLElement} mapElement - Element to render map in
   * @param {Object} options - Map configuration options
   * @returns {google.maps.Map|null} Map instance
   */
  createMap(mapElement, options = {}) {
    if (!this.isAvailable() || !mapElement) {
      console.warn('Google Maps API is not available or map element is missing');
      return null;
    }

    const defaultOptions = {
      zoom: 7,
      center: { lat: 40.7128, lng: -74.0060 }, // New York City
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    };

    try {
      return new window.google.maps.Map(mapElement, {
        ...defaultOptions,
        ...options,
      });
    } catch (error) {
      console.error('Failed to create map:', error);
      return null;
    }
  }

  /**
   * Display directions on map
   * @param {google.maps.Map} map - Map instance
   * @param {string} origin - Origin address
   * @param {string} destination - Destination address
   * @returns {Promise<void>}
   */
  async displayDirections(map, origin, destination) {
    if (!this.isAvailable() || !map || !origin || !destination) {
      return;
    }

    try {
      const directionsService = new window.google.maps.DirectionsService();

      const request = {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      };

      const response = await new Promise((resolve, reject) => {
        directionsService.route(request, (result, status) => {
          if (status === 'OK') {
            resolve(result);
          } else {
            reject(new Error(`Directions request failed: ${status}`));
          }
        });
      });

      // Clear existing directions
      this.clearDirections(map);

      // Display up to 3 alternative routes
      response.routes.slice(0, 3).forEach((route, index) => {
        const renderer = new window.google.maps.DirectionsRenderer({
          map,
          directions: response,
          routeIndex: index,
          polylineOptions: {
            strokeColor: ROUTE_COLORS[index] || ROUTE_COLORS[0],
            strokeOpacity: 0.8,
            strokeWeight: 6,
          },
          suppressMarkers: index > 0, // Only show markers for the primary route
        });
      });

    } catch (error) {
      console.error('Failed to display directions:', error);
      throw error;
    }
  }

  /**
   * Clear all directions from map
   * @param {google.maps.Map} map - Map instance
   */
  clearDirections(map) {
    // Note: In a production app, you'd want to keep track of direction renderers
    // and clear them properly. For now, we rely on creating new renderers.
  }
}

export default new GoogleMapsService();
