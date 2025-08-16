import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, LoadingSpinner } from '../ui';
import { useGoogleMap } from '../../hooks';
import { FADE_IN_VARIANTS } from '../../constants';
import styles from './MapView.module.css';

const MapView = ({ from, to }) => {
  const { mapRef, isReady, displayDirections } = useGoogleMap({
    zoom: 7,
    center: { lat: 40.7128, lng: -74.0060 },
  });
  
  const [isLoadingDirections, setIsLoadingDirections] = useState(false);
  const [directionsError, setDirectionsError] = useState(null);

  useEffect(() => {
    if (isReady && from && to) {
      const loadDirections = async () => {
        setIsLoadingDirections(true);
        setDirectionsError(null);
        
        try {
          await displayDirections(from, to);
        } catch (error) {
          setDirectionsError('Unable to display route. Please try again.');
          console.error('Failed to display directions:', error);
        } finally {
          setIsLoadingDirections(false);
        }
      };

      loadDirections();
    }
  }, [isReady, from, to, displayDirections]);

  const showRoute = from && to;

  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial="hidden"
      animate="visible"
      className={styles.container}
    >
      <Card className={styles.card} padding="none">
        <div className={styles.header}>
          <h3 className={styles.title}>Route Map</h3>
          {showRoute && (
            <div className={styles.routeInfo}>
              <span className={styles.routeText}>
                {from} → {to}
              </span>
            </div>
          )}
        </div>
        
        <div className={styles.mapWrapper}>
          <div ref={mapRef} className={styles.map} />
          
          {/* Loading overlay for directions */}
          {isLoadingDirections && (
            <div className={styles.overlay}>
              <LoadingSpinner size="lg" color="white" />
              <p className={styles.loadingText}>Loading route...</p>
            </div>
          )}
          
          {/* Error overlay */}
          {directionsError && (
            <div className={styles.errorOverlay}>
              <div className={styles.errorContent}>
                <p className={styles.errorText}>{directionsError}</p>
              </div>
            </div>
          )}
          
          {/* Empty state */}
          {!showRoute && (
            <div className={styles.emptyState}>
              <div className={styles.emptyContent}>
                <svg
                  className={styles.emptyIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <h4 className={styles.emptyTitle}>No Route Selected</h4>
                <p className={styles.emptyDescription}>
                  Search for a route to see it displayed on the map
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default MapView;
