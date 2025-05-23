import React from "react"
import Footer from "../../components/Footer"


type ModifyFoodPageLayoutProps = {
    children: React.ReactNode
}

export default function ModifyFoodPageLayout({children}: ModifyFoodPageLayoutProps) {
    return (
        <div>
            {children}
            <Footer/>
        </div>
    )
}
