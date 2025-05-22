import React from "react"
import Footer from "../components/Footer"
import styles from "./login.module.css"
import backgroundImage from '../../../public/admin_login_bg.jpg'
type LoginPageLayoutProps = {
    children: React.ReactNode
}

export default function LoginPageLayout({children}: LoginPageLayoutProps){
    return (
        <div className="h-full">
            <div className = {styles['login-container']} style={{backgroundImage: `url(${backgroundImage.src})`}}>
                {children}
            </div>

            <Footer />
        </div>
    )
}
