import React from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="shine-toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`shine-toast-item toast-${toast.type}`}>
          <div className="toast-icon">
            {toast.type === 'success' && <CheckCircle2 size={18} />}
            {toast.type === 'info' && <Info size={18} />}
            {toast.type === 'warning' && <AlertTriangle size={18} />}
          </div>
          <div className="toast-body">
            <strong>{toast.title}</strong>
            {toast.description && <p>{toast.description}</p>}
          </div>
          <button className="toast-close-btn" onClick={() => removeToast(toast.id)}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
