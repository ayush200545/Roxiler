import React from 'react';
import './Card.css';

const Card = ({ children, className = '', glass = false }) => {
  return (
    <div className={`card ${glass ? 'glass' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
