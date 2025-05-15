import {Metadata, Viewport} from "next";
import {Montserrat} from "next/font/google";
import Providers from "./Providers";
import {ReactNode} from "react";
import "./globals.css"
import i18next from "i18next";
import spanish from "../translations/es.json";
import english from "../translations/en.json";

type RootLayoutProps = {
    children: ReactNode;
};

export const metadata: Metadata = {
    title: "Capchical",
    description: "Web site created using create-react-app",
    manifest: "/manifest.json",
};

export const viewport: Viewport = {
    themeColor: "#000000",
};

const montserrat = Montserrat({
    subsets: ["latin"],
    display: "swap",
});

export default function RootLayout({children}: RootLayoutProps) {
    return (
        <html lang="en" className={montserrat.className} suppressHydrationWarning>
        <body>
        <Providers>
            <div id="root">{children}</div>
        </Providers>
        </body>
        </html>
    );
}
