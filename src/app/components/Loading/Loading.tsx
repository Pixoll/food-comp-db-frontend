import styles from './Loading.module.css';

type Size = {
    spinner: string;
    text: string;
    padding: string;
}

type LoadingProps = {
    size?: "small" | "medium" | "large";
    variant?: "spinner" | "dots";
    text?: string | null;
    className?: string;
    fullscreen?: boolean;
}

export default function Loading({
                                    size = "medium",
                                    variant = "spinner",
                                    text = null,
                                    className = "",
                                    fullscreen = false
                                }: LoadingProps) {
    const sizes: Record<string, Size> = {
        small: { spinner: "h-[24px] w-[24px] border-[2px]", text: "text-[12px]", padding: "p-[8px]" },
        medium: { spinner: "h-[32px] w-[32px] border-[3px]", text: "text-[14px]", padding: "p-[12px]" },
        large: { spinner: "h-[48px] w-[48px] border-[4px]", text: "text-[16px]", padding: "p-[16px]" }
    };

    const currentSize = sizes[size];

    const containerClasses = fullscreen
        ? "fixed inset-[0] flex flex-col items-center justify-center w-full h-full bg-[#ffffff] z-[50]"
        : `flex flex-col items-center justify-center w-full min-h-[400px] ${currentSize.padding}`;

    const spinnerStyle: React.CSSProperties = {
        animation: 'spin 1s linear infinite',
        transformOrigin: 'center'
    };

    const bounceStyle = (delay: string): React.CSSProperties => ({
        animation: `bounce 1.4s ease-in-out ${delay} infinite`
    });

    if (variant === "dots") {
        return (
            <div className={`${containerClasses} ${className}`}>
                <div className="animate-spin flex items-center space-x-[4px] ">
                    <div className="w-[6px] h-[6px] bg-[#d1d5db] rounded-full" style={bounceStyle('0ms')}></div>
                    <div className="w-[6px] h-[6px] bg-[#9ca3af] rounded-full" style={bounceStyle('150ms')}></div>
                    <div className="w-[6px] h-[6px] bg-[#ffffff] rounded-full" style={bounceStyle('300ms')}></div>
                </div>
                {text && (
                    <span className={`ml-[12px] text-[#9ca3af] ${currentSize.text} font-medium`}>
                        {text}
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className={`${containerClasses} ${className}`}>
            <div
                className={`${styles.spinner} rounded-full ${currentSize.spinner} border-[#e5e7eb] border-t-[#ffffff]`}
            ></div>
            {text && (
                <p className={`mt-[12px] text-[#9ca3af] ${currentSize.text} font-[500]`}>
                    {text}
                </p>
            )}
        </div>
    );
}
