import type { ReactNode } from "react";
import Footer from "../components/Footer";

type SearchPageLayoutProps = {
    children: ReactNode;
};

export default function SearchPageLayout({ children }: SearchPageLayoutProps): JSX.Element {
    return <>
        <div className="bg-[white] svg-background">
            {children}
        </div>
        <Footer/>
    </>;
}
