import { AlertTriangle, Loader2 } from "lucide-react";
import type { JSX, ReactNode } from "react";

export function Spinner({ size = 20, className = "" }: { size?: number; className?: string }): JSX.Element {
    return <Loader2 size={size} className={`animate-spin text-brand ${className}`} aria-hidden="true"/>;
}

export function LoadingState({ label }: { label: string }): JSX.Element {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-graphite" role="status">
            <Spinner size={28}/>
            <p className="text-[14px]">{label}</p>
        </div>
    );
}

type EmptyStateProps = {
    icon?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
    className?: string;
};

export function EmptyState({ icon, title, description, action, className = "" }: EmptyStateProps): JSX.Element {
    return (
        <div className={`flex flex-col items-center text-center gap-3 py-14 px-6 ${className}`}>
            {icon && (
                <span className="flex items-center justify-center size-12 rounded-full bg-mint-wash text-brand">
                    {icon}
                </span>
            )}
            <h3 className="text-[18px] font-semibold text-carbon">{title}</h3>
            {description && <p className="max-w-[460px] text-[14px] leading-relaxed text-graphite">{description}</p>}
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}

type ErrorStateProps = {
    title: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
};

export function ErrorState({ title, description, action }: ErrorStateProps): JSX.Element {
    return (
        <EmptyState
            icon={<AlertTriangle size={22} className="text-danger"/>}
            title={title}
            description={description}
            action={action}
        />
    );
}
