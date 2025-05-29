'use client'

import {FileTextIcon, ListIcon, PackageIcon, TagIcon} from "lucide-react";
import {ChangeEvent, useState} from "react";
import {useTranslation} from "react-i18next";
import {Group, Language, ScientificName, Subspecies, Type} from "@/core/hooks";
import Selector from "@/app/components/Selector/Selector";
import TextField from "@/app/components/TextField";

export const searchScientificNameById = (
    id: number | undefined,
    scientificName: ScientificName[]
) => {
    const sname = scientificName.find((sname) => sname.id === id);
    return sname?.name;
};

export const searchSubspeciesNameById = (
    id: number | undefined,
    subspecies: Subspecies[]
) => {
    const subspecie = subspecies.find((subspecie) => subspecie.id === id);
    return subspecie?.name;
};

export const searchGroupNameById = (id: number | undefined, groups: Group[]) => {
    const group = groups.find((group) => group.id === id);
    return group?.name;
};

export const searchTypeNameById = (id: number | undefined, types: Type[]) => {
    const type = types.find((type) => type.id === id);
    return type?.name;
};

type GeneralData = {
    code: string;
    strain?: string | null;
    brand?: string | null;
    observation?: string | null;
    scientificNameId?: number;
    subspeciesId?: number;
    groupId?: number;
    typeId?: number;
    commonName: Record<"es", string> &
        Partial<Record<"en" | "pt", string | null>>;
    ingredients: Partial<Record<"es" | "en" | "pt", string | null>>;
};

type NewGeneralDataProps = {
    data: GeneralData;
    onUpdate: (data: GeneralData) => void;
    types: Type[];
    groups: Group[];
    languages: Language[]
    scientificNames: ScientificName[];
    subspecies: Subspecies[];
};

