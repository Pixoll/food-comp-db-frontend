import type { JSX, ReactNode } from "react";

export type TabItemProps = {
    label: string;
    children?: ReactNode;
    disabled?: boolean;
};

export default function TabItem({ children }: TabItemProps): JSX.Element {
    return <div className="w-full">{children}</div>;
}
