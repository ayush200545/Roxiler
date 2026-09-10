import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Signup = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    address: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (formData.name.length < 20 || formData.name.length > 60) {
      return "Name must be between 20 and 60 characters.";
    }
    const pwdRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    if (!pwdRegex.test(formData.password)) {
      return "Password must be 8-16 chars, with at least 1 uppercase & 1 special character.";
    }
    if (formData.address.length > 400) {
      return "Address must be less than 400 characters.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const result = await register(formData);
    
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: 'var(--bg-main)',
      padding: '2rem 0'
    }}>
      <Card style={{ width: '100%', maxWidth: '480px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Create Your Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Join the Store Rating Platform</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '0.65rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input 
            label="Name" 
            name="name" 
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required 
          />
          <Input 
            label="Email" 
            name="email" 
            type="email" 
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required 
          />
          <Input 
            label="Address" 
            name="address" 
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
            required 
          />
          <Input 
            label="Password" 
            name="password" 
            type="password" 
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required 
          />
          
          <Button type="submit" fullWidth disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </Card>
    </div>
  );
};

export default Signup;