export default function AddFoodGeneralData({
                                           data,
                                           onUpdate,
                                           groups,
                                           types,
                                           languages,
                                           scientificNames,
                                           subspecies
                                       }: NewGeneralDataProps) {

    const {t} = useTranslation();


    const [formData, setFormData] = useState<GeneralData>(data);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const {name, value} = e.target;
        const updatedFormData = {...formData, [name]: value};
        setFormData(updatedFormData);
        onUpdate(updatedFormData);
    };
    return (
        <form className="p-[16px] bg-[white] rounded-[4px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] mb-[12px]">
                <TextField
                    label={t("DetailFood.code")}
                    required
                    name="code"
                    maxLength={8}
                    icon={<TagIcon size={18}/>}
                    error={!formData.code || !/^[a-z0-9]{8}$/i.test(formData.code)}
                    errorMessage={!formData.code ? "Ingrese el código." : "Código debe ser de 8 caracteres alfanuméricos."}
                    value={formData.code || ""}
                    onChange={handleInputChange}
                    placeholder={t("DetailFood.code")}
                    fullWidth
                />

                <TextField
                    label={t("AddFoodGeneralData.strain")}
                    name="strain"
                    maxLength={50}
                    icon={<ListIcon size={18}/>}
                    value={formData.strain || ""}
                    onChange={handleInputChange}
                    placeholder={t("AddFoodGeneralData.strain")}
                    fullWidth
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] mb-[12px]">
                <TextField
                    label={t("AddFoodGeneralData.brand")}
                    name="brand"
                    maxLength={8}
                    icon={<PackageIcon size={18}/>}
                    value={formData.brand || ""}
                    onChange={handleInputChange}
                    placeholder={t("AddFoodGeneralData.brand")}
                    fullWidth
                />

                <TextField
                    label={t("AddFoodGeneralData.Observation")}
                    name="observation"
                    maxLength={200}
                    icon={<FileTextIcon size={18}/>}
                    value={formData.observation || ""}
                    onChange={handleInputChange}
                    placeholder={t("AddFoodGeneralData.Observation")}
                    fullWidth
                />
            </div>

            <div className="mb-[12px]">
                <div className="mb-[8px]">
                    <label className="block text-[14px] font-medium text-[#4B5563]">
                        {t("DetailFood.label_group")}
                        <span className="text-[#EF4444]">*</span>
                    </label>
                </div>
                {groups && (
                    <Selector
                        options={groups.map((group) => ({
                            id: group.id,
                            name: group.name,
                        }))}
                        selectedValue={searchGroupNameById(formData.groupId, groups) ?? ""}
                        placeholder={t("AddFoodGeneralData.select_G")}
                        onSelect={(id) => {
                            if (id !== null) {
                                const updatedFormData = {
                                    ...formData,
                                    groupId: id,
                                };
                                setFormData(updatedFormData);
                                onUpdate(updatedFormData);
                            }
                        }}
                    />
                )}
            </div>

            <div className="mb-[12px]">
                <div className="mb-[8px]">
                    <label className="block text-[14px] font-medium text-[#4B5563]">
                        {t("DetailFood.label_type")}
                        <span className="text-[#EF4444]">*</span>
                    </label>
                </div>
                {types && (
                    <Selector
                        options={types.map((type) => ({
                            id: type.id,
                            name: type.name,
                        }))}
                        selectedValue={searchTypeNameById(formData.typeId, types) ?? ""}
                        placeholder={t("AddFoodGeneralData.select_A")}
                        onSelect={(id) => {
                            if (id !== null) {
                                const updatedFormData = {
                                    ...formData,
                                    typeId: id,
                                };
                                setFormData(updatedFormData);
                                onUpdate(updatedFormData);
                            }
                        }}
                    />
                )}
            </div>
            <div className="mb-[12px]">
                <div className="mb-[8px]">
                    <label className="block text-[14px] font-medium text-[#4B5563]">
                        {t("AddFoodGeneralData.name_scientist")}
                    </label>
                </div>
                {scientificNames && (
                    <Selector
                        options={scientificNames.map((sname) => ({
                            id: sname.id,
                            name: sname.name,
                        }))}
                        selectedValue={searchScientificNameById(formData.scientificNameId, scientificNames) ?? ""}
                        placeholder={t("AddFoodGeneralData.Select_scientific")}
                        onSelect={(id) => {
                            if (id !== null) {
                                const updatedFormData = {
                                    ...formData,
                                    scientificNameId: id,
                                };
                                setFormData(updatedFormData);
                                onUpdate(updatedFormData);
                            }
                        }}
                    />
                )}
            </div>

            <div className="mb-[12px]">
                <div className="mb-[8px]">
                    <label className="block text-[14px] font-medium text-[#4B5563]">
                        {t("AddFoodGeneralData.Subspecies")}
                    </label>
                </div>
                {subspecies && (
                    <Selector
                        options={subspecies.map((sname) => ({
                            id: sname.id,
                            name: sname.name,
                        }))}
                        selectedValue={searchSubspeciesNameById(formData.subspeciesId, subspecies) ?? ""}
                        placeholder={t("AddFoodGeneralData.Select_subspecies")}
                        onSelect={(id) => {
                            if (id !== null) {
                                const updatedFormData = {
                                    ...formData,
                                    subspeciesId: id,
                                };
                                setFormData(updatedFormData);
                                onUpdate(updatedFormData);
                            }
                        }}
                    />
                )}
            </div>

            <div className="mb-[12px]">
                <div className="mb-[8px]">
                    <label className="block text-[14px] font-medium text-[#4B5563]">
                        Nombres comunes
                        <span className="text-[#EF4444]">*</span>
                    </label>
                </div>
                {languages?.map((lang, index) => (
                    <div key={lang.code} className={index > 0 ? "mt-[10px]" : ""}>
                        <TextField
                            maxLength={200}
                            placeholder={`${t("AddFoodGeneralData.name_com")} (${lang.code})`}
                            value={formData.commonName[lang.code] || ""}
                            error={lang.code === "es" && !formData.commonName[lang.code]}
                            errorMessage={lang.code === "es" && !formData.commonName[lang.code] ? "Ingrese el nombre en español." : ""}
                            onChange={(e) => {
                                const updatedFormData = {
                                    ...formData,
                                    commonName: {
                                        ...formData.commonName,
                                        [lang.code]: e.target.value,
                                    },
                                };
                                setFormData(updatedFormData);
                                onUpdate(updatedFormData);
                            }}
                            fullWidth
                        />
                    </div>
                ))}
            </div>

            <div className="mb-[12px]">
                <div className="mb-[8px]">
                    <label className="block text-[14px] font-medium text-[#4B5563]">
                        {t("AddFoodGeneralData.Ingredients")}
                    </label>
                </div>
                {languages?.map((lang, index) => (
                    <div key={lang.code} className={index > 0 ? "mt-[10px]" : ""}>
                        <TextField
                            maxLength={400}
                            placeholder={`${t("AddFoodGeneralData.Ingredient")} (${lang.code})`}
                            value={formData.ingredients[lang.code] || ""}
                            onChange={(e) => {
                                const updatedFormData = {
                                    ...formData,
                                    ingredients: {
                                        ...formData.ingredients,
                                        [lang.code]: e.target.value,
                                    },
                                };
                                setFormData(updatedFormData);
                                onUpdate(updatedFormData);
                            }}
                            fullWidth
                        />
                    </div>
                ))}
            </div>
        </form>
    );
}
