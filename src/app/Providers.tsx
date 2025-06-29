"use client";

import { AuthProvider } from "@/context/AuthContext";
import ComparisonProvider from "@/context/ComparisonContext";
import { I18nProvider } from "@/context/I18nContext";
import { ToastProvider } from "@/context/ToastContext";
import type { JSX, ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }): JSX.Element {
    return (
        <I18nProvider>
            <ToastProvider>
                <ComparisonProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </ComparisonProvider>
            </ToastProvider>
        </I18nProvider>
    );
}
