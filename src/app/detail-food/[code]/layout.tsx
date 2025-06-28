import type { ReactNode } from "react";
import Footer from "../../components/Footer";

export default function DetailFoodPageLayout({ children }: { children: ReactNode }): JSX.Element {
    return (
        <div>
            {children}
            <Footer/>
        </div>
    );
}
