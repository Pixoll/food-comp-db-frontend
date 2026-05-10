import type { JSX, ReactNode } from "react";
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
        </div>
    );
}
