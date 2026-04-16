'use client';

import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToastStore } from '@/store/toast';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case 'success':
        return { bg: 'rgba(34, 197, 94, 0.2)', border: 'rgba(34, 197, 94, 0.4)', color: '#4ade80' };
      case 'error':
        return { bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.4)', color: '#ef4444' };
      default:
        return { bg: 'rgba(99, 102, 241, 0.2)', border: 'rgba(99, 102, 241, 0.4)', color: '#818cf8' };
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const styles = getStyles(toast.type);
        return (
          <div
            key={toast.id}
            className="toast"
            style={{
              background: styles.bg,
              border: `1px solid ${styles.border}`,
              color: styles.color,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {getIcon(toast.type)}
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: styles.color,
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
