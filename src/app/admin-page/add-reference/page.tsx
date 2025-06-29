"use client";

import { useTranslation } from "@/context/I18nContext";
import { type FormState, useForm, useReferences } from "@/hooks";
import { type Dispatch, type JSX, type SetStateAction, useState } from "react";
import { ArticleByReference, Authors, GeneralData, PreviewPostReference, type ReferenceForm } from "./components";

enum TypeOfHandle {
    GENERAL_DATA = 1,
    ARTICLE_BY_REFERENCE_DATA = 2,
}

function selectHandle<T extends object>(
    partialData: Partial<ReferenceForm>,
    i: TypeOfHandle,
    setFormState: Dispatch<SetStateAction<FormState<T>>>
): Dispatch<SetStateAction<FormState<T>>> | void {
    switch (i) {
        case TypeOfHandle.GENERAL_DATA:
            return setFormState((prev) => ({
                ...prev,
                ...partialData,
            }));

        case TypeOfHandle.ARTICLE_BY_REFERENCE_DATA:
            return setFormState((prev) => ({
                ...prev,
                newArticle: partialData.newArticle,
            }));

        default:
            return setFormState;
    }
}

export default function AddReferencePage(): JSX.Element {
    const { t } = useTranslation();
    const {
        references,
        authors,
        cities,
        journals,
        journalVolumes,
        articles,
        forceReload,
    } = useReferences();
    const [activeSection, setActiveSection] = useState<string>("general");

    const { formState, setFormState, onResetForm } = useForm<ReferenceForm>({
        code: 0,
        type: "article", //Listo <GeneralData>
        title: "", //Listo <GeneralData>
        authorIds: undefined, //Listo <NewAuthor>
        newAuthors: undefined, //Listo<NewAuthor>
        year: undefined, //Listo <GeneralData>
        newArticle: undefined, //No listo <Para otro componente>
        cityId: undefined, //Listo <GeneralData>
        newCity: undefined, //Listo <GeneralData>
        other: undefined, //Listo <GeneralData>
    });

    if (!formState.code && references) {
        const newCode = Math.max(...(references?.map((r) => r.code) ?? [])) + 1;
        setFormState((previous) => ({
            ...previous,
            code: newCode,
        }));
        formState.code = newCode;
    }

    let sectionNamesByNewReference: Array<{ id: string; name: string }>;

    if (formState.type === "article") {
        sectionNamesByNewReference = [
            { id: "general", name: t.newReferencePage.sectionNames.data },
            {
                id: "authors",
                name: t.newReferencePage.sectionNames.authors,
            },
            {
                id: "article",
                name: t.newReferencePage.sectionNames.article,
            },
            {
                id: "preview",
                name: t.newReferencePage.sectionNames.preview,
            },
        ];
    } else {
        sectionNamesByNewReference = [
            { id: "general", name: t.newReferencePage.sectionNames.data },
            {
                id: "authors",
                name: t.newReferencePage.sectionNames.authors,
            },
            {
                id: "preview",
                name: t.newReferencePage.sectionNames.preview,
            },
        ];
    }

    const renderSectionByNewReference = (): JSX.Element | null => {
        switch (activeSection) {
            case "general":
                return (
                    <GeneralData
                        code={formState.code}
                        type={formState.type}
                        title={formState.title}
                        year={formState.year}
                        cityId={formState.cityId}
                        newCity={formState.newCity}
                        other={formState.other}
                        cities={cities || []}
                        onFormUpdate={(updatedFields: Partial<ReferenceForm>) => selectHandle(
                            { ...formState, ...updatedFields },
                            TypeOfHandle.GENERAL_DATA,
                            setFormState
                        )}
                    />
                );
            case "authors":
                return (
                    <Authors
                        authorIds={formState.authorIds}
                        newAuthors={formState.newAuthors}
                        data={authors || []}
                        updateAuthors={(authors) =>
                            selectHandle(
                                {
                                    newAuthors: authors
                                        .filter((author) => author.id < 0)
                                        .map((author) => author.name),
                                    authorIds: authors
                                        .filter((author) => author.id > 0)
                                        .map((author) => author.id),
                                },
                                TypeOfHandle.GENERAL_DATA,
                                setFormState
                            )
                        }
                    />
                );

            case "article":
                return (
                    <ArticleByReference
                        data={{
                            journals: journals || [],
                            journalVolumes: journalVolumes || [],
                            articles: articles || [],
                        }}
                        dataForm={{
                            newArticle: formState.newArticle,
                        }}
                        updateNewArticle={(updatedArticle) =>
                            selectHandle(
                                { newArticle: updatedArticle },
                                TypeOfHandle.ARTICLE_BY_REFERENCE_DATA,
                                setFormState
                            )
                        }
                    />
                );
            case "preview":
                return (
                    <PreviewPostReference
                        data={formState}
                        authors={authors || []}
                        cities={cities || []}
                        journals={journals || []}
                        journalVolumes={journalVolumes || []}
                        forceReload={forceReload}
                        handleResetReferenceForm={onResetForm}
                    />
                );
            default:
                return null;
        }
    };

    return <>
        <div className="left-column">
            <h3 className="subtitle">{t.newReferencePage.sections}</h3>
            {sectionNamesByNewReference.map(({ id, name }) => (
                <button
                    key={`post-reference-${id}`}
                    className={`pagination-button ${
                        activeSection === id ? "active" : ""
                    }`}
                    onClick={() => setActiveSection(id)}
                >
                    {name}
                </button>
            ))}
        </div>
        <div className="content-container">
            <h2 className="title">{t.newReferencePage.title}</h2>
            {renderSectionByNewReference()}
        </div>
    </>;
}
