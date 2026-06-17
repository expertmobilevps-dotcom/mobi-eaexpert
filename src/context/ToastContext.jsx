import React, { useState, useCallback } from 'react';

export const ToastContext = React.createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((t) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...t, id }]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: 'calc(100% - 32px)',
        maxWidth: 380,
        pointerEvents: 'none'
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: t.variant === 'destructive' ? 'rgba(220,38,38,0.95)' : 'rgba(22,22,22,0.95)',
            backdropFilter: 'blur(20px)',
            color: 'white',
            padding: '14px 18px',
            borderRadius: 14,
            maxWidth: '100%',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
            border: t.variant === 'destructive' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.08)',
            pointerEvents: 'auto',
            animation: 'slideInUp 0.35s cubic-bezier(0.16,1,0.3,1)'
          }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{t.title}</div>
            <div style={{ opacity: 0.7, fontSize: 12, fontWeight: 400 }}>{t.description}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return React.useContext(ToastContext);
}
