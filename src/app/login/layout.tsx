import React from "react"
import Footer from "../components/Footer"
import styles from "./login.module.css"
type LoginPageLayoutProps = {
    children: React.ReactNode
}

export default function LoginPageLayout({children}: LoginPageLayoutProps){
    return (
        <div>
            <div className = {styles.loginContainer}>
                {children}
            </div>

            <Footer />
        </div>
    )
}
