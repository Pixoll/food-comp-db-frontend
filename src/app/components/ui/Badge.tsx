import type { JSX, ReactNode } from "react";

export type BadgeTone = "neutral" | "brand" | "amber" | "sky" | "magenta" | "danger";

const tones: Record<BadgeTone, string> = {
    neutral: "bg-mist text-graphite",
    brand: "bg-mint-wash text-brand-ink",
    amber: "bg-amber-wash text-amber",
    sky: "bg-sky-wash text-sky",
    magenta: "bg-magenta-wash text-magenta",
    danger: "bg-danger-wash text-danger",
};

const base = "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-medium";

type BadgeProps = {
    tone?: BadgeTone;
    children: ReactNode;
    className?: string;
    title?: string;
};

export function Badge({ tone = "neutral", children, className = "", title }: BadgeProps): JSX.Element {
    return (
        <span
            title={title}
            className={`${base} ${tones[tone]} ${className}`}
        >
            {children}
        </span>
    );
}
