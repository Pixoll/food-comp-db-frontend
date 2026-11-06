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
} from "@/app/components/ui";
import { useTranslation } from "@/context/I18nContext";
import { useToast } from "@/context/ToastContext";
import { FetchStatus, useScientificNames } from "@/hooks";
import { ChevronRight, Leaf, Plus, Search } from "lucide-react";
import Link from "next/link";
import { type FormEvent, type JSX, useMemo, useState } from "react";

export default function AddScientificNamePage(): JSX.Element {
    return (
        <RequireAdmin>
            <ScientificNamesAdmin/>
        </RequireAdmin>
    );
}

function ScientificNamesAdmin(): JSX.Element {
    const { t } = useTranslation();
    const s = t.addScientificName;
    const { addToast } = useToast();
    const { status, idToObject, forceReload } = useScientificNames();
    const [name, setName] = useState("");
    const [query, setQuery] = useState("");
    const [saving, setSaving] = useState(false);

    const names = useMemo(() => [...idToObject.values()].sort((a, b) => a.name.localeCompare(b.name)), [idToObject]);
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return q ? names.filter(n => n.name.toLowerCase().includes(q)) : names;
    }, [names, query]);

    const exists = names.some(n => n.name.toLowerCase() === name.trim().toLowerCase());

    const submit = async (event: FormEvent): Promise<void> => {
        event.preventDefault();
        const value = name.trim();
        if (!value || exists) return;

        setSaving(true);
        const result = await api.createScientificName({ body: { name: value } }).catch(error => ({ error }));
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

        addToast({ type: "Success", message: s.created(value), position: "top-end", duration: 3000 });
        setName("");
        forceReload();
    };

    return (
        <PageContainer>
            <PageHeader
                eyebrow={(
                    <>
                        <Link href="/admin-page" className="hover:text-carbon">{t.adminPage.title}</Link>
                        <ChevronRight size={14}/>
                        <span>{s.title}</span>
                    </>
                )}
                title={s.title}
                description={s.subtitle}
            />

            <div className="grid items-start gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
                <Card as="section" padding="lg">
                    <CardHeader icon={<Plus size={18}/>} title={s.addNew}/>
                    <form className="flex flex-col gap-4" onSubmit={e => void submit(e)}>
                        <Field
                            label={s.addNew}
                            htmlFor="scientific-name"
                            error={exists ? s.alreadyExists : undefined}
                        >
                            <Input
                                id="scientific-name"
                                value={name}
                                placeholder={s.namePlaceholder}
                                onChange={e => {
                                    setName(e.target.value);
                                    setQuery(e.target.value);
                                }}
                                aria-invalid={exists || undefined}
                                className="italic"
                            />
                        </Field>
                        <Button type="submit" disabled={saving || !name.trim() || exists} className="self-start">
                            {saving ? s.adding : s.add}
                        </Button>
                    </form>
                </Card>

                <Card as="section" padding="none">
                    <div className="border-b border-fog p-5">
                        <CardHeader
                            icon={<Leaf size={18}/>}
                            title={s.searchExistent}
                            description={status === FetchStatus.Success ? `${names.length}` : undefined}
                            className="mb-4"
                        />
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ash"/>
                            <Input
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder={s.searchPlaceholder}
                                aria-label={s.searchPlaceholder}
                                className="rounded-full pl-9"
                            />
                        </div>
                    </div>
                    {status === FetchStatus.Loading && <LoadingState label={s.loading}/>}
                    {status !== FetchStatus.Loading && filtered.length === 0 && <EmptyState title={s.noneFound}/>}
                    <ul className="grid gap-x-6 sm:grid-cols-2">
                        {filtered.map(n => (
                            <li key={n.id} className="border-b border-fog px-5 py-3 text-[14px] italic text-carbon">
                                {n.name}
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </PageContainer>
    );
}
