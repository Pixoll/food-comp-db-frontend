"use client";

import type { FoodGroup, FoodType, Language, ScientificName, StringTranslation, Subspecies } from "@/api";
import TextField from "@/app/components/Fields/TextField";
import Selector from "@/app/components/Selector/Selector";
import { useTranslation } from "@/context/I18nContext";
import { FileTextIcon, ListIcon, PackageIcon, TagIcon } from "lucide-react";
import { type ChangeEvent, type JSX, useState } from "react";

export const searchScientificNameById = (
    id: number | undefined,
    scientificName: ScientificName[]
): string | undefined => {
    const found = scientificName.find((name) => name.id === id);
    return found?.name;
};

export const searchSubspeciesNameById = (
    id: number | undefined,
    subspecies: Subspecies[]
): string | undefined => {
    const found = subspecies.find((subspecies) => subspecies.id === id);
    return found?.name;
};

export const searchGroupNameById = (id: number | undefined, groups: FoodGroup[]): string | undefined => {
    const group = groups.find((group) => group.id === id);
    return group?.name;
};

export const searchTypeNameById = (id: number | undefined, types: FoodType[]): string | undefined => {
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
    commonName: Record<"es", string> & Partial<Omit<StringTranslation, "es">>;
    ingredients: Partial<StringTranslation>;
};

type NewGeneralDataProps = {
    data: GeneralData;
    onUpdate: (data: GeneralData) => void;
    types: FoodType[];
    groups: FoodGroup[];
    languages: Language[];
    scientificNames: ScientificName[];
    subspecies: Subspecies[];
};

export default function FoodGeneralData({
    data,
    onUpdate,
    groups,
    types,
    languages,
    scientificNames,
    subspecies,
}: NewGeneralDataProps): JSX.Element {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<GeneralData>(data);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);
        onUpdate(updatedFormData);
    };

    return (
        <form className="p-[16px] bg-[white] rounded-[4px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] mb-[12px]">
                <TextField
                    label={t.addFoodGeneralData.code}
                    required
                    name="code"
                    maxLength={8}
                    icon={<TagIcon size={18}/>}
                    error={!formData.code || !/^[a-z0-9]{8}$/i.test(formData.code)}
                    errorMessage={!formData.code
                        ? t.addFoodGeneralData.enterCode
                        : t.addFoodGeneralData.codeMustBeAlphanumeric
                    }
                    value={formData.code || ""}
                    onChange={handleInputChange}
                    placeholder={t.foodDetail.code}
                    fullWidth
                />

                <TextField
                    label={t.addFoodGeneralData.strain}
                    name="strain"
                    maxLength={50}
                    icon={<ListIcon size={18}/>}
                    value={formData.strain || ""}
                    onChange={handleInputChange}
                    placeholder={t.addFoodGeneralData.strain}
                    fullWidth
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] mb-[12px]">
                <TextField
                    label={t.addFoodGeneralData.brand}
                    name="brand"
                    maxLength={8}
                    icon={<PackageIcon size={18}/>}
                    value={formData.brand || ""}
                    onChange={handleInputChange}
                    placeholder={t.addFoodGeneralData.brand}
                    fullWidth
                />

                <TextField
                    label={t.addFoodGeneralData.observation}
                    name="observation"
                    maxLength={200}
                    icon={<FileTextIcon size={18}/>}
                    value={formData.observation || ""}
                    onChange={handleInputChange}
                    placeholder={t.addFoodGeneralData.observation}
                    fullWidth
                />
            </div>

            <div className="mb-[12px]">
                <div className="mb-[8px]">
                    <label className="block text-[14px] font-medium text-[#4B5563]">
                        {t.addFoodGeneralData.group}
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
                        placeholder={t.addFoodGeneralData.selectGroup}
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
                        {t.addFoodGeneralData.type}
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
                        placeholder={t.addFoodGeneralData.selectType}
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
                        {t.addFoodGeneralData.scientificName}
                    </label>
                </div>
                {scientificNames && (
                    <Selector
                        options={scientificNames.map((name) => ({
                            id: name.id,
                            name: name.name,
                        }))}
                        selectedValue={searchScientificNameById(formData.scientificNameId, scientificNames) ?? ""}
                        placeholder={t.addFoodGeneralData.selectScientificName}
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
                        {t.addFoodGeneralData.subspecies}
                    </label>
                </div>
                {subspecies && (
                    <Selector
                        options={subspecies.map((name) => ({
                            id: name.id,
                            name: name.name,
                        }))}
                        selectedValue={searchSubspeciesNameById(formData.subspeciesId, subspecies) ?? ""}
                        placeholder={t.addFoodGeneralData.selectSubspecies}
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
                        {t.addFoodGeneralData.commonNames}
                        <span className="text-[#EF4444]">*</span>
                    </label>
                </div>
                {languages?.map((lang, index) => (
                    <div key={lang.code} className={index > 0 ? "mt-[10px]" : ""}>
                        <TextField
                            maxLength={200}
                            placeholder={`${t.addFoodGeneralData.commonName} (${lang.code})`}
                            value={formData.commonName[lang.code] || ""}
                            error={lang.code === "es" && !formData.commonName[lang.code]}
                            errorMessage={lang.code === "es" && !formData.commonName[lang.code]
                                ? t.addFoodGeneralData.enterSpanishName
                                : ""
                            }
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
                        {t.addFoodGeneralData.ingredients}
                    </label>
                </div>
                {languages?.map((lang, index) => (
                    <div key={lang.code} className={index > 0 ? "mt-[10px]" : ""}>
                        <TextField
                            maxLength={400}
                            placeholder={`${t.addFoodGeneralData.ingredient} (${lang.code})`}
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
