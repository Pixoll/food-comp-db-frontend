import Footer from "@/app/components/Footer";
import NavBar from "@/app/components/NavBar/Navbar";
import type { JSX, ReactNode } from "react";

export default function RootTemplate({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div className="flex flex-col min-h-screen *:nth-[2]:grow">
      <NavBar/>
      {children}
      <Footer/>
    </div>
  );
}
