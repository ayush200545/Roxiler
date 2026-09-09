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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem 0' }}>
      <Card glass={true} style={{ width: '100%', maxWidth: '500px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Create an Account</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)', fontSize: '0.875rem' }}>Join the rating platform today.</p>
        
        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input 
            label="Full Name (20-60 characters)" 
            name="name" 
            placeholder="John Doe..."
            value={formData.name}
            onChange={handleChange}
            required 
          />
          <Input 
            label="Email Address" 
            name="email" 
            type="email" 
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required 
          />
          <Input 
            label="Password" 
            name="password" 
            type="password" 
            placeholder="Min 8 chars, 1 Uppercase, 1 Special"
            value={formData.password}
            onChange={handleChange}
            required 
          />
          <Input 
            label="Address" 
            name="address" 
            placeholder="123 Main St, City, Country"
            value={formData.address}
            onChange={handleChange}
            required 
          />
          
          <Button type="submit" fullWidth disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)' }}>Sign in here</Link>
        </p>
      </Card>
    </div>
  );
};

export default Signup;
