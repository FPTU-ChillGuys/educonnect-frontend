import React, { createContext, useContext, useState, ReactNode } from "react";
import { Toast, ToastType, ToastContainer } from "../components/ui/Toast";

interface ToastContextType {
  showToast: (
    type: ToastType,
    title: string,
    message?: string,
    duration?: number
  ) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (
    type: ToastType,
    title: string,
    message?: string,
    duration: number = 5000
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      type,
      title,
      message,
      duration,
    };

    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};
