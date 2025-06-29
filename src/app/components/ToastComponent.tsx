import { useTranslation } from "@/context/I18nContext";
import { tw } from "@/utils/tailwind";
import {
    AlertCircleIcon,
    AlertTriangleIcon,
    CheckCircleIcon,
    InfoIcon,
    X as CloseIcon,
    XCircleIcon,
} from "lucide-react";
import { type JSX, useEffect, useState } from "react";

type ToastTypeConfig = {
    Icon: typeof AlertCircleIcon;
    bgColor: string;
    textColor: string;
    bgOpacity: string;
    borderColor: string;
    iconColor: string;
};

const toastTypeConfigs = {
    Success: {
        Icon: CheckCircleIcon,
        bgColor: tw`bg-[#22c55e]`,
        textColor: tw`text-[#ffffff]`,
        bgOpacity: tw`bg-[#dcfce7]`,
        borderColor: tw`border-[#22c55e]`,
        iconColor: tw`text-[#22c55e]`,
    },
    Danger: {
        Icon: XCircleIcon,
        bgColor: tw`bg-[#ef4444]`,
        textColor: tw`text-[#ffffff]`,
        bgOpacity: tw`bg-[#fee2e2]`,
        borderColor: tw`border-[#ef4444]`,
        iconColor: tw`text-[#ef4444]`,
    },
    Warning: {
        Icon: AlertTriangleIcon,
        bgColor: tw`bg-[#eab308]`,
        textColor: tw`text-[#ffffff]`,
        bgOpacity: tw`bg-[#fef9c3]`,
        borderColor: tw`border-[#eab308]`,
        iconColor: tw`text-[#eab308]`,
    },
    Info: {
        Icon: InfoIcon,
        bgColor: tw`bg-[#60a5fa]`,
        textColor: tw`text-[#ffffff]`,
        bgOpacity: tw`bg-[#dbeafe]`,
        borderColor: tw`border-[#60a5fa]`,
        iconColor: tw`text-[#60a5fa]`,
    },
    Primary: {
        Icon: AlertCircleIcon,
        bgColor: tw`bg-[#3b82f6]`,
        textColor: tw`text-[#ffffff]`,
        bgOpacity: tw`bg-[#dbeafe]`,
        borderColor: tw`border-[#3b82f6]`,
        iconColor: tw`text-[#3b82f6]`,
    },
    Secondary: {
        Icon: AlertCircleIcon,
        bgColor: tw`bg-[#6b7280]`,
        textColor: tw`text-[#ffffff]`,
        bgOpacity: tw`bg-[#f3f4f6]`,
        borderColor: tw`border-[#6b7280]`,
        iconColor: tw`text-[#6b7280]`,
    },
    Light: {
        Icon: AlertCircleIcon,
        bgColor: tw`bg-[#f3f4f6]`,
        textColor: tw`text-[#1f2937]`,
        bgOpacity: tw`bg-[#f9fafb]`,
        borderColor: tw`border-[#e5e7eb]`,
        iconColor: tw`text-[#1f2937]`,
    },
    Dark: {
        Icon: AlertCircleIcon,
        bgColor: tw`bg-[#1f2937]`,
        textColor: tw`text-[#ffffff]`,
        bgOpacity: tw`bg-[#e5e7eb]`,
        borderColor: tw`border-[#1f2937]`,
        iconColor: tw`text-[#1f2937]`,
    },
} as const satisfies Readonly<Record<string, ToastTypeConfig>>;

const positions = {
    "top-start": tw`top-[16px] left-[16px]`,
    "top-center": tw`top-[16px] left-[50%] translate-x-[-50%]`,
    "top-end": tw`top-[16px] right-[16px]`,
    "middle-start": tw`top-[50%] left-[16px] translate-y-[-50%]`,
    "middle-center": tw`top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]`,
    "middle-end": tw`top-[50%] right-[16px] translate-y-[-50%]`,
    "bottom-start": tw`bottom-[16px] left-[16px]`,
    "bottom-center": tw`bottom-[16px] left-[50%] translate-x-[-50%]`,
    "bottom-end": tw`bottom-[16px] right-[16px]`,
};

type ColorVariant = keyof typeof toastTypeConfigs;
type Position = keyof typeof positions;

export type ToastComponentProps = {
    type?: ColorVariant;
    message: string;
    title?: string;
    duration?: number;
    position?: Position;
};

export default function ToastComponent({
    type = "Primary",
    message,
    title,
    duration = 5000,
    position = "middle-center",
}: ToastComponentProps): JSX.Element | null {
    const { t } = useTranslation();
    const [show, setShow] = useState(true);
    const [showTime] = useState(Date.now());
    const { Icon, bgColor, bgOpacity, textColor } = toastTypeConfigs[type];
    const secondsAgo = Math.floor((Date.now() - showTime) / 1000);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if (!show) {
        return null;
    }

    return (
        <div
            className={`
            pointer-events-none
            fixed
            ${positions[position]}
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
                <div className={`${bgColor} ${textColor} p-[12px] flex items-center`}>
                    <Icon
                        size={48}
                        className="mr-[16px]"
                        color="currentColor"
                        strokeWidth={2.5}
                    />
                    <div className="flex flex-col">
                        <strong className="text-[1.25rem] font-[700] mb-[4px]">{title || type}</strong>
                        <span className="text-[0.875rem] opacity-[0.7]">
                            {secondsAgo === 0 ? t.toast.justNow : `${secondsAgo} ${t.toast.secondsAgo}`}
                        </span>
                    </div>
                    <button
                        type="button"
                        className="ml-auto border-none p-[4px] rounded-[9999px] hover:bg-[#f4a698] transition-colors"
                        aria-label={t.toast.close}
                        onClick={() => setShow(false)}
                    >
                        <CloseIcon size={24}/>
                    </button>
                </div>
                <div
                    className={`
                    ${bgOpacity}
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
