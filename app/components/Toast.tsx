'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export function Toast({ message, type, onClose, autoClose = true, duration = 5000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade-out animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const Icon = icons[type];

  const colorClasses = {
    success: 'bg-success/20 border-success/30 text-success',
    error: 'bg-error/20 border-error/30 text-error',
    info: 'bg-primary/20 border-primary/30 text-primary',
  };

  return (
    <div
      className={`fixed top-4 right-4 z-[100] transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className={`glass-card p-4 border-2 ${colorClasses[type]} max-w-sm`}>
        <div className="flex items-start space-x-3">
          <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1">
            <p className="text-sm font-medium text-fg">{message}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-text-muted hover:text-fg transition-colors focus-visible"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

// Simple toast manager hook
export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([]);

  const showToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return {
    showToast,
    toasts,
    removeToast,
  };
}
