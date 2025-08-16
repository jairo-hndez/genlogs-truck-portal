import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui';
import { FADE_IN_VARIANTS, STAGGER_VARIANTS } from '../../constants';
import styles from './CarrierList.module.css';

const CarrierCard = ({ carrier, index }) => {
  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      transition={{ delay: index * 0.1 }}
    >
      <Card hover className={styles.carrierCard}>
        <div className={styles.carrierHeader}>
          <div className={styles.carrierInfo}>
            <h4 className={styles.carrierName}>{carrier.name}</h4>
            <div className={styles.carrierMeta}>
              <span className={styles.trucksCount}>
                {carrier.trucks_per_day} trucks/day
              </span>
            </div>
          </div>
          <div className={styles.carrierBadge}>
            <svg
              className={styles.truckIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        
        <div className={styles.carrierStats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Daily Capacity</span>
            <span className={styles.statValue}>{carrier.trucks_per_day}</span>
          </div>
          
          {carrier.id && (
            <div className={styles.stat}>
              <span className={styles.statLabel}>Carrier ID</span>
              <span className={styles.statValue}>#{carrier.id}</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

const EmptyState = () => (
  <motion.div
    variants={FADE_IN_VARIANTS}
    initial="hidden"
    animate="visible"
    className={styles.emptyState}
  >
    <Card className={styles.emptyCard}>
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        <h3 className={styles.emptyTitle}>No Carriers Found</h3>
        <p className={styles.emptyDescription}>
          Search for a route to see available carriers in this area.
        </p>
      </div>
    </Card>
  </motion.div>
);

const CarrierList = ({ carriers = [] }) => {
  if (!Array.isArray(carriers) || carriers.length === 0) {
    return <EmptyState />;
  }

  return (
    <motion.div
      variants={STAGGER_VARIANTS}
      initial="hidden"
      animate="visible"
      className={styles.container}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Available Carriers</h2>
        <div className={styles.subtitle}>
          Found {carriers.length} carrier{carriers.length !== 1 ? 's' : ''} for this route
        </div>
      </div>
      
      <div className={styles.grid}>
        {carriers.map((carrier, index) => (
          <CarrierCard
            key={carrier.id || carrier.name || index}
            carrier={carrier}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default CarrierList;
