import React from "react";
import Footer from "../../components/Footer";

export default function DetailFoodPageLayout({children}: { children: React.ReactNode }) {
    return (
        <div>
            {children}
            <Footer/>
        </div>
    )
}
