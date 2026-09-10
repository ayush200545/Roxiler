import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Store } from 'lucide-react';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
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
      backgroundColor: 'var(--bg-main)'
    }}>
      <Card style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: 'var(--radius-lg)',
            backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 1rem'
          }}>
            <Store size={28} color="var(--accent-primary)" />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Store Rating Platform</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Sign in to your account.</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '0.65rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
            label="Password" 
            name="password" 
            type="password" 
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required 
          />
          
          <Button type="submit" fullWidth disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Signing in...' : 'Login'}
          </Button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>

        <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Discover. Rate. Support.</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Real reviews. Real people. Better choices.</p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
