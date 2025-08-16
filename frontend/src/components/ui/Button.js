import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import styles from './Button.module.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className,
  ...props
}) => {
  const buttonClasses = clsx(
    styles.button,
    styles[variant],
    styles[size],
    {
      [styles.disabled]: disabled,
      [styles.loading]: loading,
    },
    className
  );

  return (
    <motion.button
      className={buttonClasses}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {loading && (
        <div className={styles.spinner} aria-hidden="true">
          <div className={styles.spinnerIcon}></div>
        </div>
      )}
      <span className={loading ? styles.hiddenText : ''}>{children}</span>
    </motion.button>
  );
};

export default Button;
