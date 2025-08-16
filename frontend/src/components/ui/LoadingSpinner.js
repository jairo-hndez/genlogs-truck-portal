import React from 'react';
import clsx from 'clsx';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  className,
  ...props
}) => {
  const spinnerClasses = clsx(
    styles.spinner,
    styles[size],
    styles[color],
    className
  );

  return (
    <div className={spinnerClasses} role="status" aria-label="Loading" {...props}>
      <div className={styles.circle}></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
