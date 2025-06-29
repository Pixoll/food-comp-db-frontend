import type { JSX, ReactNode } from "react";
import Footer from "../components/Footer";
import styles from "./login.module.css";

type LoginPageLayoutProps = {
    children: ReactNode;
};

export default function LoginPageLayout({ children }: LoginPageLayoutProps): JSX.Element {
    return (
        <div className="h-full">
            <div className={styles["login-container"]} style={{ backgroundImage: "url(/admin_login_bg.jpg)" }}>
                {children}
            </div>

            <Footer/>
        </div>
    );
}
