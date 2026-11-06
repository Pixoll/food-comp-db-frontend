"use client";

import { Check, ChevronDown, X } from "lucide-react";
import { type JSX, type KeyboardEvent, type ReactNode, useEffect, useId, useMemo, useRef, useState } from "react";
import { controlClass } from "./Field";

export type SelectOption<T extends string | number> = {
    value: T;
    label: string;
    description?: string;
};

type BaseProps<T extends string | number> = {
    id?: string;
    options: Array<SelectOption<T>>;
    placeholder?: string;
    emptyText?: string;
    disabled?: boolean;
    invalid?: boolean;
    footer?: ReactNode;
};

type SearchSelectProps<T extends string | number> = BaseProps<T> & {
    value: T | undefined;
    onChange: (value: T | undefined) => void;
    clearable?: boolean;
};

/**
 * Selector con búsqueda para listas largas (nombres científicos, nutrientes, grupos).
 */
export function SearchSelect<T extends string | number>({
    id,
    options,
    value,
    onChange,
    placeholder = "",
    emptyText = "—",
    disabled,
    invalid,
    clearable = true,
    footer,
}: SearchSelectProps<T>): JSX.Element {
    const selected = options.find(o => o.value === value);

    return (
        <Combobox
            id={id}
            options={options}
            isSelected={o => o.value === value}
            onPick={o => onChange(o.value)}
            placeholder={selected?.label ?? placeholder}
            hasValue={!!selected}
            emptyText={emptyText}
            disabled={disabled}
            invalid={invalid}
            footer={footer}
            onClear={clearable && selected ? () => onChange(undefined) : undefined}
            closeOnPick
        />
    );
}

type MultiSearchSelectProps<T extends string | number> = BaseProps<T> & {
    values: T[];
    onChange: (values: T[]) => void;
    renderChipLabel?: (option: SelectOption<T>) => string;
};

/**
 * Selector múltiple con búsqueda; los elegidos se muestran como chips.
 */
export function MultiSearchSelect<T extends string | number>({
    id,
    options,
    values,
    onChange,
    placeholder = "",
    emptyText = "—",
    disabled,
    invalid,
    footer,
    renderChipLabel = o => o.label,
}: MultiSearchSelectProps<T>): JSX.Element {
    const selectedSet = new Set(values);
    const selectedOptions = values
        .map(v => options.find(o => o.value === v))
        .filter((o): o is SelectOption<T> => !!o);

    const toggle = (option: SelectOption<T>): void => {
        onChange(selectedSet.has(option.value)
            ? values.filter(v => v !== option.value)
            : [...values, option.value]);
    };

    return (
        <div className="flex flex-col gap-2">
            <Combobox
                id={id}
                options={options}
                isSelected={o => selectedSet.has(o.value)}
                onPick={toggle}
                placeholder={placeholder}
                hasValue={false}
                emptyText={emptyText}
                disabled={disabled}
                invalid={invalid}
                footer={footer}
            />
            {selectedOptions.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {selectedOptions.map(option => (
                        <span
                            key={option.value}
                            className="inline-flex max-w-full items-center gap-1 rounded-full bg-mint-wash py-0.5 pl-2.5
                            pr-1 text-[12px] font-medium text-brand-ink"
                            title={option.description ?? option.label}
                        >
                            <span className="truncate">{renderChipLabel(option)}</span>
                            <button
                                type="button"
                                onClick={() => toggle(option)}
                                className="rounded-full p-0.5 hover:bg-mint"
                                aria-label={`${option.label} ×`}
                                disabled={disabled}
                            >
                                <X size={12}/>
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

type ComboboxProps<T extends string | number> = BaseProps<T> & {
    isSelected: (option: SelectOption<T>) => boolean;
    onPick: (option: SelectOption<T>) => void;
    hasValue: boolean;
    onClear?: () => void;
    closeOnPick?: boolean;
};

function Combobox<T extends string | number>({
    id,
    options,
    isSelected,
    onPick,
    placeholder,
    hasValue,
    emptyText,
    disabled,
    invalid,
    footer,
    onClear,
    closeOnPick,
}: ComboboxProps<T>): JSX.Element {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const listId = `${inputId}-list`;
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const filtered = useMemo(() => {
        const q = normalize(query);
        return q
            ? options.filter(o => normalize(`${o.label} ${o.description ?? ""}`).includes(q))
            : options;
    }, [options, query]);

    useEffect(() => {
        const onClick = (event: MouseEvent): void => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
                setQuery("");
            }
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    const pick = (option: SelectOption<T> | undefined): void => {
        if (!option) return;
        onPick(option);
        if (closeOnPick) {
            setOpen(false);
            setQuery("");
        }
    };

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
            setActive(i => Math.min(i + 1, filtered.length - 1));
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive(i => Math.max(i - 1, 0));
        } else if (event.key === "Enter") {
            if (open) {
                event.preventDefault();
                pick(filtered[active]);
            }
        } else if (event.key === "Escape") {
            setOpen(false);
            setQuery("");
        }
    };

    return (
        <div ref={wrapperRef} className="relative">
            <input
                id={inputId}
                role="combobox"
                aria-expanded={open}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-invalid={invalid || undefined}
                autoComplete="off"
                disabled={disabled}
                value={query}
                placeholder={placeholder}
                onChange={e => {
                    setQuery(e.target.value);
                    setActive(0);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={onKeyDown}
                className={`${controlClass} pr-14 ${hasValue ? "placeholder:text-carbon" : ""}`}
            />
            <div className="absolute inset-y-0 right-2 flex items-center gap-0.5 text-ash">
                {onClear && !disabled && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="rounded-full p-1 hover:bg-mist hover:text-carbon"
                        aria-label="×"
                    >
                        <X size={14}/>
                    </button>
                )}
                <ChevronDown size={16} aria-hidden="true"/>
            </div>
            {open && !disabled && (
                <div
                    className="absolute z-30 mt-1 w-full overflow-hidden rounded-input border border-fog bg-paper
                    shadow-panel animate-fade-in"
                >
                    <ul id={listId} role="listbox" className="max-h-64 overflow-y-auto py-1">
                        {filtered.length === 0 && (
                            <li className="px-3 py-2 text-[13px] text-ash">{emptyText}</li>
                        )}
                        {filtered.map((option, index) => {
                            const selected = isSelected(option);
                            return (
                                <li
                                    key={option.value}
                                    role="option"
                                    aria-selected={selected}
                                    onMouseDown={e => e.preventDefault()}
                                    onClick={() => pick(option)}
                                    onMouseEnter={() => setActive(index)}
                                    className={`flex cursor-pointer items-start gap-2 px-3 py-2 text-[14px] ${
                                        index === active ? "bg-mist" : ""
                                    }`}
                                >
                                    <Check
                                        size={14}
                                        className={`mt-0.5 shrink-0 ${selected ? "text-brand" : "invisible"}`}
                                    />
                                    <span className="min-w-0">
                                        <span className="block text-carbon">{option.label}</span>
                                        {option.description && (
                                            <span className="block truncate text-[12px] text-ash">
                                                {option.description}
                                            </span>
                                        )}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                    {footer && <div className="border-t border-fog p-2">{footer}</div>}
                </div>
            )}
        </div>
    );
}

function normalize(text: string): string {
    return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}
