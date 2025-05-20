import React, {useState} from "react";

type ModalProps = {
    width?: number;
    height?: number;
    header?: string;
    children: React.ReactNode;
    onClose?: () => void;
}

export default function Modal(props: ModalProps) {
    const {
        width = 400,
        height = 300,
        header = "Modal",
        children,
        onClose = () => {
        }
    } = props;

    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        setIsOpen(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-[0px] flex items-center justify-center bg-[black] bg-opacity-[50] z-[50]">
            <div
                className={`w-[${width.toString()}px] w-[${height.toString()}px] bg-[white] rounded-[4px] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col`}>
                <div className="w-full h-[64px] bg-[#166534] p-[16px] flex justify-between items-center">
                    <h2 className="text-left text-[white] font-[600]">{header}</h2>
                    <button
                        onClick={handleClose}
                        className="text-[white] hover:text-[#d1d5db]"
                    >
                        ×
                    </button>
                </div>

                <div className="w-full flex-grow overflow-auto p-[16px]">
                    {children}
                </div>

                <div className="w-full h-[64px] bg-[#166534] p-[16px] flex justify-end items-center">
                    <button
                        onClick={handleClose}
                        className="px-[16px] py-[8px] bg-[white] text-[#166534] rounded-[4px] hover:bg-[#f3f4f6]"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
