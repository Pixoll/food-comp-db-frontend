'use client'

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Ellipsis, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import {
  getNutrientNameById,
  NutrientMeasurementForm,
  NutrientMeasurementWithComponentsForm,
  NutrientSummary,
} from "@/pages/AdminPage";
import { NutrientMeasurementFormOnlyNumbers } from "./NewNutrients";
import NumericField from "@/app/components/Fields/NumericField";
import ToolTip from "@/app/components/ToolTip";

type NewMacronutrientWithComponentProps = {
  macronutrientsWithComponents: NutrientMeasurementWithComponentsForm[];
  onMacronutrientUpdate: (
    updatedNutrient: NutrientMeasurementWithComponentsForm
  ) => void;
  nameAndIdNutrients: NutrientSummary[];
};

export default function NewMacronutrientWithComponent({
  macronutrientsWithComponents,
  onMacronutrientUpdate,
  nameAndIdNutrients,
}: NewMacronutrientWithComponentProps) {
  const [open, setOpen] = useState<Set<string>>(
    new Set(macronutrientsWithComponents.map((n) => n.nutrientId.toString()))
  );
  const [editingComponentId, setEditingComponentId] = useState<number | undefined>(undefined);
  const [formData, setFormData] = useState<NutrientMeasurementForm | undefined>(undefined);
  const { t } = useTranslation();

  const toggleCollapse = (id: string) => {
    setOpen((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const startEditing = (component: NutrientMeasurementForm) => {
    setEditingComponentId(component.nutrientId);
    setFormData({ ...component });
  };

  const handleInputChange = (
    field: keyof NutrientMeasurementForm,
    value: any
  ) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const isValueDefined = <K extends keyof NutrientMeasurementForm>(key: K) => {
    const value = formData?.[key];
    return typeof value !== "undefined" && (typeof value === "string" ? value !== "" : true);
  };
  const isValueLessThan = <K extends keyof NutrientMeasurementFormOnlyNumbers>(key: K, comp: number) => {
    return (formData?.[key] ?? 0) < comp;
  };
  const isValueNotInteger = <K extends keyof NutrientMeasurementFormOnlyNumbers>(key: K) => {
    return !Number.isSafeInteger(formData?.[key] ?? 0);
  };

  const isAverageInvalid = (isValueDefined("average") || isValueDefined("dataType"))
    && (!isValueDefined("average") || isValueLessThan("average", 0));
  const isDeviationInvalid = isValueDefined("deviation") && isValueLessThan("deviation", 0);
  const isMinInvalid = isValueDefined("min") && isValueLessThan("min", 0);
  const isMaxInvalid = isValueDefined("max") && isValueLessThan("max", formData?.min ?? 0);
  const isSampleSizeInvalid = isValueDefined("sampleSize")
    && (isValueLessThan("sampleSize", 1) || isValueNotInteger("sampleSize"));
  const isDataTypeInvalid = (isValueDefined("average") || isValueDefined("dataType")) && !formData?.dataType;

  const saveChanges = () => {
    if (isAverageInvalid
      || isDeviationInvalid
      || isMinInvalid
      || isMaxInvalid
      || isSampleSizeInvalid
      || isDataTypeInvalid
    ) {
      return;
    }

    if (formData && editingComponentId !== undefined) {
      const updatedNutrients = macronutrientsWithComponents.map((nutrient) => {
        if (nutrient.nutrientId === editingComponentId) {
          return { ...nutrient, ...formData };
        }

        const updatedComponents = nutrient.components.map((component) =>
          component.nutrientId === editingComponentId
            ? { ...component, ...formData }
            : component
        );
        return { ...nutrient, components: updatedComponents };
      });

      const updatedNutrient = updatedNutrients.find(
        (nutrient) =>
          nutrient.nutrientId === editingComponentId ||
          nutrient.components.some(
            (component) => component.nutrientId === editingComponentId
          )
      );

      if (updatedNutrient) {
        onMacronutrientUpdate(updatedNutrient);
      }

      setEditingComponentId(undefined);
      setFormData(undefined);
    }
  };

  const cancelEditing = () => {
    setEditingComponentId(undefined);
    setFormData(undefined);
  };

  return (
      <div className="p-[20px] rounded-[8px] font-['Poppins',_sans-serif] text-[14px]">
        {macronutrientsWithComponents.map((nutrient) => (
            <div key={nutrient.nutrientId} className="mb-[16px] border-[1px] border-[#dee2e6] rounded-[5px] overflow-hidden">
              <div
                  className="bg-[#8fbc8f] p-[12px] flex justify-between items-center cursor-pointer"
                  onClick={() => toggleCollapse(nutrient.nutrientId.toString())}
              >
                <div className="font-[700] text-[16px] text-[white]">
                  {getNutrientNameById(nutrient.nutrientId, nameAndIdNutrients)}
                </div>
                <div>
                  {open.has(nutrient.nutrientId.toString()) ? (
                      <ChevronUp className="text-[white]" />
                  ) : (
                      <ChevronDown className="text-[white]" />
                  )}
                </div>
              </div>

              {open.has(nutrient.nutrientId.toString()) && (
                  <div className="p-[12px]">
                    <div className="overflow-x-auto">
                      <table className="w-full border-[1px] border-[#dee2e6] rounded-[5px] table-fixed">
                        <colgroup>
                          <col className="w-[20%]" />
                          <col className="w-[10%]" />
                          <col className="w-[10%]" />
                          <col className="w-[10%]" />
                          <col className="w-[10%]" />
                          <col className="w-[15%]" />
                          <col className="w-[15%]" />
                          <col className="w-[10%]" />
                        </colgroup>
                        <thead>
                        <tr className="bg-[#8fbc8f] rounded-[5px]">
                          <th className="bg-[white] text-[black] font-[700] p-[8px] text-left">
                            {t("NewMacronutrient.name")}
                          </th>
                          <th className="bg-[white] text-[black] font-[700] p-[8px] text-center">
                            {t("NewMacronutrient.mean")}
                          </th>
                          <th className="bg-[white] text-[black] font-[700] p-[8px] text-center">
                            {t("NewMacronutrient.Deviation")}
                          </th>
                          <th className="bg-[white] text-[black] font-[700] p-[8px] text-center">
                            {t("NewMacronutrient.min")}
                          </th>
                          <th className="bg-[white] text-[black] font-[700] p-[8px] text-center">
                            {t("NewMacronutrient.max")}
                          </th>
                          <th className="bg-[white] text-[black] font-[700] p-[8px] text-center">
                            {t("NewMacronutrient.Size")}
                          </th>
                          <th className="bg-[white] text-[black] font-[700] p-[8px] text-center">
                            {t("NewMacronutrient.type")}
                          </th>
                          <th className="bg-[white] text-[black] font-[700] p-[8px] text-center">
                            {t("NewMacronutrient.Action")}
                          </th>
                        </tr>
                        </thead>
                        <tbody>
                        {nutrient.components?.map((component, index) => (
                            <tr
                                key={component.nutrientId}
                                className={`${
                                    index % 2 === 0 ? "bg-[#f2f2f2]" : "bg-[white]"
                                } h-[60px] transition-all duration-200`}
                            >
                              {editingComponentId === component.nutrientId ? (
                                  <>
                                    <td className="p-[8px] align-middle">
                                      <div className="text-[14px]">
                                        {getNutrientNameById(component.nutrientId, nameAndIdNutrients)}
                                      </div>
                                    </td>
                                    <td className="p-[4px] text-center relative">
                                      <div className="flex flex-row">
                                        <NumericField
                                            value={formData?.average}
                                            error={isAverageInvalid}
                                            errorMessage=""
                                            onChange={(value) => handleInputChange("average", value)}
                                            allowDecimals={true}
                                            min={0}
                                            fullWidth={true}
                                        />
                                        {isAverageInvalid && (
                                            <ToolTip
                                                content={!isValueDefined("average")
                                                    ? "Ingrese el promedio."
                                                    : "Promedio debe ser al menos 0."}
                                            >
                                              <AlertCircle className="absolute right-[4px] top-[50%] -translate-y-[50%] h-[16px] w-[16px] text-[#ef4444]" />
                                            </ToolTip>
                                        )}
                                      </div>
                                    </td>
                                    <td className="p-[4px] text-center relative">
                                      <div className="flex flex-row">
                                        <NumericField
                                            value={formData?.deviation}
                                            error={isDeviationInvalid}
                                            errorMessage=""
                                            onChange={(value) => handleInputChange("deviation", value)}
                                            allowDecimals={true}
                                            min={0}
                                            fullWidth={true}
                                        />
                                        {isDeviationInvalid && (
                                            <ToolTip content="Desviación debe ser al menos 0.">
                                              <AlertCircle className="absolute right-[8px] top-[50%] -translate-y-[50%] h-[16px] w-[16px] text-[#ef4444]"/>
                                            </ToolTip>
                                        )}
                                      </div>
                                    </td>
                                    <td className="p-[4px] text-center relative">
                                      <div className="flex flex-row">
                                        <NumericField
                                            value={formData?.min}
                                            error={isMinInvalid}
                                            errorMessage=""
                                            onChange={(value) => handleInputChange("min", value)}
                                            allowDecimals={true}
                                            min={0}
                                            className="w-full"
                                        />
                                        {isMinInvalid && (
                                            <ToolTip content="Mínimo debe ser al menos 0.">
                                              <AlertCircle className="absolute right-[8px] top-[50%] -translate-y-[50%] h-[16px] w-[16px] text-[#ef4444]"/>
                                            </ToolTip>
                                        )}
                                      </div>
                                    </td>
                                    <td className="p-[4px] text-center relative">
                                      <div className="flex flex-row">
                                        <NumericField
                                            value={formData?.max}
                                            error={isMaxInvalid}
                                            errorMessage=""
                                            onChange={(value) => handleInputChange("max", value)}
                                            allowDecimals={true}
                                            min={formData?.min ?? 0}
                                            className="w-full"
                                        />
                                        {isMaxInvalid && (
                                            <ToolTip
                                                content={
                                                  isValueLessThan("max", 0)
                                                      ? "Máximo debe ser al menos 0."
                                                      : "Máximo debe ser mayor o igual al mínimo"
                                                }
                                            >
                                              <AlertCircle className="absolute right-[8px] top-[50%] -translate-y-[50%] h-[16px] w-[16px] text-[#ef4444]"/>
                                            </ToolTip>
                                        )}
                                      </div>
                                    </td>
                                    <td className="p-[4px] text-center relative">
                                      <div className="flex flex-row">
                                        <NumericField
                                            value={formData?.sampleSize}
                                            error={isSampleSizeInvalid}
                                            errorMessage=""
                                            onChange={(value) => handleInputChange("sampleSize", value)}
                                            allowDecimals={false}
                                            min={1}
                                            className="w-full"
                                        />
                                        {isSampleSizeInvalid && (
                                            <ToolTip
                                                content={
                                                  isValueLessThan("sampleSize", 1)
                                                      ? "Tamaño de muestra debe ser al menos 1."
                                                      : "Tamaño de muestra debe ser un entero."
                                                }
                                            >
                                              <AlertCircle className="absolute right-[8px] top-[50%] -translate-y-[50%] h-[16px] w-[16px] text-[#ef4444]"/>
                                            </ToolTip>
                                        )}
                                      </div>
                                    </td>
                                    <td className="p-[4px] text-center relative">
                                      <div className="flex flex-row">
                                        <select
                                            value={formData?.dataType || ""}
                                            className={`w-full p-[8px] rounded-[4px] border ${
                                                isDataTypeInvalid
                                                    ? "border-[#ef4444]"
                                                    : "border-[#d1d5db]"
                                            }`}
                                            onChange={(e) => handleInputChange("dataType", e.target.value)}
                                        >
                                          <option value="">Ninguna</option>
                                          <option value="analytic">
                                            {t("NewMacronutrient.Analytical")}
                                          </option>
                                          <option value="calculated">
                                            {t("NewMacronutrient.Calculated")}
                                          </option>
                                          <option value="assumed">
                                            {t("NewMacronutrient.Taken")}
                                          </option>
                                          <option value="borrowed">
                                            {t("NewMacronutrient.Borrowed")}
                                          </option>
                                        </select>
                                        {isDataTypeInvalid && (
                                            <ToolTip content="Ingrese el tipo de dato.">
                                              <AlertCircle className="absolute right-[8px] top-[50%] -translate-y-[50%] h-[16px] w-[16px] text-[#ef4444]"/>
                                            </ToolTip>
                                        )}
                                      </div>
                                    </td>
                                    <td className="p-[8px] text-center">
                                      <div className="flex flex-col space-y-[8px] justify-center">
                                        <button
                                            className="bg-[#3cb371] hover:bg-[#2e8b57] text-[white] py-[4px] px-[12px] rounded-[4px] transition-colors w-full"
                                            onClick={saveChanges}
                                        >
                                          {t("NewMacronutrient.save")}
                                        </button>
                                        <button
                                            className="bg-[#cd5c5c] hover:bg-[#b22222] text-[white] py-[4px] px-[12px] rounded-[4px] transition-colors w-full"
                                            onClick={cancelEditing}
                                        >
                                          {t("NewMacronutrient.cancel")}
                                        </button>
                                      </div>
                                    </td>
                                  </>
                              ) : (
                                  <>
                                    <td className="p-[8px] align-middle">
                                      {getNutrientNameById(component.nutrientId, nameAndIdNutrients)}
                                    </td>
                                    <td className="text-center p-[8px] align-middle">
                                      {component.average ?? (
                                          <div className="flex justify-center">
                                            <Ellipsis size={24} />
                                          </div>
                                      )}
                                    </td>
                                    <td className="text-center p-[8px] align-middle">
                                      {component.deviation ?? (
                                          <div className="flex justify-center">
                                            <Ellipsis size={24} />
                                          </div>
                                      )}
                                    </td>
                                    <td className="text-center p-[8px] align-middle">
                                      {component.min ?? (
                                          <div className="flex justify-center">
                                            <Ellipsis size={24} />
                                          </div>
                                      )}
                                    </td>
                                    <td className="text-center p-[8px] align-middle">
                                      {component.max ?? (
                                          <div className="flex justify-center">
                                            <Ellipsis size={24} />
                                          </div>
                                      )}
                                    </td>
                                    <td className="text-center p-[8px] align-middle">
                                      {component.sampleSize ?? (
                                          <div className="flex justify-center">
                                            <Ellipsis size={24} />
                                          </div>
                                      )}
                                    </td>
                                    <td className="text-center p-[8px] align-middle">
                                      {component.dataType ? (
                                          component.dataType.charAt(0).toUpperCase() +
                                          component.dataType.slice(1)
                                      ) : (
                                          <div className="flex justify-center">
                                            <Ellipsis size={24} />
                                          </div>
                                      )}
                                    </td>
                                    <td className="p-[8px] text-center align-middle">
                                      <button
                                          className="bg-[#6b8e23] hover:bg-[#556b2f] text-[white] py-[4px] px-[12px] rounded-[4px] transition-colors"
                                          onClick={() => startEditing(component)}
                                      >
                                        {t("NewMacronutrient.Edit")}
                                      </button>
                                    </td>
                                  </>
                              )}
                            </tr>
                        ))}

                        <tr className="bg-[#e6f0e6] h-[60px] transition-all duration-200 font-[600]">
                          {editingComponentId === nutrient.nutrientId ? (
                              <>
                                <td className="p-[8px] align-middle">
                                  <div className="text-[14px] font-[600]">
                                    {getNutrientNameById(nutrient.nutrientId, nameAndIdNutrients)}
                                  </div>
                                </td>
                                <td className="p-[4px] text-center relative">
                                  <div className="flex flex-row">
                                    <NumericField
                                        value={formData?.average}
                                        error={isAverageInvalid}
                                        errorMessage=""
                                        onChange={(value) => handleInputChange("average", value)}
                                        allowDecimals={true}
                                        min={0}
                                        fullWidth={true}
                                    />
                                    {isAverageInvalid && (
                                        <ToolTip
                                            content={!isValueDefined("average")
                                                ? "Ingrese el promedio."
                                                : "Promedio debe ser al menos 0."}
                                        >
                                          <AlertCircle className="absolute right-[4px] top-[50%] -translate-y-[50%] h-[16px] w-[16px] text-[#ef4444]" />
                                        </ToolTip>
                                    )}
                                  </div>
                                </td>
                                <td className="p-[4px] text-center relative">
                                  <div className="flex flex-row">
                                    <NumericField
                                        value={formData?.deviation}
                                        error={isDeviationInvalid}
                                        errorMessage=""
                                        onChange={(value) => handleInputChange("deviation", value)}
                                        allowDecimals={true}
                                        min={0}
                                        fullWidth={true}
                                    />
                                    {isDeviationInvalid && (
                                        <ToolTip content="Desviación debe ser al menos 0.">
                                          <AlertCircle className="absolute right-[8px] top-[50%] -translate-y-[50%] h-[16px] w-[16px] text-[#ef4444]"/>
                                        </ToolTip>
                                    )}
                                  </div>
                                </td>
                                <td className="p-[4px] text-center relative">
                                  <div className="flex flex-row">
                                    <NumericField
                                        value={formData?.min}
                                        error={isMinInvalid}
                                        errorMessage=""
                                        onChange={(value) => handleInputChange("min", value)}
                                        allowDecimals={true}
                                        min={0}
                                        className="w-full"
                                    />
                                    {isMinInvalid && (
                                        <ToolTip content="Mínimo debe ser al menos 0.">
                                          <AlertCircle className="absolute right-[8px] top-[50%] -translate-y-[50%] h-[16px] w-[16px] text-[#ef4444]"/>
                                        </ToolTip>
                                    )}
                                  </div>
                                </td>
                                <td className="p-[4px] text-center relative">
                                  <div className="flex flex-row">
                                    <NumericField
                                        value={formData?.max}
                                        error={isMaxInvalid}
                                        errorMessage=""
                                        onChange={(value) => handleInputChange("max", value)}
                                        allowDecimals={true}
                                        min={formData?.min ?? 0}
                                        className="w-full"
                                    />
                                    {isMaxInvalid && (
                                        <ToolTip
                                            content={
                                              isValueLessThan("max", 0)
                                                  ? "Máximo debe ser al menos 0."
                                                  : "Máximo debe ser mayor o igual al mínimo"
                                            }
                                        >
                                          <AlertCircle className="absolute right-[8px] top-[50%] -translate-y-[50%] h-[16px] w-[16px] text-[#ef4444]"/>
                                        </ToolTip>
                                    )}
                                  </div>
                                </td>
                                <td className="p-[4px] text-center relative">
                                  <div className="flex flex-row">
                                    <NumericField
                                        value={formData?.sampleSize}
                                        error={isSampleSizeInvalid}
                                        errorMessage=""
                                        onChange={(value) => handleInputChange("sampleSize", value)}
                                        allowDecimals={false}
                                        min={1}
                                        className="w-full"
                                    />
                                    {isSampleSizeInvalid && (
                                        <ToolTip
                                            content={
                                              isValueLessThan("sampleSize", 1)
                                                  ? "Tamaño de muestra debe ser al menos 1."
                                                  : "Tamaño de muestra debe ser un entero."
                                            }
                                        >
                                          <AlertCircle className="absolute right-[8px] top-[50%] -translate-y-[50%] h-[16px] w-[16px] text-[#ef4444]"/>
                                        </ToolTip>
                                    )}
                                  </div>
                                </td>
                                <td className="p-[4px] text-center relative">
                                  <div className="flex flex-row">
                                    <select
                                        value={formData?.dataType || ""}
                                        className={`w-full p-[8px] rounded-[4px] border ${
                                            isDataTypeInvalid
                                                ? "border-[#ef4444]"
                                                : "border-[#d1d5db]"
                                        }`}
                                        onChange={(e) => handleInputChange("dataType", e.target.value)}
                                    >
                                      <option value="">Ninguna</option>
                                      <option value="analytic">
                                        {t("NewMacronutrient.Analytical")}
                                      </option>
                                      <option value="calculated">
                                        {t("NewMacronutrient.Calculated")}
                                      </option>
                                      <option value="assumed">
                                        {t("NewMacronutrient.Taken")}
                                      </option>
                                      <option value="borrowed">
                                        {t("NewMacronutrient.Borrowed")}
                                      </option>
                                    </select>
                                    {isDataTypeInvalid && (
                                        <ToolTip content="Ingrese el tipo de dato.">
                                          <AlertCircle className="absolute right-[8px] top-[50%] -translate-y-[50%] h-[16px] w-[16px] text-[#ef4444]"/>
                                        </ToolTip>
                                    )}
                                  </div>
                                </td>
                                <td className="p-[8px] text-center">
                                  <div className="flex flex-col space-y-[8px] justify-center">
                                    <button
                                        className="bg-[#3cb371] hover:bg-[#2e8b57] text-[white] py-[4px] px-[12px] rounded-[4px] transition-colors w-full"
                                        onClick={saveChanges}
                                    >
                                      {t("NewMacronutrient.save")}
                                    </button>
                                    <button
                                        className="bg-[#cd5c5c] hover:bg-[#b22222] text-[white] py-[4px] px-[12px] rounded-[4px] transition-colors w-full"
                                        onClick={cancelEditing}
                                    >
                                      {t("NewMacronutrient.cancel")}
                                    </button>
                                  </div>
                                </td>
                              </>
                          ) : (
                              <>
                                <td className="p-[8px] align-middle font-[600]">
                                  {getNutrientNameById(nutrient.nutrientId, nameAndIdNutrients)}
                                </td>
                                <td className="text-center p-[8px] align-middle">
                                  {nutrient.average ?? (
                                      <div className="flex justify-center">
                                        <Ellipsis size={24} />
                                      </div>
                                  )}
                                </td>
                                <td className="text-center p-[8px] align-middle">
                                  {nutrient.deviation ?? (
                                      <div className="flex justify-center">
                                        <Ellipsis size={24} />
                                      </div>
                                  )}
                                </td>
                                <td className="text-center p-[8px] align-middle">
                                  {nutrient.min ?? (
                                      <div className="flex justify-center">
                                        <Ellipsis size={24} />
                                      </div>
                                  )}
                                </td>
                                <td className="text-center p-[8px] align-middle">
                                  {nutrient.max ?? (
                                      <div className="flex justify-center">
                                        <Ellipsis size={24} />
                                      </div>
                                  )}
                                </td>
                                <td className="text-center p-[8px] align-middle">
                                  {nutrient.sampleSize ?? (
                                      <div className="flex justify-center">
                                        <Ellipsis size={24} />
                                      </div>
                                  )}
                                </td>
                                <td className="text-center p-[8px] align-middle">
                                  {nutrient.dataType ? (
                                      nutrient.dataType.charAt(0).toUpperCase() +
                                      nutrient.dataType.slice(1)
                                  ) : (
                                      <div className="flex justify-center">
                                        <Ellipsis size={24} />
                                      </div>
                                  )}
                                </td>
                                <td className="p-[8px] text-center align-middle">
                                  <button
                                      className="bg-[#6b8e23] hover:bg-[#556b2f] text-[white] py-[4px] px-[12px] rounded-[4px] transition-colors"
                                      onClick={() => startEditing(nutrient)}
                                  >
                                    {t("NewMacronutrient.Edit")}
                                  </button>
                                </td>
                              </>
                          )}
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
              )}
            </div>
        ))}
      </div>
  );
}
