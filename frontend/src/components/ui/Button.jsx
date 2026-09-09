import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  type = 'button', 
  disabled = false, 
  onClick, 
  className = '' 
}) => {
  const classes = `btn btn-${variant} ${fullWidth ? 'btn-full-width' : ''} ${className}`;

  return (
    <button 
      type={type} 
      className={classes} 
      disabled={disabled} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
