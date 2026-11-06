import type {
    InputHTMLAttributes,
    JSX,
    ReactNode,
    SelectHTMLAttributes,
    TextareaHTMLAttributes,
} from "react";

const controlBase = "rounded-input border border-fog bg-paper px-3 py-2 text-[14px] text-carbon "
    + "placeholder:text-ash transition-colors duration-150 "
    + "focus:outline-none focus:border-leaf focus:ring-2 focus:ring-mint/70 "
    + "disabled:bg-mist disabled:text-ash aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger-wash";

export const controlClass = `w-full ${controlBase}`;

/** Ancho completo salvo que quien lo usa indique un ancho propio (w-…); así no compiten dos clases w-. */
function control(className: string): string {
    return /(^|\s)w-/.test(className) ? `${controlBase} ${className}` : `${controlClass} ${className}`;
}

type FieldProps = {
    label: ReactNode;
    htmlFor?: string;
    required?: boolean;
    hint?: ReactNode;
    error?: ReactNode;
    className?: string;
    children: ReactNode;
};

export function Field({ label, htmlFor, required, hint, error, className = "", children }: FieldProps): JSX.Element {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            <label htmlFor={htmlFor} className="text-[13px] font-medium text-graphite">
                {label}
                {required && <span className="text-danger ml-0.5" aria-hidden="true">*</span>}
            </label>
            {children}
            {error
                ? <p className="text-[12px] text-danger">{error}</p>
                : hint && <p className="text-[12px] text-ash">{hint}</p>}
        </div>
    );
}

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>): JSX.Element {
    return <input className={control(className)} {...props}/>;
}

export function Select({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>): JSX.Element {
    return (
        <select className={`${control(className)} pr-8`} {...props}>
            {children}
        </select>
    );
}

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>): JSX.Element {
    return <textarea className={`${control(className)} min-h-[88px] resize-y`} {...props}/>;
}
