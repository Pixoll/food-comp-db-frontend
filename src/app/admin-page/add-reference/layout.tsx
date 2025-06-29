import type { JSX, ReactNode } from "react";
import styles from "./add-reference.module.css";

type LayoutProps = {
    children: ReactNode;
};

export default function AddReferenceLayout({ children }: LayoutProps): JSX.Element {
    return (
        <div className={styles["layout"]}>
            {children}
        </div>
    );
}
