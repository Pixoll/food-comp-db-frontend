'use client'
import { createContext, ReactNode, useContext, useState } from "react";
import ToastComponent, {
  ToastComponentProps,
} from "../components/ToastComponent";

type ToastContextProps = {
  addToast: (toast: ToastComponentProps) => void;
};

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastComponentProps[]>([]);

  const addToast = (toast: ToastComponentProps) => {
    setToasts((prev) => [...prev, toast]);
  };

  // const removeToast = (index: number) => {
  //   setToasts((prev) => prev.filter((_, i) => i !== index));
  // };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {toasts.map((toast, index) => (
        <ToastComponent
          key={index}
          {...toast}
          duration={toast.duration}
          position={toast.position || "top-center"}
        />
      ))}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextProps {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe usarse dentro de un ToastProvider");
  }
  return context;
}
