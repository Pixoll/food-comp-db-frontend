import {Metadata, Viewport} from "next";
import {ReactNode} from "react";
import {Montserrat} from "next/font/google";
import Providers from "./Providers";
import NavBar from "./components/NavBar/Navbar";
import "./globals.css"


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
