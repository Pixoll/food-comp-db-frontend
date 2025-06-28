"use client";

import type { Article, Journal, JournalVolume, NewArticleDto, NewVolumeDto } from "@/api";
import NumericField from "@/app/components/Fields/NumericField";
import TextField from "@/app/components/Fields/TextField";
import { BookOpen, FileText, Layers, PlusCircle, XCircle } from "lucide-react";
import { useState } from "react";

type NewArticleByReferenceProps = {
    data: {
        journals: Journal[];
        journalVolumes: JournalVolume[];
        articles: Article[];
    };
    dataForm: {
        newArticle?: RecursivePartial<NewArticleDto>;
    };
    updateNewArticle: (updatedArticle: RecursivePartial<NewArticleDto>) => void;
};

export type RecursivePartial<T> = {
    [K in keyof T]?: NonNullable<T[K]> extends Array<infer U>
        ? Array<RecursivePartial<U>>
        : NonNullable<T[K]> extends ReadonlyArray<infer U>
            ? ReadonlyArray<RecursivePartial<U>>
            : NonNullable<T[K]> extends object
                ? RecursivePartial<NonNullable<T[K]>>
                : T[K];
};

const searchIdJournalByIdVolume = (id: number | undefined, volumes: JournalVolume[]): number | undefined => {
    const volume = volumes.find((volume) => volume.id === id);
    return volume?.journalId;
};

