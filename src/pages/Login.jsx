import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import '../styles/pages.css';

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !licenseKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter email and license key',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const result = await import('../services/api.js').then(module => module.login(email, licenseKey));
      if (result.success && result.sessionId) {
        localStorage.setItem('sessionId', result.sessionId);
        localStorage.setItem('auth', JSON.stringify({ email, licenseKey }));
        toast({ title: 'Success', description: 'Logged in successfully!' });
        navigate('/home');
      } else {
        toast({ title: 'Error', description: result.message || 'Login failed.', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: error.message || 'Login failed. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">MOBI EA</h1>
        <p className="login-subtitle">Trading Robot Management</p>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="License Key"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              className="login-input"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="login-footer">
          Don't have a license? Contact a mentor to get started.
        </p>
      </div>
    </div>
  );
}
