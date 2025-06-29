import Footer from "@/app/components/Footer";
import type { JSX, ReactNode } from "react";

type ComparePageProps = {
    children: ReactNode;
};

export default function ComparePageLayout({ children }: ComparePageProps): JSX.Element {
    return (
        <div>
            {children}
            <Footer/>
        </div>
    );
}
