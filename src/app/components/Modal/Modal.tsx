import { type JSX, type ReactNode, useEffect, useRef, useState } from "react";
import styles from "./Modal.module.css";
import { useTranslation } from "@/context/I18nContext";

type ModalProps = {
    fontWeight?: number;
    height?: number;
    header?: string;
    children: ReactNode;
    onClose?: () => void;
};

export default function Modal({
    fontWeight = 700,
    height,
    header = "Modal",
    children,
    onClose,
}: ModalProps): JSX.Element | null {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(true);
    const [isClosing, setIsClosing] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent): void => {
            if (event.key === "Escape") {
                handleClose();
            }
        };

        window.addEventListener("keydown", handleEsc);
        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClose = (): void => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            onClose?.();
        }, 300);
    };

    if (!isOpen) {
        return null;
    }

    const containerStyle = {
        width: `${fontWeight || 400}px`,
        ...height && { height: `${height}px` },
    };

    return (
        <div className={`${styles.modalOverlay} ${isClosing ? styles.fadeOut : styles.fadeIn}`}>
            <div
                ref={modalRef}
                style={containerStyle}
                className={`${styles.modalContainer} ${isClosing ? styles.slideOut : styles.slideIn}`}
            >
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{header}</h2>
                    <button
                        onClick={handleClose}
                        className={styles.closeButton}
                        aria-label={t.modal.closeModal}
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </div>

                <div className={styles.modalContent}>
                    {children}
                </div>

                <div className={styles.modalFooter}>
                    <button onClick={handleClose} className={styles.closeButtonFooter}>
                        {t.modal.close}
                    </button>
                </div>
            </div>
        </div>
    );
}
