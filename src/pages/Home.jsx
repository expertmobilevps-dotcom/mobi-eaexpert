import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import SignalCard from '../components/SignalCard';
import '../styles/pages.css';

export default function Home() {
  const navigate = useNavigate();
  const [robots, setRobots] = useState([]);
  const [selectedRobot, setSelectedRobot] = useState(null);
  const [isTrading, setIsTrading] = useState(false);

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      navigate('/login');
      return;
    }

    const loadRobots = async () => {
      try {
        const api = await import('../services/api.js');
        const result = await api.getSession();
        const auth = result.email ? { email: result.email } : null;
        if (!auth) {
          navigate('/login');
          return;
        }
      } catch (error) {
        console.error('Unable to load session', error);
        navigate('/login');
      }

      setRobots([
        {
          id: 1,
          name: 'Navigator Scalper Pro',
          status: 'online',
          daysLeft: 45,
          balance: 5000,
          equity: 5250,
          profitToday: 250
        },
        {
          id: 2,
          name: 'PinkSpectra X',
          status: 'idle',
          daysLeft: 30,
          balance: 3000,
          equity: 3100,
          profitToday: 100
        }
      ]);

      setSelectedRobot((prev) => prev || {
        id: 1,
        name: 'Navigator Scalper Pro',
        status: 'online',
        daysLeft: 45,
        balance: 5000,
        equity: 5250,
        profitToday: 250
      });
    };

    loadRobots();
  }, [navigate]);

  const handleStartTrading = (robot) => {
    setSelectedRobot(robot);
    setIsTrading(true);
  };

  const handleStopTrading = () => {
    setIsTrading(false);
  };

  return (
    <div className="page-container home-page">
      <header className="page-header">
        <h1>MOBI EA Dashboard</h1>
        <p>Real-time Trading Performance</p>
      </header>

      <div className="content-area">
        {selectedRobot && (
          <div className="robot-card">
            <div className="robot-header">
              <h2>{selectedRobot.name}</h2>
              <span className={`status ${selectedRobot.status}`}>
                {selectedRobot.status.toUpperCase()}
              </span>
            </div>

            <div className="robot-stats">
              <div className="stat">
                <label>Balance</label>
                <span className="stat-value">${selectedRobot.balance}</span>
              </div>
              <div className="stat">
                <label>Equity</label>
                <span className="stat-value">${selectedRobot.equity}</span>
              </div>
              <div className="stat">
                <label>Today's Profit</label>
                <span className="stat-value profit">+${selectedRobot.profitToday}</span>
              </div>
              <div className="stat">
                <label>Days Left</label>
                <span className="stat-value">{selectedRobot.daysLeft}d</span>
              </div>
            </div>

            <div className="robot-actions">
              {!isTrading ? (
                <button 
                  className="btn btn-primary"
                  onClick={() => handleStartTrading(selectedRobot)}
                >
                  Start Trading
                </button>
              ) : (
                <button 
                  className="btn btn-danger"
                  onClick={handleStopTrading}
                >
                  Stop Trading
                </button>
              )}
            </div>
          </div>
        )}

        <div className="robots-list">
          <h3>Your Robots</h3>
          {robots.map(robot => (
            <SignalCard
              key={robot.id}
              robot={robot}
              isSelected={selectedRobot?.id === robot.id}
              onSelect={setSelectedRobot}
            />
          ))}
        </div>
      </div>

      <BottomNav activeTab="home" />
    </div>
  );
}
