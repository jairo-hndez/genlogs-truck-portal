import React from 'react';
import { motion } from 'framer-motion';
import styles from './Header.module.css';

const Header = () => {
  return (
    <motion.header
      className={styles.header}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container">
        <div className={styles.content}>
          <div className={styles.branding}>
            <h1 className={styles.title}>Genlogs Carrier Portal</h1>
            <p className={styles.subtitle}>Find the best carriers for your shipping routes</p>
          </div>
          <div className={styles.logoContainer}>
            <img
              src="https://images.squarespace-cdn.com/content/v1/5fe3faeb5af68c2f903b28ba/23bcda92-50ee-4a4c-9a61-704f763ff5ec/genlogs.png"
              alt="Genlogs Logo"
              className={styles.logo}
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
