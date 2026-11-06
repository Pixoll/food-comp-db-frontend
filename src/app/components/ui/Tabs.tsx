"use client";

import { type JSX, type ReactNode, useId } from "react";

export type TabDefinition<K extends string> = {
    key: K;
    label: ReactNode;
    count?: number;
};

type TabsProps<K extends string> = {
    tabs: Array<TabDefinition<K>>;
    active: K;
    onChange: (key: K) => void;
    className?: string;
};

/**
 * Barra de pestañas: texto gris en las inactivas y subrayado verde en la activa.
 * El contenido lo renderiza quien la usa, según `active`.
 */
export function Tabs<K extends string>({ tabs, active, onChange, className = "" }: TabsProps<K>): JSX.Element {
    const id = useId();

    return (
        <div
            role="tablist"
            className={`flex gap-6 overflow-x-auto border-b border-fog ${className}`}
        >
            {tabs.map(tab => {
                const selected = tab.key === active;
                return (
                    <button
                        key={tab.key}
                        id={`${id}-${tab.key}`}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => onChange(tab.key)}
                        className={`-mb-px flex items-center gap-2 whitespace-nowrap border-b-2 pb-3 pt-1 text-[14px]
                        font-medium transition-colors ${selected
                            ? "border-brand text-carbon"
                            : "border-transparent text-ash hover:text-graphite"}`}
                    >
                        {tab.label}
                        {tab.count !== undefined && (
                            <span
                                className={`rounded-full px-2 py-px text-[12px] ${selected
                                    ? "bg-mint-wash text-brand-ink"
                                    : "bg-mist text-graphite"}`}
                            >
                                {tab.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
