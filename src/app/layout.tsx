import { THEME_SCRIPT } from "@/utils/theme";
import type { JSX, ReactNode } from "react";
import Providers from "./Providers";
import "./globals.css";

const FONTS_URL = "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;"
    + "1,14..32,100..900&display=swap";

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
    return (
        <html lang="es" className="h-full" suppressHydrationWarning>
            <head>
                {/* pone data-theme en <html> antes de pintar, para que el tema oscuro no parpadee en blanco */}
                <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}/>
                <link rel="manifest" href="/manifest.json"/>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
                {/* eslint-disable-next-line @next/next/no-page-custom-font */}
                <link href={FONTS_URL} rel="stylesheet"/>
            </head>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
