import React from "react";
import Footer from "../components/Footer";
import styles from "./login.module.css";

type LoginPageLayoutProps = {
    children: React.ReactNode
}

export default function LoginPageLayout({ children }: LoginPageLayoutProps) {
    return (
        <div className="h-full">
            <div className={styles["login-container"]} style={{ backgroundImage: "url(/admin_login_bg.jpg)" }}>
                {children}
            </div>

            <Footer/>
        </div>
    );
}
