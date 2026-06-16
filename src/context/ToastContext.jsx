import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext({
  showToast: () => {},
  hideToast: () => {},
});

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    isOpen: false,
    message: '',
    type: 'info', // 'success', 'error', 'info', 'warning'
    duration: 3000,
  });

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    setToast({ isOpen: true, message, type, duration });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, isOpen: false }));
    }, duration);
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast.isOpen && (
        <div className={`toast toast-${toast.type}`}>
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close" onClick={hideToast}>×</button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
