import {ReactNode} from "react";
import styles from "./add-reference.module.css"

type LoyoutProps = {
    children: ReactNode;
}

export default function ({children}: LoyoutProps) {
    return (
        <div className={styles["layout"]}>
            {children}
        </div>
    )
}
