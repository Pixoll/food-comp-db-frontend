'use client'

import {Dispatch, SetStateAction, useState} from "react";
import {useTranslation} from "react-i18next";
import {FormState, useForm, useReferences} from "@/hooks";
import {
    NewArticleByReference,
    NewAuthors,
    NewReference,
    PreviewNewReference,
    ReferenceForm
} from "@/core/components/adminPage";

enum TypeOfHandle {
    GENERAL_DATA = 1,
    ARTICLE_BY_REFERENCE_DATA = 2,
}

function selectHandle<T extends object>(
    partialData: Partial<ReferenceForm>,
    i: TypeOfHandle,
    setFormState: Dispatch<SetStateAction<FormState<T>>>
) {
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

export default function AddReferencePage() {

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

    const {formState, setFormState, onResetForm} = useForm<ReferenceForm>({
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
let sectionNamesByNewReference: {id:string, name:string}[];

if (formState.type === "article") {
    sectionNamesByNewReference = [
        { id: "general", name: t("AdminPage.sectionNamesByNewReference.Data") },
        {
            id: "authors",
            name: t("AdminPage.sectionNamesByNewReference.Authors"),
        },
        {
            id: "article",
            name: t("AdminPage.sectionNamesByNewReference.Article"),
        },
        {
            id: "preview",
            name: t("AdminPage.sectionNamesByNewReference.Preview"),
        },
    ];
} else {
    sectionNamesByNewReference = [
        { id: "general", name: t("AdminPage.sectionNamesByNewReference.Data") },
        {
            id: "authors",
            name: t("AdminPage.sectionNamesByNewReference.Authors"),
        },
        {
            id: "preview",
            name: t("AdminPage.sectionNamesByNewReference.Preview"),
        },
    ];
}
    const renderSectionByNewReference = () => {
        switch (activeSection) {
            case "general":
                return (
                    <NewReference
                        code={formState.code}
                        type={formState.type}
                        title={formState.title}
                        year={formState.year}
                        cityId={formState.cityId}
                        newCity={formState.newCity}
                        other={formState.other}
                        cities={cities || []}
                        onFormUpdate={(updatedFields: Partial<ReferenceForm>) =>selectHandle({...formState,...updatedFields},TypeOfHandle.GENERAL_DATA, setFormState)}
                    />
                );
            case "authors":
                return (
                    <NewAuthors
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
                                        .map((author) => author.id)
                                },
                                TypeOfHandle.GENERAL_DATA,
                                setFormState
                            )
                        }
                    />
                );

            case "article":
                return (
                    <NewArticleByReference
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
                    <PreviewNewReference
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
    return (
        <>
            <div className="left-column">
                <h3 className="subtitle">{t("AdminPage.title")}</h3>
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
                <h2 className="title">{t("AdminPage.New_R")}</h2>
                {renderSectionByNewReference()}
            </div>
        </>
    )
}
