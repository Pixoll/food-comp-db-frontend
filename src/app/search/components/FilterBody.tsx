"use client";

import type { GetFoodsData } from "@/api";
import { Button, Field, Input, MultiSearchSelect, SearchSelect, Select, type SelectOption } from "@/app/components/ui";
import { useTranslation } from "@/context/I18nContext";
import { useGroups, useNutrients } from "@/hooks";
import { Plus, RotateCcw, X } from "lucide-react";
import { type JSX, useMemo } from "react";

export type Operator = NonNullable<NonNullable<GetFoodsData["query"]>["operators"]>[number];

export type NutrientFilter = {
    id?: number;
    op: Operator;
    value: string;
};

export type Filters = {
    groups: number[];
    nutrients: NutrientFilter[];
};

export const emptyFilters = (): Filters => ({ groups: [], nutrients: [{ op: ">=", value: "" }] });

type FilterBodyProps = {
    filters: Filters;
    onChange: (filters: Filters) => void;
    onReset: () => void;
};

export default function FilterBody({ filters, onChange, onReset }: FilterBodyProps): JSX.Element {
    const { t } = useTranslation();
    const ft = t.foodsFilter;
    const { idToObject } = useGroups();
    const { list } = useNutrients();

    const groupOptions: Array<SelectOption<number>> = useMemo(() => [...idToObject.values()]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(g => ({ value: g.id, label: g.name, description: g.code })), [idToObject]);

    const nutrientOptions: Array<SelectOption<number>> = useMemo(() => list.map(n => ({
        value: n.id,
        label: `${"· ".repeat(n.depth)}${n.name} (${n.measurementUnit})`,
        description: t.nutrientsDropdown[n.category],
    })), [list, t]);

    const operators: Array<{ value: Operator; symbol: string; label: string }> = [
        { value: "<", symbol: "<", label: ft.nutrients.less },
        { value: "<=", symbol: "≤", label: ft.nutrients.lessEqual },
        { value: "=", symbol: "=", label: ft.nutrients.equal },
        { value: ">=", symbol: "≥", label: ft.nutrients.greaterEqual },
        { value: ">", symbol: ">", label: ft.nutrients.greater },
    ];

    const updateNutrient = (index: number, patch: Partial<NutrientFilter>): void => {
        onChange({
            ...filters,
            nutrients: filters.nutrients.map((n, i) => i === index ? { ...n, ...patch } : n),
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-carbon">{ft.title}</h2>
                <Button variant="ghost" size="sm" icon={<RotateCcw size={14}/>} onClick={onReset}>
                    {ft.reset}
                </Button>
            </div>

            <Field label={ft.group}>
                <MultiSearchSelect
                    options={groupOptions}
                    values={filters.groups}
                    onChange={groups => onChange({ ...filters, groups })}
                    placeholder={ft.allGroups}
                    emptyText={t.common.noResults}
                />
            </Field>

            <div className="flex flex-col gap-3">
                <div>
                    <p className="text-[13px] font-medium text-graphite">{ft.nutrients.title}</p>
                    <p className="text-[12px] text-ash">{ft.nutrients.description}</p>
                </div>

                {filters.nutrients.map((filter, index) => {
                    const value = filter.value.trim() === "" ? undefined : Number(filter.value.replace(",", "."));
                    const invalid = value !== undefined && (Number.isNaN(value) || value < 0);

                    return (
                        <div key={index} className="flex flex-col gap-2 rounded-input border border-fog bg-linen p-3">
                            <div className="flex items-start gap-2">
                                <div className="min-w-0 flex-1">
                                    <SearchSelect
                                        options={nutrientOptions.filter(o => o.value === filter.id
                                            || !filters.nutrients.some(n => n.id === o.value))}
                                        value={filter.id}
                                        onChange={id => updateNutrient(index, { id })}
                                        placeholder={ft.nutrients.select}
                                        emptyText={t.common.noResults}
                                    />
                                </div>
                                {filters.nutrients.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => onChange({
                                            ...filters,
                                            nutrients: filters.nutrients.filter((_, i) => i !== index),
                                        })}
                                        className="mt-1.5 rounded-full p-1 text-ash hover:bg-mist hover:text-carbon"
                                        aria-label={ft.nutrients.remove}
                                    >
                                        <X size={16}/>
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Select
                                    value={filter.op}
                                    onChange={e => updateNutrient(index, { op: e.target.value as Operator })}
                                    aria-label={ft.nutrients.operator}
                                    title={operators.find(op => op.value === filter.op)?.label}
                                    className="w-[72px] shrink-0 text-center"
                                >
                                    {operators.map(op => (
                                        <option key={op.value} value={op.value} title={op.label}>{op.symbol}</option>
                                    ))}
                                </Select>
                                <Input
                                    inputMode="decimal"
                                    value={filter.value}
                                    placeholder={ft.nutrients.value}
                                    aria-label={ft.nutrients.value}
                                    aria-invalid={invalid || undefined}
                                    onChange={e => updateNutrient(index, { value: e.target.value })}
                                    className="min-w-0 text-right tabular-nums"
                                />
                            </div>
                            {invalid && <p className="text-[12px] text-danger">{ft.nutrients.noNegative}</p>}
                        </div>
                    );
                })}

                <Button
                    variant="secondary"
                    size="sm"
                    icon={<Plus size={14}/>}
                    className="self-start"
                    onClick={() => onChange({
                        ...filters,
                        nutrients: [...filters.nutrients, { op: ">=", value: "" }],
                    })}
                >
                    {ft.nutrients.add}
                </Button>
            </div>
        </div>
    );
}
