'use client'
import { Book, Calendar, FileText, Globe, Info, MapPin, TagIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { City } from "@/hooks";
import NumericField from "@/app/components/Fields/NumericField";
import TextField from "@/app/components/Fields/TextField";
import SelectorWithInput from "@/app/components/Selector/SelectorWithInput";

export type ReferenceForm = {
  code: number;
  type: "report" | "thesis" | "article" | "website" | "book";
  title: string;
  authorIds?: number[];
  newAuthors?: string[];
  year?: number;
  newArticle?: NewArticle;
  cityId?: number;
  newCity?: string;
  other?: string;
};

export type NewArticle = {
  pageStart?: number;
  pageEnd?: number;
  volumeId?: number;
  newVolume?: NewVolume;
};

export type NewVolume = {
  volume?: number;
  issue?: number;
  year?: number;
  journalId?: number;
  newJournal?: string;
};

type NewReferenceProps = {
  code: number;
  type: "report" | "thesis" | "article" | "website" | "book";
  title: string;
  year?: number;
  cityId?: number;
  newCity?: string;
  other?: string;
  cities: City[];
  onFormUpdate: (updatedFields: Partial<ReferenceForm>) => void;
};

const searchCityNameByID = (
  id: number | undefined,
  cities: City[]
): string | undefined => {
  if (!id) return;
  const city = cities.find((city) => city.id === id);
  return city?.name;
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
}: NewReferenceProps) {
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

  const handleInputChange = <K extends keyof ReferenceForm>(field: K, value: ReferenceForm[K]) => {
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

  const getReferenceTypeIcon = () => {
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
          <span className="mr-[12px] text-[#4b5563]">{getReferenceTypeIcon()}</span>
          <h2 className="text-[18px] font-[600] text-[#111827] m-0">{t("GeneralData.Add")}</h2>
        </div>

        <div className="p-[20px]">
          <form className="space-y-[20px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <NumericField
                  label={t("GeneralData.Code")}
                  value={code}
                  onChange={() => {}}
                  id="formReferenceCode"
                  disabled={true}
                  fullWidth
                  icon={<span className="text-[#4b5563]"><TagIcon className="w-[18px] h-[18px]" /></span>}
                  required
              />

              <div className="flex flex-col w-full">
                <label
                    htmlFor="formReferenceType"
                    className="text-[14px] font-[500] mb-[4px] text-[#374151] flex items-center"
                >
                  <span className="mr-[8px] text-[#4b5563]"><Book className="w-[18px] h-[18px]" /></span>
                  {t("GeneralData.Type")}
                  <span className="text-[#dc2626] ml-[4px]">*</span>
                </label>

                <select
                    id="formReferenceType"
                    value={referenceForm.type}
                    onChange={(e) => handleInputChange("type", e.target.value as ReferenceForm["type"])}
                    className="px-[12px] py-[8px] rounded-[4px] border border-[#d1d5db] bg-[white] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6] w-full"
                >
                  <option value="report">{t("GeneralData.Report")}</option>
                  <option value="thesis">{t("GeneralData.Thesis")}</option>
                  <option value="article">{t("GeneralData.Article")}</option>
                  <option value="website">{t("GeneralData.Website")}</option>
                  <option value="book">{t("GeneralData.Book")}</option>
                </select>
              </div>
            </div>
            <TextField
                label={t("GeneralData.Title")}
                value={referenceForm.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                id="formReferenceTitle"
                fullWidth
                maxLength={300}
                placeholder={t("GeneralData.Enter_t")}
                error={referenceForm.title.length === 0}
                errorMessage="Ingrese el título."
                icon={<span className="text-[#4b5563]"><FileText className="w-[18px] h-[18px]" /></span>}
                required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <div className="flex flex-col w-full">
                <label
                    htmlFor="formReferenceCity"
                    className="text-[14px] font-[500] mb-[4px] text-[#374151] flex items-center"
                >
                  <span className="mr-[8px] text-[#4b5563]"><MapPin className="w-[18px] h-[18px]" /></span>
                  {t("GeneralData.City")}
                </label>

                <SelectorWithInput
                    options={cities}
                    newValueMaxLength={100}
                    placeholder={t("GeneralData.Select")}
                    selectedValue={
                        searchCityNameByID(referenceForm.cityId, cities) || newCity
                    }
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
                  label={t("GeneralData.Year")}
                  value={referenceForm.year}
                  onChange={(e) => handleInputChange("year", e)}
                  id="formReferenceYear"
                  fullWidth
                  min={1}
                  max={new Date().getFullYear()}
                  allowDecimals={false}
                  error={(isYearDefined || isTypeNotArticleOrWebsite) &&
                      (isYearBelow1 || isYearOverCurrent || isYearNotInteger)}
                  errorMessage={!isYearDefined ? "Ingrese el año."
                      : isYearBelow1 ? "Año debe ser al menos 1."
                          : isYearOverCurrent ? "Año debe ser menor o igual al actual."
                              : "Año debe ser un entero."}
                  icon={<span className="text-[#4b5563]"><Calendar className="w-[18px] h-[18px]" /></span>}
                  required={isTypeNotArticleOrWebsite}
              />
            </div>

            <TextField
                label={t("GeneralData.Other")}
                value={referenceForm.other || ""}
                onChange={(e) => handleInputChange("other", e.target.value)}
                id="formReferenceOther"
                fullWidth
                maxLength={100}
                placeholder={t("GeneralData.Additional")}
                error={isTypeWebsiteOrBook && !referenceForm.other?.length}
                errorMessage="Ingrese la información adicional."
                icon={<span className="text-[#4b5563]"><Info className="w-[18px] h-[18px]" /></span>}
                required={isTypeWebsiteOrBook}
            />
          </form>
        </div>
      </div>
  );
};
