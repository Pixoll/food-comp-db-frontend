"use client";

import { AuthProvider } from "@/context/AuthContext";
import ComparisonProvider from "@/context/ComparisonContext";
import { I18nProvider, useTranslation } from "@/context/I18nContext";
import { ToastProvider } from "@/context/ToastContext";
import type { JSX, ReactNode } from "react";

/** Contextos de la app. Vive aparte del layout para que el layout sea un componente de servidor. */
export default function Providers({ children }: { children: ReactNode }): JSX.Element {
    return (
        <I18nProvider>
            <Title/>
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

/** React 19 mueve este <title> al <head>, y cambia con el idioma. */
function Title(): JSX.Element {
    const { t } = useTranslation();

    return <title>{t.title}</title>;
}
