import React from "react"
import styles from "./add-food.module.css"

type LayoutProps = {
    children: React.ReactNode
}

export default function AddPageLayout({children}: LayoutProps) {

    return(
        <div className={styles["layout"]}>
            {children}
        </div>
    )
}
