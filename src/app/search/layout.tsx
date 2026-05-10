import type { JSX, ReactNode } from "react";

type SearchPageLayoutProps = {
    children: ReactNode;
};

export default function SearchPageLayout({ children }: SearchPageLayoutProps): JSX.Element {
    return <>
        <div className="bg-[white] svg-background">
            {children}
        </div>
    </>;
}
