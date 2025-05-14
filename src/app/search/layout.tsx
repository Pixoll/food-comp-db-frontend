import {ReactNode} from "react";
import Footer from "../components/Footer"
type SearchPageLayoutProps = {
    children: ReactNode;
};

export default function SearchPageLayout({children}: SearchPageLayoutProps) {
    return (
        <div>
            <main className="bg-white svg-background">
                {children}
            </main>
            <Footer />
        </div>
    )
}
