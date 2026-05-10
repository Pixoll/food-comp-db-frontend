"use client";

import { AuthProvider } from "@/context/AuthContext";
import ComparisonProvider from "@/context/ComparisonContext";
import { I18nProvider, useTranslation } from "@/context/I18nContext";
import { ToastProvider } from "@/context/ToastContext";
import type { JSX, ReactNode } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <I18nProvider>
        <head>
          <Title/>
          <link rel="manifest" href="/manifest.json"/>
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
            rel="stylesheet"
          />
        </head>
        <body>
          <ToastProvider>
            <ComparisonProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </ComparisonProvider>
          </ToastProvider>
        </body>
      </I18nProvider>
    </html>
  );
}

function Title(): JSX.Element {
  const { t } = useTranslation();

  return <title>{t.title}</title>;
}
