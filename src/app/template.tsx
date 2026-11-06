import Footer from "@/app/components/Footer";
import NavBar from "@/app/components/NavBar/Navbar";
import type { JSX, ReactNode } from "react";

export default function RootTemplate({ children }: { children: ReactNode }): JSX.Element {
    return (
        <div className="flex min-h-screen flex-col">
            <NavBar/>
            <div className="flex flex-1 flex-col">
                {children}
            </div>
            <Footer/>
        </div>
    );
}
