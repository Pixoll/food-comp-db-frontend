"use client";

import { AuthProvider } from "@/context/AuthContext";
import ComparisonProvider from "@/context/ComparisonContext";
import { ToastProvider } from "@/context/ToastContext";
import i18next from "@/i18n";
import type { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";

export default function Providers({ children }: { children: ReactNode }): JSX.Element {
    return (
        <I18nextProvider i18n={i18next}>
            <ToastProvider>
                <ComparisonProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </ComparisonProvider>
            </ToastProvider>
        </I18nextProvider>
    );
}
