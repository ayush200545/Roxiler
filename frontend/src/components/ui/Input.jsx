import React from 'react';
import './Input.css';

const Input = ({ 
  label, 
  id, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  name, 
  error,
  required = false
}) => {
  return (
    <div className="input-group">
      {label && <label htmlFor={id || name} className="input-label">{label} {required && '*'}</label>}
      <input
        id={id || name}
        name={name}
        type={type}
        className={`input-field ${error ? 'error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
};

export default Input;
