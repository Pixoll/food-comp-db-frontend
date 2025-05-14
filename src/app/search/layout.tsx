import {ReactNode} from "react";

type SearchPageLayoutProps = {
    children: ReactNode;
};

export default function SearchPageLayout({children}: SearchPageLayoutProps) {
    return (
        <div>{children}</div>
    )
}
