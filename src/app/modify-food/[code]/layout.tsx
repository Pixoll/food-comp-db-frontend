import React from "react"
import Footer from "../../components/Footer"


type ModifyFoodPageLayoutProps = {
    children: React.ReactNode
}

export default function ModifyFoodPageLayout({children}: ModifyFoodPageLayoutProps) {
    return (
        <div>
            <div className="bg-[white] svg-background">
                {children}
            </div>
            <Footer/>
        </div>
    )
}
