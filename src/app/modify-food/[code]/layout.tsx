import type { JSX, ReactNode } from "react";
import Footer from "../../components/Footer";

type ModifyFoodPageLayoutProps = {
    children: ReactNode;
};

export default function ModifyFoodPageLayout({ children }: ModifyFoodPageLayoutProps): JSX.Element {
    return (
        <div>
            {children}
            <Footer/>
        </div>
    );
}
