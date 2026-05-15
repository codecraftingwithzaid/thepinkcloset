'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  title: string;
  message?: string;
  onClose?: () => void;
  autoClose?: number;
}

const toastStyles = {
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
    titleClass: 'text-emerald-900',
  },
  error: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    icon: <AlertCircle className="w-5 h-5 text-rose-600" />,
    titleClass: 'text-rose-900',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    titleClass: 'text-amber-900',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: <Info className="w-5 h-5 text-blue-600" />,
    titleClass: 'text-blue-900',
  },
};

export function Toast({ type, title, message, onClose, autoClose = 5000 }: ToastProps) {
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const style = toastStyles[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 20, x: 20 }}
      className={`${style.bg} ${style.border} border rounded-lg p-4 shadow-lg max-w-md`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0">{style.icon}</div>
        <div className="flex-1">
          <h3 className={`font-semibold text-sm ${style.titleClass}`}>{title}</h3>
          {message && <p className="text-sm text-neutral-600 mt-1">{message}</p>}
        </div>
        {onClose && (
          <button onClick={onClose} className="flex-shrink-0 text-neutral-400 hover:text-neutral-600">
            <X size={18} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: (ToastProps & { id: string })[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => onRemove(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook for toast notifications
export function useToast() {
  const [toasts, setToasts] = React.useState<(ToastProps & { id: string })[]>([]);

  const addToast = (toast: ToastProps) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const success = (title: string, message?: string) => {
    addToast({ type: 'success', title, message });
  };

  const error = (title: string, message?: string) => {
    addToast({ type: 'error', title, message });
  };

  const warning = (title: string, message?: string) => {
    addToast({ type: 'warning', title, message });
  };

  const info = (title: string, message?: string) => {
    addToast({ type: 'info', title, message });
  };

  return { toasts, removeToast, addToast, success, error, warning, info };
}