export default function ArticleByReference({
    data,
    dataForm,
    updateNewArticle,
}: NewArticleByReferenceProps): JSX.Element {
    const { journals, journalVolumes } = data;

    const [selectedIdJournal, setSelectedIdJournal] = useState<number | undefined>(
        searchIdJournalByIdVolume(dataForm.newArticle?.volumeId, journalVolumes)
        ?? dataForm.newArticle?.newVolume?.journalId
    );
    const [newJournalName, setNewJournalName] = useState(dataForm.newArticle?.newVolume?.newJournal);
    const [newJournal, setNewJournal] = useState(!!newJournalName);

    const doesJournalHaveValue = !!(selectedIdJournal ?? newJournalName);

    const [selectedIdVolume, setSelectedIdVolume] = useState<number | undefined>(
        doesJournalHaveValue ? dataForm.newArticle?.volumeId : undefined
    );
    const [selectedVolume, setSelectedVolume] = useState<Partial<NewVolumeDto> | undefined>(
        doesJournalHaveValue && dataForm.newArticle?.newVolume
            ? { ...dataForm.newArticle.newVolume }
            : undefined
    );
    const [newVolume, setNewVolume] = useState(!!selectedVolume);

    const doesVolumeHaveValue = doesJournalHaveValue
        && !!(selectedIdVolume ?? (selectedVolume?.volume && selectedVolume.issue && selectedVolume.year));

    const [selectedArticle, setSelectedArticle] = useState<RecursivePartial<NewArticleDto> | undefined>(
        doesVolumeHaveValue ? dataForm.newArticle : undefined
    );

    const handleSelectVolume = (id: number | undefined): void => {
        if (id !== undefined) {
            const selectedJournalVolume = journalVolumes.find((v) => v.id === id);
            if (selectedJournalVolume) {
                setSelectedIdVolume(id);
                setSelectedVolume(undefined);
                return;
            }
        }
        setSelectedIdVolume(undefined);
    };

    const handleUpdateVolume = <K extends keyof NewVolumeDto>(
        field: K,
        value: NewVolumeDto[K] | undefined
    ): void => {
        setSelectedIdVolume(undefined);
        setSelectedVolume((prev) => ({
            ...prev,
            [field]: value,
        }));
        setSelectedArticle(undefined);
        if (selectedVolume) {
            selectedVolume[field] = value;
        }
    };

    const handleAddJournal = (): void => {
        setNewJournal(!newJournal);
        if (selectedIdJournal) {
            setSelectedIdJournal(undefined);
            setSelectedVolume((prev) => ({
                ...prev,
                journalId: undefined,
                newJournal: undefined,
            }));
        } else {
            setNewJournalName(undefined);
        }
    };

    const handleAddVolume = (): void => {
        setNewVolume(!newVolume);
        setSelectedArticle(undefined);

        if (newVolume) {
            setSelectedVolume({
                volume: undefined,
                issue: undefined,
                year: undefined,
                journalId: undefined,
                newJournal: undefined,
            });
        } else {
            setSelectedIdVolume(undefined);
        }
    };

    const handleUpdateArticle = <K extends keyof NewArticleDto>(
        field: K,
        value: NewArticleDto[K] | undefined
    ): void => {
        const updatedArticle: RecursivePartial<NewArticleDto> = {
            ...selectedArticle,
            [field]: value,
            volumeId: selectedIdVolume,
            newVolume: selectedVolume && {
                ...selectedVolume,
                journalId: selectedIdJournal,
                newJournal: newJournalName,
            },
        };

        setSelectedArticle(updatedArticle);
        updateNewArticle(updatedArticle);
    };

    const isVolumeUndefined = typeof selectedVolume?.volume === "undefined";
    const isVolumeBelow1 = (selectedVolume?.volume ?? 0) < 1;
    const isVolumeNotInteger = !Number.isSafeInteger(selectedVolume?.volume ?? 0);

    const isIssueUndefined = typeof selectedVolume?.issue === "undefined";
    const isIssueBelow1 = (selectedVolume?.issue ?? 0) < 1;
    const isIssueNotInteger = !Number.isSafeInteger(selectedVolume?.issue ?? 0);

    const isYearUndefined = typeof selectedVolume?.year === "undefined";
    const isYearBelow1 = (selectedVolume?.year ?? 0) < 1;
    const isYearOverCurrent = (selectedVolume?.year ?? 0) > new Date().getUTCFullYear();
    const isYearNotInteger = !Number.isSafeInteger(selectedVolume?.year ?? 0);

    const isPageStartUndefined = typeof selectedArticle?.pageStart === "undefined";
    const isPageStartBelow1 = (selectedArticle?.pageStart ?? 0) < 1;
    const isPageStartNotInteger = !Number.isSafeInteger(selectedArticle?.pageStart ?? 0);

    const isPageEndUndefined = typeof selectedArticle?.pageEnd === "undefined";
    const isPageEndBelow1 = (selectedArticle?.pageEnd ?? 0) < 1;
    const isPageEndBelowPageStart = (selectedArticle?.pageEnd ?? 1) <= (selectedArticle?.pageStart ?? 1);
    const isPageEndNotInteger = !Number.isSafeInteger(selectedArticle?.pageEnd ?? 0);

    return (
        <div className="container mx-auto p-[16px]">
            <div className="rounded-[8px] border-[1px] border-[#e5e7eb] mb-[16px] shadow-sm bg-[white] overflow-hidden">
                <div className="flex items-center p-[16px] border-b border-[#e5e7eb] bg-[#f9fafb]">
                    <BookOpen className="mr-[8px] text-[#4b5563]"/>
                    <h2 className="text-[18px] font-[600] text-[#111827] m-0">Seleccionar una revista</h2>
                </div>

                <div className="p-[16px]">
                    {newJournal ? (
                        <div className="flex flex-col md:flex-row gap-[16px]">
                            <div className="flex-grow md:w-[66.67%]">
                                <TextField
                                    value={newJournalName || ""}
                                    onChange={(e) => {
                                        setNewJournalName(e.target.value);
                                        setSelectedIdJournal(undefined);
                                        setSelectedIdVolume(undefined);
                                        setSelectedVolume(undefined);
                                        setSelectedArticle(undefined);
                                    }}
                                    maxLength={100}
                                    placeholder="Agregar nueva revista"
                                    error={!newJournalName?.length}
                                    errorMessage="Ingrese el nombre de la revista."
                                    fullWidth
                                />
                            </div>
                            <div className="md:w-[33.33%]">
                                <button
                                    onClick={handleAddJournal}
                                    className="
                                    w-full
                                    px-[16px]
                                    py-[8px]
                                    border
                                    border-[#6b7280]
                                    text-[#6b7280]
                                    rounded-[4px]
                                    hover:bg-[#f3f4f6]
                                    transition-colors
                                    duration-200
                                    flex
                                    items-center
                                    justify-center
                                    "
                                >
                                    <XCircle className="mr-[8px]"/>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row gap-[16px]">
                            <div className="flex-grow md:w-[66.67%]">
                                <div className="flex flex-col w-full">
                                    <select
                                        value={selectedIdJournal || ""}
                                        onChange={(e) => {
                                            const id = +e.target.value;
                                            setSelectedIdJournal(id);
                                            setNewJournalName(undefined);
                                            setSelectedIdVolume(undefined);
                                            setSelectedVolume(undefined);
                                            setSelectedArticle(undefined);
                                        }}
                                        className="
                                        px-[12px]
                                        py-[8px]
                                        rounded-[4px]
                                        border
                                        border-[#d1d5db]
                                        w-full
                                        focus:outline-none
                                        focus:ring-1
                                        focus:ring-[#3b82f6]
                                        focus:border-[#3b82f6]
                                        "
                                    >
                                        <option value="">Selecciona una revista existente</option>
                                        {journals.map((journal) => (
                                            <option key={journal.id} value={journal.id}>
                                                {journal.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="md:w-[33.33%]">
                                <button
                                    onClick={handleAddJournal}
                                    className="
                                    w-full
                                    px-[16px]
                                    py-[8px]
                                    border
                                    border-[#3b82f6]
                                    text-[#3b82f6]
                                    rounded-[4px]
                                    hover:bg-[#eff6ff]
                                    transition-colors
                                    duration-200
                                    flex
                                    items-center
                                    justify-center
                                    "
                                >
                                    <PlusCircle className="mr-[8px]"/>
                                    Nueva revista
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {doesJournalHaveValue && (
                <div className="rounded-[8px] border border-[#e5e7eb] mb-[16px] shadow-sm bg-[white] overflow-hidden">
                    <div className="flex items-center p-[16px] border-b border-[#e5e7eb] bg-[#f9fafb]">
                        <Layers className="mr-[8px] text-[#4b5563]"/>
                        <h2 className="text-[18px] font-[600] text-[#111827] m-0">Seleccionar un volumen</h2>
                    </div>
                    <div className="p-[16px]">
                        {!newVolume ? (
                            <div className="flex flex-col md:flex-row gap-[16px]">
                                <div className="flex-grow md:w-[66.67%]">
                                    <div className="flex flex-col w-full">
                                        <select
                                            value={selectedIdVolume || ""}
                                            onChange={(e) => {
                                                const id = +e.target.value;
                                                handleSelectVolume(id);
                                                setSelectedArticle(undefined);
                                            }}
                                            className="
                                            px-[12px]
                                            py-[8px]
                                            rounded-[4px]
                                            border
                                            border-[#d1d5db]
                                            w-full
                                            focus:outline-none
                                            focus:ring-1
                                            focus:ring-[#3b82f6]
                                            focus:border-[#3b82f6]
                                            "
                                        >
                                            <option value="">Selecciona un volumen existente</option>
                                            {journalVolumes
                                                .filter((v) => v.journalId === selectedIdJournal)
                                                .map((v) => (
                                                    <option key={v.id} value={v.id}>
                                                        {`Volumen: ${v.volume}, Número: (${v.issue}), Año: ${v.year}`}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="md:w-[33.33%]">
                                    <button
                                        onClick={handleAddVolume}
                                        className="
                                        w-full
                                        px-[16px]
                                        py-[8px]
                                        border
                                        border-[#3b82f6]
                                        text-[#3b82f6]
                                        rounded-[4px]
                                        hover:bg-[#eff6ff]
                                        transition-colors
                                        duration-200
                                        flex
                                        items-center
                                        justify-center
                                        "
                                    >
                                        <PlusCircle className="mr-[8px]"/>
                                        Nuevo volumen
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-[16px]">
                                <div>
                                    <NumericField
                                        value={selectedVolume?.volume}
                                        onChange={(val) => handleUpdateVolume("volume", val)}
                                        min={1}
                                        allowDecimals={false}
                                        error={isVolumeUndefined || isVolumeBelow1 || isVolumeNotInteger}
                                        errorMessage={
                                            isVolumeUndefined
                                                ? "Ingrese el volúmen."
                                                : isVolumeBelow1
                                                    ? "Volúmen debe ser al menos 1."
                                                    : "Volúmen debe ser un entero."
                                        }
                                        helperText="Volumen"
                                        fullWidth
                                    />
                                </div>
                                <div>
                                    <NumericField
                                        value={selectedVolume?.issue}
                                        onChange={(val) => handleUpdateVolume("issue", val)}
                                        min={1}
                                        allowDecimals={false}
                                        error={isIssueUndefined || isIssueBelow1 || isIssueNotInteger}
                                        errorMessage={
                                            isIssueUndefined
                                                ? "Ingrese el número."
                                                : isIssueBelow1
                                                    ? "Número debe ser al menos 1."
                                                    : "Número debe ser un entero."
                                        }
                                        helperText="Número (Issue)"
                                        fullWidth
                                    />
                                </div>
                                <div>
                                    <NumericField
                                        value={selectedVolume?.year}
                                        onChange={(val) => handleUpdateVolume("year", val)}
                                        min={1}
                                        max={new Date().getFullYear()}
                                        allowDecimals={false}
                                        error={isYearUndefined || isYearBelow1 || isYearOverCurrent || isYearNotInteger}
                                        errorMessage={
                                            isYearUndefined
                                                ? "Ingrese el año."
                                                : isYearBelow1
                                                    ? "Año debe ser al menos 1."
                                                    : isYearOverCurrent
                                                        ? "Año debe ser menor o igual al actual."
                                                        : "Año debe ser un entero."
                                        }
                                        helperText="Año"
                                        fullWidth
                                    />
                                </div>
                                <div>
                                    <button
                                        onClick={handleAddVolume}
                                        className="
                                        w-full
                                        px-[16px]
                                        py-[8px]
                                        border
                                        border-[#6b7280]
                                        text-[#6b7280]
                                        rounded-[4px]
                                        hover:bg-[#f3f4f6]
                                        transition-colors
                                        duration-200
                                        flex
                                        items-center
                                        justify-center
                                        h-[38px]
                                        mt-[4px]
                                        "
                                    >
                                        <XCircle className="mr-[8px]"/>
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {doesVolumeHaveValue && (
                <div className="rounded-[8px] border border-[#e5e7eb] shadow-sm bg-[white] overflow-hidden">
                    <div className="flex items-center p-[16px] border-b border-[#e5e7eb] bg-[#f9fafb]">
                        <FileText className="mr-[8px] text-[#4b5563]"/>
                        <h2 className="text-[18px] font-[600] text-[#111827] m-0">Seleccionar un Artículo</h2>
                    </div>
                    <div className="p-[16px]">
                        <div className="flex flex-col md:flex-row gap-[16px]">
                            <div className="md:w-[33.33%]">
                                <NumericField
                                    value={selectedArticle?.pageStart}
                                    onChange={(val) => handleUpdateArticle("pageStart", val)}
                                    min={1}
                                    allowDecimals={false}
                                    error={isPageStartUndefined || isPageStartBelow1 || isPageStartNotInteger}
                                    errorMessage={
                                        isPageStartUndefined
                                            ? "Ingrese la página de inicio."
                                            : isPageStartBelow1
                                                ? "Página de inicio debe ser al menos 1."
                                                : "Página de inicio debe ser un entero."
                                    }
                                    helperText="Página de inicio"
                                    fullWidth
                                />
                            </div>
                            <div className="md:w-[33.33%]">
                                <NumericField
                                    value={selectedArticle?.pageEnd}
                                    onChange={(val) => handleUpdateArticle("pageEnd", val)}
                                    min={1}
                                    allowDecimals={false}
                                    error={isPageEndUndefined
                                        || isPageEndBelow1
                                        || isPageEndBelowPageStart
                                        || isPageEndNotInteger
                                    }
                                    errorMessage={
                                        isPageEndUndefined
                                            ? "Ingrese la página final."
                                            : isPageEndBelow1
                                                ? "Página final debe ser al menos 1."
                                                : isPageEndBelowPageStart
                                                    ? "Página final debe ser mayor a página de inicio."
                                                    : "Página final debe ser un entero."
                                    }
                                    helperText="Página final"
                                    fullWidth
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
