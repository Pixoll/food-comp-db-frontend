import type { JSX, ReactNode } from "react";

type CardProps = {
    children: ReactNode;
    className?: string;
    padding?: "none" | "md" | "lg";
    as?: "div" | "section" | "article";
};

const paddings = {
    none: "",
    md: "p-5 sm:p-6",
    lg: "p-6 sm:p-8",
};

export function Card({ children, className = "", padding = "md", as: Tag = "div" }: CardProps): JSX.Element {
    return (
        <Tag className={`bg-paper border border-fog rounded-card ${paddings[padding]} ${className}`}>
            {children}
        </Tag>
    );
}

type CardHeaderProps = {
    title: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
    icon?: ReactNode;
    className?: string;
};

export function CardHeader({ title, description, actions, icon, className = "" }: CardHeaderProps): JSX.Element {
    return (
        <div className={`flex flex-wrap items-start justify-between gap-3 mb-5 ${className}`}>
            <div className="flex items-start gap-3 min-w-0">
                {icon && (
                    <span
                        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-mint-wash
                        text-brand"
                    >
                        {icon}
                    </span>
                )}
                <div className="min-w-0">
                    <h2 className="text-[18px] font-semibold text-carbon leading-tight">{title}</h2>
                    {description && <p className="mt-1 text-[14px] text-graphite">{description}</p>}
                </div>
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
    );
}
