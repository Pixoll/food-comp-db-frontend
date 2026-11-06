import Link from "next/link";
import type { ButtonHTMLAttributes, JSX, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "soft" | "danger";
export type ButtonSize = "sm" | "md";

const base = "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap "
    + "transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed select-none";

const variants: Record<ButtonVariant, string> = {
    primary: "bg-brand text-on-brand shadow-subtle hover:bg-brand-hover",
    secondary: "bg-paper text-carbon shadow-subtle-2 hover:bg-linen",
    ghost: "bg-transparent text-graphite hover:bg-mist hover:text-carbon",
    soft: "bg-mint-wash text-brand-ink hover:bg-mint/60",
    danger: "bg-paper text-danger shadow-subtle-2 hover:bg-danger-wash",
};

const sizes: Record<ButtonSize, string> = {
    sm: "text-[13px] px-3.5 py-1.5",
    md: "text-[14px] px-5 py-2.5",
};

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra = ""): string {
    return `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim();
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: ReactNode;
};

export function Button({
    variant = "primary",
    size = "md",
    icon,
    className = "",
    children,
    type = "button",
    ...props
}: ButtonProps): JSX.Element {
    return (
        <button type={type} className={buttonClass(variant, size, className)} {...props}>
            {icon}
            {children}
        </button>
    );
}

type ButtonLinkProps = {
    href: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: ReactNode;
    className?: string;
    children: ReactNode;
};

export function ButtonLink({
    href,
    variant = "primary",
    size = "md",
    icon,
    className = "",
    children,
}: ButtonLinkProps): JSX.Element {
    return (
        <Link href={href} className={buttonClass(variant, size, className)}>
            {icon}
            {children}
        </Link>
    );
}
