import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import styles from './Card.module.css';

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className,
  ...props
}) => {
  const cardClasses = clsx(
    styles.card,
    styles[variant],
    styles[`padding-${padding}`],
    {
      [styles.hover]: hover,
    },
    className
  );

  const MotionComponent = hover ? motion.div : 'div';
  
  const motionProps = hover
    ? {
        whileHover: { y: -2, boxShadow: 'var(--shadow-xl)' },
        transition: { duration: 0.2 }
      }
    : {};

  return (
    <MotionComponent
      className={cardClasses}
      {...motionProps}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

const CardHeader = ({ children, className, ...props }) => (
  <div className={clsx(styles.header, className)} {...props}>
    {children}
  </div>
);

const CardBody = ({ children, className, ...props }) => (
  <div className={clsx(styles.body, className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className, ...props }) => (
  <div className={clsx(styles.footer, className)} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
