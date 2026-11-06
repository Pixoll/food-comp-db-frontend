"use client";

import ToastComponent, { type ToastComponentProps, toastPositions } from "@/app/components/ToastComponent";
import { createContext, type JSX, type ReactNode, useCallback, useContext, useState } from "react";

type ToastContextProps = {
    addToast: (toast: ToastComponentProps) => void;
};

type ToastEntry = ToastComponentProps & { id: number };

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }): JSX.Element {
    const [toasts, setToasts] = useState<ToastEntry[]>([]);

    const addToast = useCallback((toast: ToastComponentProps): void => {
        setToasts(prev => [...prev, { ...toast, id: nextId++ }]);
    }, []);

    const removeToast = useCallback((id: number): void => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    // los toasts de una misma posición se apilan en vez de superponerse
    const byPosition = new Map<keyof typeof toastPositions, ToastEntry[]>();
    for (const toast of toasts) {
        const position = toast.position ?? "top-end";
        byPosition.set(position, [...byPosition.get(position) ?? [], toast]);
    }

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {[...byPosition].map(([position, entries]) => (
                <div
                    key={position}
                    className={`pointer-events-none fixed z-50 flex w-[calc(100%-32px)] max-w-[420px] flex-col gap-2
                    ${toastPositions[position]}`}
                >
                    {entries.map(({ id, ...toast }) => (
                        <ToastComponent key={id} {...toast} onClose={() => removeToast(id)}/>
                    ))}
                </div>
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
