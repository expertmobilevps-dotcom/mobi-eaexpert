import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import '../styles/pages.css';

export default function Settings() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);
  const [autoTrade, setAutoTrade] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const api = await import('../services/api.js');
        const result = await api.getSession();
        setEmail(result.email || '');
      } catch (error) {
        console.error('Unable to load profile', error);
        navigate('/login');
      }
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const api = await import('../services/api.js');
      await api.logout();
    } catch (error) {
      console.warn('Logout failed', error);
    }
    localStorage.removeItem('sessionId');
    localStorage.removeItem('auth');
    navigate('/login');
  };

  const handleSaveSettings = () => {
    const settings = {
      theme,
      notifications,
      autoTrade
    };
    localStorage.setItem('settings', JSON.stringify(settings));
    alert('Settings saved!');
  };

  return (
    <div className="page-container settings-page">
      <header className="page-header">
        <h1>Settings</h1>
        <p>Manage your preferences</p>
      </header>

      <div className="content-area">
        <section className="settings-section">
          <h2>Profile</h2>
          <div className="setting-item">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              readOnly 
              className="setting-input"
            />
          </div>
        </section>

        <section className="settings-section">
          <h2>Appearance</h2>
          <div className="setting-item">
            <label>Theme</label>
            <select 
              value={theme} 
              onChange={(e) => setTheme(e.target.value)}
              className="setting-input"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </section>

        <section className="settings-section">
          <h2>Notifications</h2>
          <div className="setting-toggle">
            <label>Enable Notifications</label>
            <input 
              type="checkbox" 
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="setting-checkbox"
            />
          </div>
        </section>

        <section className="settings-section">
          <h2>Trading</h2>
          <div className="setting-toggle">
            <label>Auto Trading</label>
            <input 
              type="checkbox" 
              checked={autoTrade}
              onChange={(e) => setAutoTrade(e.target.checked)}
              className="setting-checkbox"
            />
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-actions">
            <button 
              className="btn btn-primary"
              onClick={handleSaveSettings}
            >
              Save Settings
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </section>

        <p className="settings-version">MOBI EA v1.0.0</p>
      </div>

      <BottomNav activeTab="settings" />
    </div>
  );
}
