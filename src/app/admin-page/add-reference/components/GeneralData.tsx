"use client";

import type { City, NewArticleDto, Reference } from "@/api";
import NumericField from "@/app/components/Fields/NumericField";
import TextField from "@/app/components/Fields/TextField";
import SelectorWithInput from "@/app/components/Selector/SelectorWithInput";
import { useTranslation } from "@/context/I18nContext";
import { Book, Calendar, FileText, Globe, Info, MapPin, TagIcon } from "lucide-react";
import { type JSX, useState } from "react";
import type { RecursivePartial } from "./ArticleByReference";

export type ReferenceForm = {
    code: number;
    type: Reference["type"];
    title: string;
    authorIds?: number[];
    newAuthors?: string[];
    year?: number;
    newArticle?: RecursivePartial<NewArticleDto>;
    cityId?: number;
    newCity?: string;
    other?: string;
};

type NewReferenceProps = {
    code: number;
    type: Reference["type"];
    title: string;
    year?: number;
    cityId?: number;
    newCity?: string;
    other?: string;
    cities: City[];
    onFormUpdate: (updatedFields: Partial<ReferenceForm>) => void;
};

export default function GeneralData({
    code,
    type,
    title,
    year,
    cityId,
    newCity,
    other,
    cities,
    onFormUpdate,
}: NewReferenceProps): JSX.Element {
    const { t } = useTranslation();
    const [referenceForm, setReferenceForm] = useState<ReferenceForm>({
        code,
        type,
        title,
        year,
        cityId,
        newCity,
        other,
    });

    const handleInputChange = <K extends keyof ReferenceForm>(field: K, value: ReferenceForm[K]): void => {
        const updatedForm = { ...referenceForm } as ReferenceForm;

        if (field === "cityId") {
            updatedForm.cityId = value as ReferenceForm["cityId"];
            updatedForm.newCity = undefined;
        } else if (field === "newCity") {
            updatedForm.newCity = value as ReferenceForm["newCity"];
            updatedForm.cityId = undefined;
        } else {
            updatedForm[field] = value;
        }

        if (field === "type" && value !== "article") {
            updatedForm.newArticle = undefined;
        }

        setReferenceForm(updatedForm);
        onFormUpdate(updatedForm);
    };

    const isTypeNotArticleOrWebsite = type !== "article" && type !== "website";
    const isYearDefined = typeof referenceForm.year !== "undefined";
    const isYearBelow1 = (referenceForm.year ?? 0) < 1;
    const isYearOverCurrent = (referenceForm.year ?? 0) > new Date().getUTCFullYear();
    const isYearNotInteger = !Number.isSafeInteger(referenceForm.year ?? 0);

    const isTypeWebsiteOrBook = type === "website" || type === "book";

    return (
        <div className="mt-[16px] rounded-[8px] border border-[#e5e7eb] shadow-sm bg-white overflow-hidden">
            <div className="flex items-center p-[16px] border-b border-[#e5e7eb] bg-[#f9fafb]">
                <span className="mr-[12px] text-[#4b5563]">
                    <ReferenceTypeIcon type={type}/>
                </span>
                <h2 className="text-[18px] font-[600] text-[#111827] m-0">{t.newReferenceGeneralData.add}</h2>
            </div>

            <div className="p-[20px]">
                <form className="space-y-[20px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                        <NumericField
                            label={t.newReferenceGeneralData.code}
                            value={code}
                            onChange={() => {
                            }}
                            id="formReferenceCode"
                            disabled={true}
                            fullWidth
                            icon={<span className="text-[#4b5563]"><TagIcon className="w-[18px] h-[18px]"/></span>}
                            required
                        />

                        <div className="flex flex-col w-full">
                            <label
                                htmlFor="formReferenceType"
                                className="text-[14px] font-[500] mb-[4px] text-[#374151] flex items-center"
                            >
                                <span className="mr-[8px] text-[#4b5563]"><Book className="w-[18px] h-[18px]"/></span>
                                {t.newReferenceGeneralData.type}
                                <span className="text-[#dc2626] ml-[4px]">*</span>
                            </label>

                            <select
                                id="formReferenceType"
                                value={referenceForm.type}
                                onChange={(e) => handleInputChange("type", e.target.value as ReferenceForm["type"])}
                                className="
                                px-[12px]
                                py-[8px]
                                rounded-[4px]
                                border
                                border-[#d1d5db]
                                bg-[white]
                                focus:outline-none
                                focus:ring-1
                                focus:ring-[#3b82f6]
                                focus:border-[#3b82f6]
                                w-full
                                "
                            >
                                <option value="report">{t.newReferenceGeneralData.report}</option>
                                <option value="thesis">{t.newReferenceGeneralData.thesis}</option>
                                <option value="article">{t.newReferenceGeneralData.article}</option>
                                <option value="website">{t.newReferenceGeneralData.website}</option>
                                <option value="book">{t.newReferenceGeneralData.book}</option>
                            </select>
                        </div>
                    </div>
                    <TextField
                        label={t.newReferenceGeneralData.title}
                        value={referenceForm.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        id="formReferenceTitle"
                        fullWidth
                        maxLength={300}
                        placeholder={t.newReferenceGeneralData.enterTitle}
                        error={referenceForm.title.length === 0}
                        errorMessage={t.newReferenceGeneralData.enterTitle}
                        icon={<span className="text-[#4b5563]"><FileText className="w-[18px] h-[18px]"/></span>}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                        <div className="flex flex-col w-full">
                            <label
                                htmlFor="formReferenceCity"
                                className="text-[14px] font-[500] mb-[4px] text-[#374151] flex items-center"
                            >
                                <span className="mr-[8px] text-[#4b5563]"><MapPin className="w-[18px] h-[18px]"/></span>
                                {t.newReferenceGeneralData.city}
                            </label>

                            <SelectorWithInput
                                options={cities}
                                newValueMaxLength={100}
                                placeholder={t.newReferenceGeneralData.selectCity}
                                selectedValue={searchCityNameByID(referenceForm.cityId, cities) || newCity}
                                onSelect={(id, name) => {
                                    if (id) {
                                        handleInputChange("cityId", id);
                                    } else {
                                        handleInputChange("newCity", name);
                                    }
                                }}
                            />
                        </div>

                        <NumericField
                            label={t.newReferenceGeneralData.year}
                            value={referenceForm.year}
                            onChange={(e) => handleInputChange("year", e)}
                            id="formReferenceYear"
                            fullWidth
                            min={1}
                            max={new Date().getFullYear()}
                            allowDecimals={false}
                            error={(isYearDefined || isTypeNotArticleOrWebsite)
                                && (isYearBelow1 || isYearOverCurrent || isYearNotInteger)}
                            errorMessage={!isYearDefined
                                ? t.newReferenceGeneralData.enterYear
                                : isYearBelow1
                                    ? t.atLeast(t.newReferenceGeneralData.year, 1)
                                    : isYearOverCurrent
                                        ? t.newReferenceGeneralData.yearBelowCurrent
                                        : t.mustBeInteger(t.newReferenceGeneralData.year)
                            }
                            icon={<span className="text-[#4b5563]"><Calendar className="w-[18px] h-[18px]"/></span>}
                            required={isTypeNotArticleOrWebsite}
                        />
                    </div>

                    <TextField
                        label={t.newReferenceGeneralData.other}
                        value={referenceForm.other || ""}
                        onChange={(e) => handleInputChange("other", e.target.value)}
                        id="formReferenceOther"
                        fullWidth
                        maxLength={100}
                        placeholder={t.newReferenceGeneralData.enterOther}
                        error={isTypeWebsiteOrBook && !referenceForm.other?.length}
                        errorMessage={t.newReferenceGeneralData.enterOther}
                        icon={<span className="text-[#4b5563]"><Info className="w-[18px] h-[18px]"/></span>}
                        required={isTypeWebsiteOrBook}
                    />
                </form>
            </div>
        </div>
    );
};

type ReferenceTypeIconProps = {
    type: Reference["type"];
};

function ReferenceTypeIcon({ type }: ReferenceTypeIconProps): JSX.Element | null {
    switch (type) {
        case "book":
            return <Book className="me-[8px]"/>;
        case "article":
            return <FileText className="me-[8px]"/>;
        case "website":
            return <Globe className="me-[8px]"/>;
        case "report":
            return <Info className="me-[8px]"/>;
        case "thesis":
            return <FileText className="me-[8px]"/>;
        default:
            return null;
    }
}

function searchCityNameByID(id: number | undefined, cities: City[]): string | undefined {
    if (!id) return;
    const city = cities.find((city) => city.id === id);
    return city?.name;
}
