"use client";

import api from "@/api";
import {
    Button,
    Card,
    CardHeader,
    Field,
    Input,
    SearchSelect,
    type SelectOption,
    Textarea,
} from "@/app/components/ui";
import { useTranslation } from "@/context/I18nContext";
import { useToast } from "@/context/ToastContext";
import { FileText, Plus } from "lucide-react";
import { type JSX, useState } from "react";
import type { FoodFormErrors, FoodFormMode, FoodFormValues } from "./formModel";

type GeneralSectionProps = {
    mode: FoodFormMode;
    values: FoodFormValues;
    errors: FoodFormErrors;
    showErrors: boolean;
    codeTaken: boolean;
    onChange: (patch: Partial<FoodFormValues>) => void;
    onCodeBlur: () => void;
    groupOptions: Array<SelectOption<number>>;
    scientificNameOptions: Array<SelectOption<number>>;
    onScientificNameCreated: (name: string) => Promise<number | undefined>;
};

export default function GeneralSection({
    mode,
    values,
    errors,
    showErrors,
    codeTaken,
    onChange,
    onCodeBlur,
    groupOptions,
    scientificNameOptions,
    onScientificNameCreated,
}: GeneralSectionProps): JSX.Element {
    const { t } = useTranslation();
    const f = t.foodForm;
    const { addToast } = useToast();
    const [creatingName, setCreatingName] = useState<string | null>(null);
    const [savingName, setSavingName] = useState(false);

    const show = (error: string | undefined): string | undefined => showErrors ? error : undefined;
    const codeError = codeTaken ? f.codeTaken : show(errors.code);

    const createScientificName = async (): Promise<void> => {
        const name = creatingName?.trim();
        if (!name) return;

        setSavingName(true);
        const result = await api.createScientificName({ body: { name } }).catch(error => ({ error }));
        setSavingName(false);

        if (result.error) {
            addToast({
                type: "Danger",
                title: t.common.error,
                message: (result.error as { message?: string }).message ?? t.common.unknownError,
                position: "top-end",
                duration: 5000,
            });
            return;
        }

        const id = await onScientificNameCreated(name);
        if (id) onChange({ scientificNameId: id });
        setCreatingName(null);
    };

    return (
        <Card as="section" padding="lg">
            <CardHeader icon={<FileText size={18}/>} title={f.sections.general}/>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {mode === "create" && (
                    <Field
                        label={f.code}
                        htmlFor="food-code"
                        required
                        hint={f.codeHint}
                        error={codeError}
                    >
                        <Input
                            id="food-code"
                            value={values.code}
                            maxLength={8}
                            autoComplete="off"
                            spellCheck={false}
                            className="font-mono uppercase"
                            aria-invalid={!!codeError || undefined}
                            onChange={e => onChange({ code: e.target.value.toUpperCase() })}
                            onBlur={onCodeBlur}
                        />
                    </Field>
                )}

                <Field label={f.group} htmlFor="food-group" required error={show(errors.groupId)}>
                    <SearchSelect
                        id="food-group"
                        options={groupOptions}
                        value={values.groupId}
                        onChange={groupId => onChange({ groupId })}
                        placeholder={f.groupPlaceholder}
                        emptyText={t.common.noResults}
                        invalid={!!show(errors.groupId)}
                        clearable={false}
                    />
                </Field>

                <Field
                    label={f.foodName}
                    htmlFor="food-name"
                    error={show(errors.foodName) ?? show(errors.name)}
                >
                    <Input
                        id="food-name"
                        value={values.foodName}
                        aria-invalid={!!(show(errors.foodName) ?? show(errors.name)) || undefined}
                        onChange={e => onChange({ foodName: e.target.value })}
                    />
                </Field>

                <Field label={f.commonName} htmlFor="food-common-name" error={show(errors.commonName)}>
                    <Input
                        id="food-common-name"
                        value={values.commonName}
                        aria-invalid={!!show(errors.commonName) || undefined}
                        onChange={e => onChange({ commonName: e.target.value })}
                    />
                </Field>

                <Field label={f.scientificName} htmlFor="food-scientific-name">
                    {creatingName === null ? (
                        <SearchSelect
                            id="food-scientific-name"
                            options={scientificNameOptions}
                            value={values.scientificNameId}
                            onChange={scientificNameId => onChange({ scientificNameId })}
                            placeholder={f.scientificNamePlaceholder}
                            emptyText={t.common.noResults}
                            footer={(
                                <button
                                    type="button"
                                    onClick={() => setCreatingName("")}
                                    className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px]
                                    font-medium text-brand hover:bg-mint-wash"
                                >
                                    <Plus size={14}/>
                                    {f.newScientificName}
                                </button>
                            )}
                        />
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            <Input
                                id="food-scientific-name"
                                autoFocus
                                value={creatingName}
                                placeholder={t.addScientificName.namePlaceholder}
                                onChange={e => setCreatingName(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        void createScientificName();
                                    }
                                }}
                                className="flex-1 min-w-[180px] italic"
                            />
                            <Button
                                size="sm"
                                onClick={createScientificName}
                                disabled={savingName || !creatingName.trim()}
                            >
                                {f.create}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setCreatingName(null)}>
                                {f.cancel}
                            </Button>
                        </div>
                    )}
                </Field>

                <Field
                    label={f.portion}
                    htmlFor="food-portion"
                    hint={f.portionHint}
                    error={show(errors.portionQuantity)}
                >
                    <Input
                        id="food-portion"
                        inputMode="numeric"
                        value={values.portionQuantity}
                        aria-invalid={!!show(errors.portionQuantity) || undefined}
                        onChange={e => onChange({ portionQuantity: e.target.value })}
                        className="max-w-[160px]"
                    />
                </Field>

                <Field
                    label={f.observation}
                    htmlFor="food-observation"
                    error={show(errors.observation)}
                    className="md:col-span-2"
                >
                    <Textarea
                        id="food-observation"
                        value={values.observation}
                        rows={2}
                        aria-invalid={!!show(errors.observation) || undefined}
                        onChange={e => onChange({ observation: e.target.value })}
                    />
                </Field>

                <Field
                    label={f.others}
                    htmlFor="food-others"
                    hint={f.othersHint}
                    error={show(errors.others)}
                    className="md:col-span-2"
                >
                    <Textarea
                        id="food-others"
                        value={values.others}
                        rows={2}
                        aria-invalid={!!show(errors.others) || undefined}
                        onChange={e => onChange({ others: e.target.value })}
                    />
                </Field>
            </div>
        </Card>
    );
}
