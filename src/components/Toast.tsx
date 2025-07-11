import React from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { Toast as ToastType } from '@/hooks/useToast';

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const isDestructive = toast.variant === 'destructive';

  return (
    <div className={`
      fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg border
      ${isDestructive 
        ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-100' 
        : 'bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100'
      }
      animate-in slide-in-from-right-full duration-300
    `}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {isDestructive ? (
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
          )}
          <div>
            <div className="font-medium">{toast.title}</div>
            {toast.description && (
              <div className="text-sm opacity-80 mt-1">{toast.description}</div>
            )}
          </div>
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastType[], onRemove: (id: string) => void }> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-0 right-0 z-50 space-y-2 p-4">
      {toasts.map((toast, index) => (
        <div key={toast.id} style={{ transform: `translateY(${index * 10}px)` }}>
          <Toast toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
};