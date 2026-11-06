"use client";

import api from "@/api";
import { Button, Card, CardHeader, Field, MultiSearchSelect, type SelectOption, Textarea } from "@/app/components/ui";
import { useTranslation } from "@/context/I18nContext";
import { useToast } from "@/context/ToastContext";
import { BookOpen, CopyCheck, Plus } from "lucide-react";
import { type JSX, useState } from "react";

type ReferencesSectionProps = {
    selected: number[];
    onChange: (codes: number[]) => void;
    options: Array<SelectOption<number>>;
    nextCode: number;
    filledCount: number;
    onApplyToAll: () => void;
    onReferenceCreated: (code: number) => void;
};

const MAX_TEXT = 1000;

export default function ReferencesSection({
    selected,
    onChange,
    options,
    nextCode,
    filledCount,
    onApplyToAll,
    onReferenceCreated,
}: ReferencesSectionProps): JSX.Element {
    const { t } = useTranslation();
    const f = t.foodForm;
    const { addToast } = useToast();
    const [creating, setCreating] = useState(false);
    const [text, setText] = useState("");
    const [saving, setSaving] = useState(false);

    const createReference = async (): Promise<void> => {
        const value = text.trim();
        if (!value) return;

        setSaving(true);
        const result = await api.createReference({ path: { code: nextCode }, body: { text: value } })
            .catch(error => ({ error }));
        setSaving(false);

        if (result.error) {
            addToast({
                type: "Danger",
                title: t.common.error,
                message: (result.error as { message?: string }).message ?? t.common.unknownError,
                position: "top-end",
                duration: 6000,
            });
            return;
        }

        onReferenceCreated(nextCode);
        setText("");
        setCreating(false);
    };

    return (
        <Card as="section" padding="lg">
            <CardHeader
                icon={<BookOpen size={18}/>}
                title={f.sections.references}
                description={f.foodReferencesHint}
                actions={!creating && (
                    <Button variant="secondary" size="sm" icon={<Plus size={14}/>} onClick={() => setCreating(true)}>
                        {f.newReference}
                    </Button>
                )}
            />

            <Field label={f.foodReferences}>
                <MultiSearchSelect
                    options={options}
                    values={selected}
                    onChange={onChange}
                    placeholder={f.referencePlaceholder}
                    emptyText={t.common.noResults}
                    renderChipLabel={o => `[${o.value}] ${o.label}`}
                />
            </Field>

            <div className="mt-4">
                <Button
                    variant="soft"
                    size="sm"
                    icon={<CopyCheck size={14}/>}
                    onClick={onApplyToAll}
                    disabled={selected.length === 0 || filledCount === 0}
                >
                    {f.applyToAll}
                </Button>
            </div>

            {creating && (
                <div className="mt-6 rounded-card border border-fog bg-linen p-5">
                    <Field
                        label={`${f.newReference} · ${t.referencesAdmin.code} ${nextCode}`}
                        htmlFor="new-reference-text"
                        hint={f.newReferenceHint}
                    >
                        <Textarea
                            id="new-reference-text"
                            autoFocus
                            value={text}
                            maxLength={MAX_TEXT}
                            placeholder={t.referencesAdmin.textPlaceholder}
                            onChange={e => setText(e.target.value)}
                        />
                    </Field>
                    <div className="mt-3 flex gap-2">
                        <Button size="sm" onClick={createReference} disabled={saving || !text.trim()}>
                            {saving ? t.referencesAdmin.saving : f.create}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setCreating(false)}>{f.cancel}</Button>
                    </div>
                </div>
            )}
        </Card>
    );
}
