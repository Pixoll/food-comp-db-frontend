import { useTranslation } from "@/context/I18nContext";
import {
    AlertCircleIcon,
    AlertTriangleIcon,
    CheckCircleIcon,
    InfoIcon,
    X as CloseIcon,
    XCircleIcon,
} from "lucide-react";
import { type JSX, useEffect, useRef } from "react";

const toastTypeConfigs = {
    Success: { Icon: CheckCircleIcon, iconClass: "text-brand", accent: "bg-brand" },
    Danger: { Icon: XCircleIcon, iconClass: "text-danger", accent: "bg-danger" },
    Warning: { Icon: AlertTriangleIcon, iconClass: "text-amber", accent: "bg-amber" },
    Info: { Icon: InfoIcon, iconClass: "text-sky", accent: "bg-sky" },
    Primary: { Icon: AlertCircleIcon, iconClass: "text-brand", accent: "bg-brand" },
    Secondary: { Icon: AlertCircleIcon, iconClass: "text-graphite", accent: "bg-graphite" },
    Light: { Icon: AlertCircleIcon, iconClass: "text-graphite", accent: "bg-fog" },
    Dark: { Icon: AlertCircleIcon, iconClass: "text-carbon", accent: "bg-carbon" },
} as const;

/** Posición de la pila de toasts en pantalla. */
export const toastPositions = {
    "top-start": "top-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "top-end": "top-4 right-4",
    "middle-start": "top-1/2 left-4 -translate-y-1/2",
    "middle-center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    "middle-end": "top-1/2 right-4 -translate-y-1/2",
    "bottom-start": "bottom-4 left-4",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
    "bottom-end": "bottom-4 right-4",
} as const;

type ColorVariant = keyof typeof toastTypeConfigs;

export type ToastComponentProps = {
    type?: ColorVariant;
    message: string;
    title?: string;
    duration?: number;
    position?: keyof typeof toastPositions;
};

type ToastProps = Omit<ToastComponentProps, "position"> & {
    onClose: () => void;
};

export default function ToastComponent({
    type = "Primary",
    message,
    title,
    duration = 5000,
    onClose,
}: ToastProps): JSX.Element {
    const { t } = useTranslation();
    const { Icon, iconClass, accent } = toastTypeConfigs[type];

    // la función cambia en cada render del proveedor; el temporizador no debe reiniciarse por eso
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    });

    useEffect(() => {
        const timer = setTimeout(() => onCloseRef.current(), duration);
        return () => clearTimeout(timer);
    }, [duration]);

    return (
        <div
            role="status"
            className="pointer-events-auto relative flex gap-3 overflow-hidden rounded-card border border-fog bg-paper
            p-4 pl-5 shadow-panel animate-fade-in"
        >
            <span className={`absolute inset-y-0 left-0 w-1 ${accent}`} aria-hidden="true"/>
            <Icon size={20} className={`mt-0.5 shrink-0 ${iconClass}`}/>
            <div className="min-w-0 flex-1">
                {title && <p className="text-[14px] font-semibold text-carbon">{title}</p>}
                <p className="break-words text-[14px] leading-relaxed text-graphite">{message}</p>
            </div>
            <button
                type="button"
                className="h-fit rounded-full p-1 text-ash hover:bg-mist hover:text-carbon"
                aria-label={t.toast.close}
                onClick={onClose}
            >
                <CloseIcon size={16}/>
            </button>
        </div>
    );
}
