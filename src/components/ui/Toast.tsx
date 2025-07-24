import React, { useEffect } from "react";
import { X, CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  const getToastConfig = () => {
    switch (toast.type) {
      case "success":
        return {
          icon: <CheckCircle size={20} />,
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          iconColor: "text-green-600",
          titleColor: "text-green-800",
          messageColor: "text-green-700",
        };
      case "error":
        return {
          icon: <XCircle size={20} />,
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          iconColor: "text-red-600",
          titleColor: "text-red-800",
          messageColor: "text-red-700",
        };
      case "warning":
        return {
          icon: <AlertCircle size={20} />,
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          iconColor: "text-yellow-600",
          titleColor: "text-yellow-800",
          messageColor: "text-yellow-700",
        };
      case "info":
      default:
        return {
          icon: <Info size={20} />,
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          iconColor: "text-blue-600",
          titleColor: "text-blue-800",
          messageColor: "text-blue-700",
        };
    }
  };

  const config = getToastConfig();

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 mb-3 shadow-lg animate-slide-in`}
    >
      <div className="flex items-start">
        <div className={`${config.iconColor} mr-3 mt-0.5`}>{config.icon}</div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${config.titleColor}`}>
            {toast.title}
          </p>
          {toast.message && (
            <p className={`mt-1 text-sm ${config.messageColor}`}>
              {toast.message}
            </p>
          )}
        </div>
        <button
          onClick={() => onClose(toast.id)}
          className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};

export { ToastContainer, ToastItem };
