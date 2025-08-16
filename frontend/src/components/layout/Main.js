import React from 'react';
import { motion } from 'framer-motion';
import styles from './Main.module.css';

const Main = ({ children, className, ...props }) => {
  return (
    <motion.main
      className={`${styles.main} ${className || ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      {...props}
    >
      <div className="container">
        {children}
      </div>
    </motion.main>
  );
};

export default Main;
