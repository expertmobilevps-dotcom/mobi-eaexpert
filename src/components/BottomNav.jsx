import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/components.css';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-btn ${isActive('/metatrader') ? 'active' : ''}`}
        onClick={() => navigate('/metatrader')}
      >
        <span className="nav-icon">📊</span>
        <span>MetaTrader</span>
      </button>

      <button 
        className={`nav-btn home-btn ${isActive('/home') ? 'active' : ''}`}
        onClick={() => navigate('/home')}
      >
        <span className="nav-icon">🏠</span>
        <span>Home</span>
      </button>

      <button 
        className={`nav-btn ${isActive('/settings') ? 'active' : ''}`}
        onClick={() => navigate('/settings')}
      >
        <span className="nav-icon">⚙️</span>
        <span>Settings</span>
      </button>
    </nav>
  );
}
