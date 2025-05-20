import React, { useState, useEffect, useRef } from "react";
import styles from "./Modal.module.css";

type ModalProps = {
    width?: number;
    height?: number;
    header?: string;
    children: React.ReactNode;
    onClose?: () => void;
}

export default function Modal(props: ModalProps) {
    const {
        width = 700,
        height,
        header = "Modal",
        children,
        onClose = () => {}
    } = props;

    const [isOpen, setIsOpen] = useState(true);
    const [isClosing, setIsClosing] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            onClose();
        }, 300);
    };

    if (!isOpen) return null;

    const containerStyle = {
        width: width ? `${width}px` : '400px',
        ...(height ? { height: `${height}px` } : {})
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
                        aria-label="Cerrar modal"
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </div>

                <div className={styles.modalContent}>
                    {children}
                </div>

                <div className={styles.modalFooter}>
                    <button
                        onClick={handleClose}
                        className={styles.closeButtonFooter}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
