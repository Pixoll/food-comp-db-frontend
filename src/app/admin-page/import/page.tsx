"use client";

import api, { type XlsxImportResult, type XlsxPreview } from "@/api";
import RequireAdmin from "@/app/components/RequireAdmin";
import { Button, Card, PageContainer, PageHeader, Tabs } from "@/app/components/ui";
import { useTranslation } from "@/context/I18nContext";
import { useToast } from "@/context/ToastContext";
import { apiErrorMessage, apiErrorStatus } from "@/utils/apiError";
import { ChevronRight, FileSearch, Upload } from "lucide-react";
import Link from "next/link";
import { type JSX, useState } from "react";
import ColumnsPreview from "./components/ColumnsPreview";
import FileDrop from "./components/FileDrop";
import FoodsPreview from "./components/FoodsPreview";
import ImportDone from "./components/ImportDone";
import PreviewSummary from "./components/PreviewSummary";
import ReferencesPreview from "./components/ReferencesPreview";

type Tab = "foods" | "columns" | "references";

const alertClass = "rounded-input bg-danger-wash px-3 py-2 text-[13px] text-danger";
const switchLabelClass = "inline-flex cursor-pointer items-center gap-2.5 text-[14px] text-carbon";

export default function ImportXlsxPage(): JSX.Element {
    return (
        <RequireAdmin>
            <ImportXlsx/>
        </RequireAdmin>
    );
}

function ImportXlsx(): JSX.Element {
    const { t } = useTranslation();
    const x = t.importXlsx;
    const { addToast } = useToast();

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<XlsxPreview | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tab, setTab] = useState<Tab>("foods");
    const [updateExisting, setUpdateExisting] = useState(false);
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState<XlsxImportResult | null>(null);

    const errorText = (err: unknown): string => apiErrorStatus(err) === 422
        ? x.invalidFile
        : apiErrorMessage(err, t.common.unknownError);

    const chooseFile = (chosen: File): void => {
        setFile(chosen);
        setPreview(null);
        setError(null);
    };

    const analyze = async (): Promise<void> => {
        if (!file) return;

        setAnalyzing(true);
        setError(null);
        const response = await api.previewXlsx({ body: { file } }).catch((err: unknown) => ({ error: err }));
        setAnalyzing(false);

        if (response.error || !("data" in response) || !response.data) {
            setError(errorText(response.error));
            return;
        }

        setPreview(response.data);
        setTab("foods");
        setUpdateExisting(false);
    };

    const runImport = async (): Promise<void> => {
        if (!file) return;

        setImporting(true);
        const response = await api.importXlsx({ body: { file, updateExisting } })
            .catch((err: unknown) => ({ error: err }));
        setImporting(false);

        if (response.error || !("data" in response) || !response.data) {
            addToast({
                type: "Danger",
                title: t.common.error,
                message: errorText(response.error),
                position: "top-end",
            });
            return;
        }

        const imported = response.data;
        setResult(imported);
        addToast({
            type: "Success",
            message: x.importedToast(imported.created.length + imported.updated.length),
            position: "top-end",
            duration: 4000,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const reset = (): void => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setError(null);
    };

    const summary = preview?.summary;
    const toCreate = summary?.newFoods ?? 0;
    const toUpdate = updateExisting ? summary?.existingFoods ?? 0 : 0;

    return (
        <PageContainer width="xl">
            <div className={preview && !result ? "pb-32" : undefined}>
                <PageHeader
                    eyebrow={(
                        <>
                            <Link href="/admin-page" className="hover:text-carbon">{t.adminPage.title}</Link>
                            <ChevronRight size={14}/>
                            <span>{x.title}</span>
                        </>
                    )}
                    title={x.title}
                    description={x.description}
                />

                {result ? <ImportDone result={result} onReset={reset}/> : (
                    <div className="flex flex-col gap-6">
                        <Card padding="lg" className="flex flex-col gap-4">
                            <FileDrop file={file} onFile={chooseFile} disabled={analyzing || importing}/>
                            {error && (
                                <p role="alert" className={alertClass}>
                                    {error}
                                </p>
                            )}
                            {!preview && (
                                <Button
                                    onClick={() => void analyze()}
                                    disabled={!file || analyzing}
                                    icon={<FileSearch size={16}/>}
                                    className="self-start"
                                >
                                    {analyzing ? x.analyzing : x.analyze}
                                </Button>
                            )}
                        </Card>

                        {preview && (
                            <>
                                <PreviewSummary preview={preview}/>
                                <Card padding="none">
                                    <div className="px-5 pt-2">
                                        <Tabs<Tab>
                                            tabs={[
                                                { key: "foods", label: x.tabs.foods, count: preview.foods.length },
                                                {
                                                    key: "columns",
                                                    label: x.tabs.columns,
                                                    count: preview.columns.length,
                                                },
                                                {
                                                    key: "references",
                                                    label: x.tabs.references,
                                                    count: preview.references.length,
                                                },
                                            ]}
                                            active={tab}
                                            onChange={setTab}
                                        />
                                    </div>
                                    {tab === "foods" && (
                                        <FoodsPreview foods={preview.foods} references={preview.references}/>
                                    )}
                                    {tab === "columns" && <ColumnsPreview columns={preview.columns}/>}
                                    {tab === "references" && <ReferencesPreview references={preview.references}/>}
                                </Card>
                            </>
                        )}
                    </div>
                )}
            </div>

            {preview && !result && (
                <div className="fixed inset-x-0 bottom-0 z-20 border-t border-fog bg-paper/95 backdrop-blur">
                    <div
                        className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4
                        py-3 sm:px-6"
                    >
                        <div className="flex min-w-0 flex-col gap-1">
                            {summary && summary.existingFoods > 0 && (
                                <label className={switchLabelClass}>
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={updateExisting}
                                        onClick={() => setUpdateExisting(!updateExisting)}
                                        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                                            updateExisting ? "bg-brand" : "bg-fog"}`}
                                    >
                                        <span
                                            className={`absolute top-0.5 size-4 rounded-full bg-white shadow-subtle
                                            transition-transform ${updateExisting
                                                ? "translate-x-4"
                                                : "translate-x-0.5"}`}
                                        />
                                    </button>
                                    <span>
                                        {x.updateExisting(summary.existingFoods)}
                                        <span className="block text-[12px] text-graphite">{x.updateExistingHint}</span>
                                    </span>
                                </label>
                            )}
                            <p className="text-[13px] text-graphite">
                                {toCreate + toUpdate > 0 ? x.willImport(toCreate, toUpdate) : x.nothingToImport}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" onClick={reset} disabled={importing}>{x.changeFile}</Button>
                            <Button
                                onClick={() => void runImport()}
                                disabled={importing || toCreate + toUpdate === 0}
                                icon={<Upload size={16}/>}
                            >
                                {importing ? x.importing : x.import}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </PageContainer>
    );
}
