import {
    AlertCircleIcon,
    AlertTriangleIcon,
    CheckCircleIcon,
    InfoIcon,
    X as CloseIcon,
    XCircleIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

type ColorVariant =
    | "Primary"
    | "Secondary"
    | "Success"
    | "Danger"
    | "Warning"
    | "Info"
    | "Light"
    | "Dark";

type Position =
    | "top-start"
    | "top-center"
    | "top-end"
    | "middle-start"
    | "middle-center"
    | "middle-end"
    | "bottom-start"
    | "bottom-center"
    | "bottom-end";

const ToastTypeConfig = {
    Success: {
        icon: CheckCircleIcon,
        bgColor: "bg-[#22c55e]",
        textColor: "text-[#ffffff]",
        bgOpacity: "bg-[#dcfce7]",
        borderColor: "border-[#22c55e]",
        iconColor: "text-[#22c55e]",
    },
    Danger: {
        icon: XCircleIcon,
        bgColor: "bg-[#ef4444]",
        textColor: "text-[#ffffff]",
        bgOpacity: "bg-[#fee2e2]",
        borderColor: "border-[#ef4444]",
        iconColor: "text-[#ef4444]",
    },
    Warning: {
        icon: AlertTriangleIcon,
        bgColor: "bg-[#eab308]",
        textColor: "text-[#ffffff]",
        bgOpacity: "bg-[#fef9c3]",
        borderColor: "border-[#eab308]",
        iconColor: "text-[#eab308]",
    },
    Info: {
        icon: InfoIcon,
        bgColor: "bg-[#60a5fa]",
        textColor: "text-[#ffffff]",
        bgOpacity: "bg-[#dbeafe]",
        borderColor: "border-[#60a5fa]",
        iconColor: "text-[#60a5fa]",
    },
    Primary: {
        icon: AlertCircleIcon,
        bgColor: "bg-[#3b82f6]",
        textColor: "text-[#ffffff]",
        bgOpacity: "bg-[#dbeafe]",
        borderColor: "border-[#3b82f6]",
        iconColor: "text-[#3b82f6]",
    },
    Secondary: {
        icon: AlertCircleIcon,
        bgColor: "bg-[#6b7280]",
        textColor: "text-[#ffffff]",
        bgOpacity: "bg-[#f3f4f6]",
        borderColor: "border-[#6b7280]",
        iconColor: "text-[#6b7280]",
    },
    Light: {
        icon: AlertCircleIcon,
        bgColor: "bg-[#f3f4f6]",
        textColor: "text-[#1f2937]",
        bgOpacity: "bg-[#f9fafb]",
        borderColor: "border-[#e5e7eb]",
        iconColor: "text-[#1f2937]",
    },
    Dark: {
        icon: AlertCircleIcon,
        bgColor: "bg-[#1f2937]",
        textColor: "text-[#ffffff]",
        bgOpacity: "bg-[#e5e7eb]",
        borderColor: "border-[#1f2937]",
        iconColor: "text-[#1f2937]",
    },
};

export type ToastComponentProps = {
    type?: ColorVariant;
    message: string;
    title?: string;
    duration?: number;
    position?: Position;
};

export function ToastComponent({
    type = "Primary",
    message,
    title,
    duration = 5000,
    position = "middle-center",
}: ToastComponentProps): JSX.Element | null {
    const [show, setShow] = useState(true);
    const config = ToastTypeConfig[type];
    const Icon = config.icon;

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if (!show) {
        return null;
    }

    const getPositionClasses = (): string => {
        const positions = {
            "top-start": "top-[16px] left-[16px]",
            "top-center": "top-[16px] left-[50%] translate-x-[-50%]",
            "top-end": "top-[16px] right-[16px]",
            "middle-start": "top-[50%] left-[16px] translate-y-[-50%]",
            "middle-center": "top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]",
            "middle-end": "top-[50%] right-[16px] translate-y-[-50%]",
            "bottom-start": "bottom-[16px] left-[16px]",
            "bottom-center": "bottom-[16px] left-[50%] translate-x-[-50%]",
            "bottom-end": "bottom-[16px] right-[16px]",
        };

        return positions[position];
    };

    return (
        <div
            className={`
            pointer-events-none
            fixed
            ${getPositionClasses()}
            z-[50]
            w-[100%]
            max-w-[600px]
            transition-all
            duration-[300ms]
            ease-in-out
            scale-[1]
            opacity-[1]
            ${show ? "" : "scale-[0.95] opacity-[0]"}
            `}
        >
            <div
                className="
                pointer-events-auto
                shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]
                rounded-[0.5rem]
                overflow-hidden
                border-[0]
                max-h-[calc(80vh)]
                overflow-y-auto
                "
            >
                <div className={`${config.bgColor} ${config.textColor} p-[12px] flex items-center`}>
                    <Icon
                        size={48}
                        className="mr-[16px]"
                        color="currentColor"
                        strokeWidth={2.5}
                    />
                    <div className="flex flex-col">
                        <strong className="text-[1.25rem] font-[700] mb-[4px]">{title || type}</strong>
                        <span className="text-[0.875rem] opacity-[0.7]">just now</span>
                    </div>
                    <button
                        type="button"
                        className="ml-auto border-none p-[4px] rounded-[9999px] hover:bg-[#f4a698] transition-colors"
                        aria-label="Close"
                        onClick={() => setShow(false)}
                    >
                        <CloseIcon size={24}/>
                    </button>
                </div>
                <div
                    className={`
                    ${config.bgOpacity}
                    p-[16px]
                    text-[1.25rem]
                    text-[#1f2937]
                    overflow-y-auto
                    max-h-[400px]
                    `}
                    style={{ lineHeight: 1.5 }}
                >
                    {message}
                </div>
            </div>
        </div>
    );
}

export default ToastComponent;
