import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import type { JSX, ReactNode } from "react";
import NavBar from "./components/NavBar/Navbar";
import Providers from "./Providers";
import "./globals.css";

type RootLayoutProps = {
    children: ReactNode;
};

export const metadata: Metadata = {
    title: "CapChiCAL",
    description: "Base de Datos de Composición de Alimentos",
    manifest: "/manifest.json",
};

export const viewport: Viewport = {
    themeColor: "#000000",
};

const montserrat = Montserrat({
    subsets: ["latin"],
    display: "swap",
});

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
    return (
        <html lang="en" className={`${montserrat.className} h-full`} suppressHydrationWarning>
            <body>
                <Providers>
                    <div className="flex flex-col h-[100%]" id="root">
                        <NavBar/>
                        {children}
                    </div>
                </Providers>
            </body>
        </html>
    );
}
