import React, { useState } from 'react';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { NutrientsValue, NutrientMeasurement, NutrientMeasurementWithComponents } from '@/types/SingleFoodResult';
import { GetFoodMeasurementsResult } from "@/app/compare/page"

type NutrientComparisonTableProps = {
  foodsData: GetFoodMeasurementsResult[];
  onRemoveFood: (codes: string[]) => void;
};

export default function NutrientComparisonTable({ foodsData, onRemoveFood }: NutrientComparisonTableProps) {
  const [expandedSections, setExpandedSections] = useState({
    energy: true,
    macronutrients: true,
    micronutrients: true,
    vitamins: true,
    minerals: true
  });

  const [expandedNutrients, setExpandedNutrients] = useState<Record<string, boolean>>({});

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleNutrient = (nutrientId: number) => {
    setExpandedNutrients(prev => ({
      ...prev,
      [nutrientId]: !prev[nutrientId]
    }));
  };

  const getFoodName = (commonName: { es: string } | string) => {
    if (typeof commonName === 'object' && commonName.es) {
      return commonName.es;
    }
    return commonName as string;
  };

  const renderNutrientRow = (
      nutrient: NutrientMeasurement,
      indentLevel: number = 0,
      isComponent: boolean = false
  ) => {
    const paddingClasses = ['pl-[4px]', 'pl-[36px]'];
    const paddingClass = indentLevel < paddingClasses.length ? paddingClasses[indentLevel] : paddingClasses[1];

    return (
        <tr key={`${nutrient.nutrientId}-${indentLevel}`} className="hover:bg-[#f0fdf4] transition-colors duration-[200ms]">
          <td className={`${paddingClass} bg-[white] relative`}>
            {indentLevel >= 1 && (
                <div className="absolute left-[20px] top-[0px] bottom-[0px] w-[3px] bg-[#047857]"></div>
            )}
            <span className="relative">{nutrient.name}</span>
            {nutrient.dataType && (
                <span
                    className={`inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-[10px] ml-[8px] text-[white] font-[700] bg-[${
                        nutrient.dataType === 'calculated' ? '#6366f1' :
                            nutrient.dataType === 'borrowed' ? '#10b981' :
                                '#f59e0b'
                    }]`}
                    title={nutrient.dataType}
                >
              {nutrient.dataType.charAt(0)}
            </span>
            )}
          </td>
          <td className="text-center align-middle bg-[white]">{nutrient.measurementUnit}</td>

          {foodsData.map(food => (
              <td
                  key={`${food.code}-${nutrient.nutrientId}`}
                  className="text-center align-middle bg-[white]"
              >
                {getNutrientValue(food.nutrientMeasurements, nutrient.nutrientId)}
              </td>
          ))}
        </tr>
    );
  };

  const getNutrientValue = (nutrientMeasurements: NutrientsValue, nutrientId: number): string => {
    if (nutrientMeasurements?.energy) {
      const energyNutrient = nutrientMeasurements.energy.find(n => n.nutrientId === nutrientId);
      if (energyNutrient) {
        return energyNutrient.average?.toString() || '-';
      }
    }

    if (nutrientMeasurements?.macronutrients) {
      const macroNutrient = nutrientMeasurements.macronutrients.find(n => n.nutrientId === nutrientId);
      if (macroNutrient) {
        return macroNutrient.average?.toString() || '-';
      }

      for (const macro of nutrientMeasurements.macronutrients) {
        if (macro.components) {
          const component = macro.components.find(c => c.nutrientId === nutrientId);
          if (component) {
            return component.average?.toString() || '-';
          }
        }
      }
    }

    if (nutrientMeasurements?.micronutrients) {
      if (nutrientMeasurements.micronutrients.vitamins) {
        const vitamin = nutrientMeasurements.micronutrients.vitamins.find(n => n.nutrientId === nutrientId);
        if (vitamin) {
          return vitamin.average?.toString() || '-';
        }
      }

      if (nutrientMeasurements.micronutrients.minerals) {
        const mineral = nutrientMeasurements.micronutrients.minerals.find(n => n.nutrientId === nutrientId);
        if (mineral) {
          return mineral.average?.toString() || '-';
        }
      }
    }

    return '-';
  };

  const renderExpandableNutrient = (nutrient: NutrientMeasurementWithComponents, indentLevel: number = 0) => {
    const isExpanded = expandedNutrients[nutrient.nutrientId] || false;
    const hasComponents = nutrient.components && nutrient.components.length > 0;

    const paddingClasses = ['pl-[4px]', 'pl-[36px]'];
    const paddingClass = indentLevel < paddingClasses.length ? paddingClasses[indentLevel] : paddingClasses[1];

    return (
        <React.Fragment key={`${nutrient.nutrientId}-expandable`}>
          <tr className="hover:bg-[#f0fdf4] transition-colors duration-[200ms]">
            <td
                className={`${paddingClass} bg-[white] relative ${hasComponents ? 'cursor-pointer' : ''}`}
                onClick={() => hasComponents && toggleNutrient(nutrient.nutrientId)}
            >
              {indentLevel >= 1 && (
                  <div className="absolute left-[20px] top-[0px] bottom-[0px] w-[4px] bg-[#047857]"></div>
              )}
              <span className="relative">
              {hasComponents && (
                  isExpanded ?
                      <ChevronDown size={16} className="inline mr-[8px]"/> :
                      <ChevronRight size={16} className="inline mr-[8px]"/>
              )}
                {nutrient.name}
            </span>
              {nutrient.dataType && (
                  <span
                      className={`inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-[10px] ml-[8px] text-[white] font-[700] bg-[${
                          nutrient.dataType === 'calculated' ? '#6366f1' :
                              nutrient.dataType === 'borrowed' ? '#10b981' :
                                  '#f59e0b'
                      }]`}
                      title={nutrient.dataType}
                  >
                {nutrient.dataType.charAt(0)}
              </span>
              )}
            </td>
            <td className="text-center align-middle bg-[white]">{nutrient.measurementUnit}</td>

            {foodsData.map(food => (
                <td
                    key={`${food.code}-${nutrient.nutrientId}`}
                    className="text-center align-middle bg-[white]"
                >
                  {getNutrientValue(food.nutrientMeasurements, nutrient.nutrientId)}
                </td>
            ))}
          </tr>

          {isExpanded && hasComponents && nutrient.components.map(comp =>
              renderNutrientRow(comp, indentLevel + 1, true)
          )}
        </React.Fragment>
    );
  };

  return (
      <div className="m-[12px] w-full overflow-x-auto my-[20px]">
        <table className="w-full min-w-[600px] border-collapse rounded-[8px] overflow-hidden">
          <thead>
          <tr>
            <th className="sticky top-0 bg-[#f7fef7] z-10 align-middle py-[12px] pl-[36px] text-left min-w-[200px] font-[600] text-[#064e3b] border-b-[2px] border-[#047857]">
              Nutrientes
            </th>
            <th className="sticky top-0 bg-[#f7fef7] z-10 align-middle py-[12px] px-[16px] text-center w-[80px] font-[600] text-[#064e3b] border-b-[2px] border-[#047857]">
              Unidad
            </th>

            {foodsData.map(food => (
                <th key={food.code} className="sticky top-0 bg-[#f7fef7] z-10 align-middle py-[12px] px-[16px] text-center min-w-[150px] font-[600] text-[#064e3b] border-b-[2px] border-[#047857]">
                  <div className="flex justify-between items-center">
                    <span>{getFoodName(food.commonName.es || "")}</span>
                    <button
                        className="p-[3px] leading-none rounded-full text-[#991b1b] bg-[#fee2e2] hover:bg-[#fecaca] hover:text-[#7f1d1d] transition-colors duration-200"
                        onClick={() => onRemoveFood([food.code])}
                        aria-label={`Remove ${getFoodName(food.commonName.es || "")}`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </th>
            ))}
          </tr>
          </thead>

          <tbody className="divide-y divide-[#e5f1eb]">
          <tr>
            <td
                colSpan={2 + foodsData.length}
                className="text-[#047857] font-[600] cursor-pointer py-[12px] px-[16px] pl-[36px] bg-[white] transition-colors relative"
                onClick={() => toggleSection('energy')}
            >
              <div className="absolute left-[0px] top-[0px] bottom-[0px] w-[3px] bg-[#047857]"></div>
              {expandedSections.energy ?
                  <ChevronDown size={16} className="inline mr-[8px]"/> :
                  <ChevronRight size={16} className="inline mr-[8px]"/>
              }
              Valor energético
            </td>
          </tr>

          {expandedSections.energy && foodsData[0]?.nutrientMeasurements?.energy?.map(nutrient =>
              renderNutrientRow(nutrient)
          )}

          <tr>
            <td
                colSpan={2 + foodsData.length}
                className="text-[#047857] font-[600] cursor-pointer py-[12px] px-[16px] pl-[36px] bg-[white] transition-colors relative"
                onClick={() => toggleSection('macronutrients')}
            >
              <div className="absolute left-[0px] top-[0px] bottom-[0px] w-[3px] bg-[#047857]"></div>
              {expandedSections.macronutrients ?
                  <ChevronDown size={16} className="inline mr-[8px]"/> :
                  <ChevronRight size={16} className="inline mr-[8px]"/>
              }
              Nutrientes principales
            </td>
          </tr>

          {expandedSections.macronutrients && foodsData[0]?.nutrientMeasurements?.macronutrients?.map(nutrient =>
              renderExpandableNutrient(nutrient)
          )}

          <tr>
            <td
                colSpan={2 + foodsData.length}
                className="text-[#047857] font-[600] cursor-pointer py-[12px] px-[16px] pl-[36px] bg-[white] transition-colors relative"
                onClick={() => toggleSection('micronutrients')}
            >
              <div className="absolute left-[0px] top-[0px] bottom-[0px] w-[3px] bg-[#047857]"></div>
              {expandedSections.micronutrients ?
                  <ChevronDown size={16} className="inline mr-[8px]"/> :
                  <ChevronRight size={16} className="inline mr-[8px]"/>
              }
              Micronutrientes
            </td>
          </tr>

          {expandedSections.micronutrients && (
              <>
                <tr>
                  <td
                      colSpan={2 + foodsData.length}
                      className="text-[#047857] font-[600] cursor-pointer py-[12px] px-[16px] pl-[36px] bg-[white] transition-colors relative"
                      onClick={() => toggleSection('vitamins')}
                  >
                    <div className="absolute left-[0px] top-[0px] bottom-[0px] w-[3px] bg-[#047857]"></div>
                    <span className="relative">
                    {expandedSections.vitamins ?
                        <ChevronDown size={16} className="inline mr-[8px]"/> :
                        <ChevronRight size={16} className="inline mr-[8px]"/>
                    }
                      Vitaminas
                  </span>
                  </td>
                </tr>

                {expandedSections.vitamins && foodsData[0]?.nutrientMeasurements?.micronutrients?.vitamins?.map(nutrient =>
                    renderNutrientRow(nutrient, 1)
                )}

                <tr>
                  <td
                      colSpan={2 + foodsData.length}
                      className="text-[#047857] font-[600] cursor-pointer py-[12px] px-[16px] pl-[36px] bg-[white] transition-colors relative"
                      onClick={() => toggleSection('minerals')}
                  >
                    <div className="absolute left-[0px] top-[0px] bottom-[0px] w-[3px] bg-[#047857]"></div>
                    <span className="relative">
                    {expandedSections.minerals ?
                        <ChevronDown size={16} className="inline mr-[8px]"/> :
                        <ChevronRight size={16} className="inline mr-[8px]"/>
                    }
                      Minerales
                  </span>
                  </td>
                </tr>

                {expandedSections.minerals && foodsData[0]?.nutrientMeasurements?.micronutrients?.minerals?.map(nutrient =>
                    renderNutrientRow(nutrient, 1)
                )}
              </>
          )}
          </tbody>
        </table>
      </div>
  );
}
