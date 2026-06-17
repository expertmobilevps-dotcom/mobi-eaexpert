import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import '../styles/pages.css';

export default function MetaTrader() {
  const navigate = useNavigate();
  const [signals, setSignals] = useState([]);
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const api = await import('../services/api.js');
        const signalsData = await api.getSignals();
        const quotesData = await api.getQuotes();
        setSignals(signalsData.signals || signalsData || []);
        setQuotes(quotesData.quotes || quotesData || []);
      } catch (error) {
        console.error('Unable to fetch MetaTrader data', error);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="page-container metatrader-page">
      <header className="page-header">
        <h1>MetaTrader 5</h1>
        <p>Live Trading Signals & Quotes</p>
      </header>

      <div className="content-area">
        <section className="signals-section">
          <h2>Trading Signals</h2>
          {signals.length === 0 ? (
            <p className="empty-state">No signals available</p>
          ) : (
            <div className="signals-list">
              {signals.map(signal => (
                <div key={signal.id} className="signal-item">
                  <div className="signal-header">
                    <span className="pair">{signal.pair}</span>
                    <span className={`direction ${signal.direction}`}>
                      {signal.direction === 'BUY' ? '▲ BUY' : '▼ SELL'}
                    </span>
                  </div>
                  <div className="signal-details">
                    <div>Entry: {signal.entry}</div>
                    <div>SL: {signal.sl}</div>
                    <div>TP: {signal.tp}</div>
                    <div className="time">{signal.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="quotes-section">
          <h2>Market Quotes</h2>
          {quotes.length === 0 ? (
            <p className="empty-state">No quotes available</p>
          ) : (
            <div className="quotes-list">
              {quotes.map(quote => (
                <div key={quote.symbol} className="quote-item">
                  <div className="quote-symbol">{quote.symbol}</div>
                  <div className="quote-prices">
                    <span>Bid: {quote.bid}</span>
                    <span>Ask: {quote.ask}</span>
                  </div>
                  <div className="quote-change">{quote.change}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <BottomNav activeTab="metatrader" />
    </div>
  );
}
