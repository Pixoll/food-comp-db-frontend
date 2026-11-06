"use client";

import api from "@/api";
import RequireAdmin from "@/app/components/RequireAdmin";
import {
    Button,
    Card,
    CardHeader,
    EmptyState,
    Field,
    Input,
    LoadingState,
    PageContainer,
    PageHeader,
    Textarea,
} from "@/app/components/ui";
import { useTranslation } from "@/context/I18nContext";
import { useToast } from "@/context/ToastContext";
import { FetchStatus, useReferences } from "@/hooks";
import { BookOpen, ChevronRight, Plus, Search } from "lucide-react";
import Link from "next/link";
import { type FormEvent, type JSX, useMemo, useState } from "react";

const MAX_TEXT = 1000;

export default function AddReferencePage(): JSX.Element {
    return (
        <RequireAdmin>
            <ReferencesAdmin/>
        </RequireAdmin>
    );
}

function ReferencesAdmin(): JSX.Element {
    const { t } = useTranslation();
    const r = t.referencesAdmin;
    const { addToast } = useToast();
    const { status, references, byCode, nextCode, forceReload } = useReferences();
    const [codeInput, setCodeInput] = useState("");
    const [codeEdited, setCodeEdited] = useState(false);
    const [text, setText] = useState("");
    const [query, setQuery] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [saving, setSaving] = useState(false);

    // mientras no se edite, se propone el siguiente código libre
    const code = codeEdited ? codeInput : nextCode.toString();

    const codeNumber = Number(code);
    const codeError = !Number.isInteger(codeNumber) || codeNumber < 1
        ? r.codeInvalid
        : byCode.has(codeNumber) ? r.codeTaken : undefined;
    const textError = !text.trim() ? r.textRequired : undefined;

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return q
            ? references.filter(ref => ref.code.toString() === q || ref.text?.toLowerCase().includes(q))
            : references;
    }, [references, query]);

    const submit = async (event: FormEvent): Promise<void> => {
        event.preventDefault();
        setSubmitted(true);
        if (codeError || textError) return;

        setSaving(true);
        const result = await api.createReference({ path: { code: codeNumber }, body: { text: text.trim() } })
            .catch(error => ({ error }));
        setSaving(false);

        if (result.error) {
            addToast({
                type: "Danger",
                title: t.common.error,
                message: (result.error as { message?: string }).message ?? t.common.unknownError,
                position: "top-end",
            });
            return;
        }

        addToast({ type: "Success", message: r.created(codeNumber), position: "top-end", duration: 3000 });
        setText("");
        setCodeEdited(false);
        setSubmitted(false);
        forceReload();
    };

    return (
        <PageContainer>
            <PageHeader
                eyebrow={(
                    <>
                        <Link href="/admin-page" className="hover:text-carbon">{t.adminPage.title}</Link>
                        <ChevronRight size={14}/>
                        <span>{r.title}</span>
                    </>
                )}
                title={r.title}
                description={r.description}
            />

            <div className="grid items-start gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
                <Card as="section" padding="lg" className="lg:sticky lg:top-6">
                    <CardHeader icon={<Plus size={18}/>} title={r.newReference}/>
                    <form className="flex flex-col gap-4" noValidate onSubmit={e => void submit(e)}>
                        <Field
                            label={r.code}
                            htmlFor="reference-code"
                            required
                            hint={r.codeHint}
                            error={submitted || codeEdited ? codeError : undefined}
                        >
                            <Input
                                id="reference-code"
                                inputMode="numeric"
                                value={code}
                                onChange={e => {
                                    setCodeEdited(true);
                                    setCodeInput(e.target.value);
                                }}
                                className="max-w-[140px] tabular-nums"
                            />
                        </Field>
                        <Field
                            label={r.text}
                            htmlFor="reference-text"
                            required
                            error={submitted ? textError : undefined}
                            hint={`${text.length}/${MAX_TEXT}`}
                        >
                            <Textarea
                                id="reference-text"
                                rows={6}
                                maxLength={MAX_TEXT}
                                value={text}
                                placeholder={r.textPlaceholder}
                                onChange={e => setText(e.target.value)}
                            />
                        </Field>
                        <Button type="submit" disabled={saving} className="self-start">
                            {saving ? r.saving : r.save}
                        </Button>
                    </form>
                </Card>

                <Card as="section" padding="none">
                    <div className="border-b border-fog p-5">
                        <CardHeader
                            icon={<BookOpen size={18}/>}
                            title={r.existing}
                            description={status === FetchStatus.Success ? `${references.length}` : undefined}
                            className="mb-4"
                        />
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ash"/>
                            <Input
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder={r.search}
                                aria-label={r.search}
                                className="rounded-full pl-9"
                            />
                        </div>
                    </div>
                    {status === FetchStatus.Loading && <LoadingState label={r.loading}/>}
                    {status !== FetchStatus.Loading && filtered.length === 0 && <EmptyState title={r.none}/>}
                    <ol className="divide-y divide-fog">
                        {filtered.map(ref => (
                            <li key={ref.code} className="flex gap-4 px-5 py-4">
                                <span
                                    className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full
                                    bg-mist px-2 text-[12px] font-semibold tabular-nums text-graphite"
                                >
                                    {ref.code}
                                </span>
                                <p className="text-[14px] leading-relaxed text-carbon">{ref.text}</p>
                            </li>
                        ))}
                    </ol>
                </Card>
            </div>
        </PageContainer>
    );
}
