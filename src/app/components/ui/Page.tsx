import type { JSX, ReactNode } from "react";

type PageContainerProps = {
    children: ReactNode;
    className?: string;
    width?: "md" | "lg" | "xl";
    tone?: "white" | "linen";
};

const widths = {
    md: "max-w-[880px]",
    lg: "max-w-[1200px]",
    xl: "max-w-[1400px]",
};

export function PageContainer({
    children,
    className = "",
    width = "lg",
    tone = "linen",
}: PageContainerProps): JSX.Element {
    return (
        <main className={`w-full ${tone === "linen" ? "bg-linen" : "bg-paper"}`}>
            <div className={`mx-auto w-full ${widths[width]} px-4 sm:px-6 py-8 sm:py-12 ${className}`}>
                {children}
            </div>
        </main>
    );
}

type PageHeaderProps = {
    eyebrow?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
    className?: string;
};

export function PageHeader({ eyebrow, title, description, actions, className = "" }: PageHeaderProps): JSX.Element {
    return (
        <header className={`flex flex-wrap items-end justify-between gap-4 mb-8 ${className}`}>
            <div className="min-w-0 max-w-[760px]">
                {eyebrow && (
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-[13px] font-medium text-graphite">
                        {eyebrow}
                    </div>
                )}
                <h1 className="text-[30px] sm:text-[36px] font-semibold leading-[1.15] tracking-[-0.025em] text-carbon">
                    {title}
                </h1>
                {description && <p className="mt-2 text-[16px] leading-relaxed text-graphite">{description}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
    );
}
