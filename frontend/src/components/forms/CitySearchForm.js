import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input, Button, Card } from '../ui';
import { useAutocomplete } from '../../hooks';
import { ERROR_MESSAGES, FADE_IN_VARIANTS } from '../../constants';
import styles from './CitySearchForm.module.css';

const CitySearchForm = ({ onSearch, isLoading }) => {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [error, setError] = useState('');

  const { inputRef: fromInputRef } = useAutocomplete(setFromCity);
  const { inputRef: toInputRef } = useAutocomplete(setToCity);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!fromCity || !toCity) {
      setError(ERROR_MESSAGES.CITY_REQUIRED);
      return;
    }
    
    setError('');
    onSearch({ from: fromCity, to: toCity });
  };

  const swapCities = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial="hidden"
      animate="visible"
      className={styles.container}
    >
      <Card className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.header}>
            <h2 className={styles.title}>Search Routes</h2>
            <p className={styles.description}>
              Find carriers for your shipping route
            </p>
          </div>

          <div className={styles.inputs}>
            <div className={styles.inputGroup}>
              <Input
                ref={fromInputRef}
                label="From"
                placeholder="Enter origin city"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                error={error && !fromCity ? 'Origin city is required' : ''}
                required
              />
            </div>

            <div className={styles.swapContainer}>
              <Button
                type="button"
                variant="ghost"
                onClick={swapCities}
                className={styles.swapButton}
                disabled={!fromCity && !toCity}
                aria-label="Swap cities"
              >
                <svg
                  className={styles.swapIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              </Button>
            </div>

            <div className={styles.inputGroup}>
              <Input
                ref={toInputRef}
                label="To"
                placeholder="Enter destination city"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                error={error && !toCity ? 'Destination city is required' : ''}
                required
              />
            </div>
          </div>

          {error && (
            <motion.div
              className={styles.errorContainer}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className={styles.error}>{error}</div>
            </motion.div>
          )}

          <div className={styles.actions}>
            <Button
              type="submit"
              size="lg"
              loading={isLoading}
              disabled={!fromCity || !toCity}
              className={styles.searchButton}
            >
              {isLoading ? 'Searching...' : 'Search Carriers'}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default CitySearchForm;
