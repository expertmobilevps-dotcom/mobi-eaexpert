import '../styles/components.css';

export default function SignalCard({ robot, isSelected, onSelect }) {
  return (
    <div 
      className={`signal-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(robot)}
    >
      <div className="card-header">
        <h3>{robot.name}</h3>
        <span className={`status-badge ${robot.status}`}>
          {robot.status}
        </span>
      </div>
      
      <div className="card-stats">
        <div className="stat-item">
          <span className="stat-label">Balance</span>
          <span className="stat-value">${robot.balance}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Profit</span>
          <span className="stat-value positive">+${robot.profitToday}</span>
        </div>
      </div>

      <div className="card-footer">
        <span className="expiry">{robot.daysLeft}d remaining</span>
      </div>
    </div>
  );
}
