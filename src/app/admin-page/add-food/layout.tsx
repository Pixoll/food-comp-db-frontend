import type { JSX, ReactNode } from "react";
import styles from "./add-food.module.css";

type LayoutProps = {
    children: ReactNode;
};

export default function AddPageLayout({ children }: LayoutProps): JSX.Element {
    return (
        <div className={styles["layout"]}>
            {children}
        </div>
    );
}
