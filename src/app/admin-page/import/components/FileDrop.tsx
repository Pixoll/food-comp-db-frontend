"use client";

import { useTranslation } from "@/context/I18nContext";
import { FileSpreadsheet } from "lucide-react";
import { type JSX, useId, useState } from "react";

const ACCEPT = ".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel";

type FileDropProps = {
    file: File | null;
    onFile: (file: File) => void;
    disabled?: boolean;
};

export default function FileDrop({ file, onFile, disabled }: FileDropProps): JSX.Element {
    const { t } = useTranslation();
    const x = t.importXlsx;
    const inputId = useId();
    const [dragging, setDragging] = useState(false);

    return (
        <label
            htmlFor={inputId}
            onDragOver={e => {
                e.preventDefault();
                setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => {
                e.preventDefault();
                setDragging(false);
                const dropped = e.dataTransfer.files[0];
                if (dropped && !disabled) onFile(dropped);
            }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-card border
            border-dashed px-6 py-10 text-center transition-colors duration-150 ${dragging
                ? "border-leaf bg-mint-wash/60"
                : "border-ash/60 bg-linen hover:border-graphite"}`}
        >
            <span className="flex size-12 items-center justify-center rounded-full bg-mint-wash text-brand">
                <FileSpreadsheet size={22}/>
            </span>
            {file ? (
                <>
                    <span className="break-all text-[15px] font-medium text-carbon">{file.name}</span>
                    <span className="text-[13px] text-graphite">
                        {formatSize(file.size)} · <span className="text-brand underline">{x.changeFile}</span>
                    </span>
                </>
            ) : (
                <>
                    <span className="text-[15px] font-medium text-carbon">{x.dropTitle}</span>
                    <span className="text-[13px] text-graphite">{x.dropHint}</span>
                </>
            )}
            <input
                id={inputId}
                type="file"
                accept={ACCEPT}
                className="sr-only"
                disabled={disabled}
                onChange={e => {
                    const chosen = e.target.files?.[0];
                    if (chosen) onFile(chosen);
                    e.target.value = "";
                }}
            />
        </label>
    );
}

function formatSize(bytes: number): string {
    const kib = bytes / 1024;
    return kib < 1024 ? `${Math.max(1, Math.round(kib))} KB` : `${(kib / 1024).toFixed(1)} MB`;
}
