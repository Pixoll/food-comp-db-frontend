import React, {useState} from 'react';
import {ChevronDown, ChevronRight, Edit} from 'lucide-react';
import {
    NutrientsValue,
    NutrientMeasurement,
    NutrientMeasurementWithComponents
} from '../../../core/types/SingleFoodResult';
import Modal from "../../components/Modal/Modal";
import NumericField from "../../components/NumericField";

type ModifyCompositionDropdownProps = {
    nutrientData: NutrientsValue;
    formState: {
        nutrientMeasurements: Array<{
            nutrientId: number;
            average?: number;
            deviation?: number;
            min?: number;
            max?: number;
            sampleSize?: number;
            dataType: "analytic" | "calculated" | "assumed" | "borrowed";
            referencesCodes?: number[];
        }>;
    };
    onUpdateFormState: (newFormState: any) => void;
    isEditable?: boolean;
};

export default function ModifyCompositionDropdown({
                                                      nutrientData,
                                                      formState,
                                                      onUpdateFormState
                                                  }: ModifyCompositionDropdownProps) {
    const [expandedSections, setExpandedSections] = useState({
        energy: true,
        macronutrients: true,
        micronutrients: true,
        vitamins: true,
        minerals: true
    });

    const [expandedNutrients, setExpandedNutrients] = useState<Record<string, boolean>>({});
    const [modalData, setModalData] = useState<{
        nutrientId: number;
        average?: number;
        deviation?: number;
        min?: number;
        max?: number;
        sampleSize?: number;
        standardized: boolean;
        dataType: "analytic" | "calculated" | "assumed" | "borrowed";
        note?: string;
        referenceCodes?: number[]
    } | null>(null);

    const openNutrientModal = (nutrient: NutrientMeasurement) => {
        const nutrientFormData = formState.nutrientMeasurements.find(
            n => n.nutrientId === nutrient.nutrientId
        );

        setModalData({
            nutrientId: nutrient.nutrientId,
            average: nutrientFormData?.average ?? nutrient.average,
            deviation: nutrientFormData?.deviation ?? nutrient.deviation,
            min: nutrientFormData?.min ?? nutrient.min,
            max: nutrientFormData?.max ?? nutrient.max,
            sampleSize: nutrientFormData?.sampleSize ?? nutrient.sampleSize,
            standardized: nutrient.standardized,
            dataType: nutrientFormData?.dataType ?? nutrient.dataType,
            note: nutrient.note,
            referenceCodes: nutrientFormData?.referencesCodes ?? nutrient.referenceCodes ?? []
        });
    };

    const closeModal = () => {
        setModalData(null);
    };

    const saveModalData = () => {
        if (!modalData) return;

        const updatedMeasurements = [...formState.nutrientMeasurements];
        const existingIndex = updatedMeasurements.findIndex(
            n => n.nutrientId === modalData.nutrientId
        );

        const measurementData = {
            nutrientId: modalData.nutrientId,
            average: modalData.average,
            deviation: modalData.deviation,
            min: modalData.min,
            max: modalData.max,
            sampleSize: modalData.sampleSize,
            dataType: modalData.dataType,
            referencesCodes: modalData.referenceCodes
        };

        if (existingIndex >= 0) {
            updatedMeasurements[existingIndex] = measurementData;
        } else {
            updatedMeasurements.push(measurementData);
        }

        onUpdateFormState({
            ...formState,
            nutrientMeasurements: updatedMeasurements
        });

        closeModal();
    };

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


    const renderNutrientRow = (
        nutrient: NutrientMeasurement,
        indentLevel: number = 0
    ) => {
        const paddingClasses = ['pl-[4px]', 'pl-[36px]'];
        const paddingClass = indentLevel < paddingClasses.length ? paddingClasses[indentLevel] : paddingClasses[1];

        return (
            <tr key={`${nutrient.nutrientId}-${indentLevel}`}>
                <td className={`${paddingClass} bg-[white] relative`}>
                    {indentLevel >= 1 && (
                        <div className="absolute left-[20px] top-[0px] bottom-[0px] w-[3px] bg-[#047857]"></div>
                    )}
                    <span className="relative">{nutrient.name}</span>
                </td>
                <td className="text-center align-middle bg-[white]">
                    {nutrient.measurementUnit}
                </td>
                <td className="text-center align-middle bg-[white]">
                    <button
                        className="text-[#047857] hover:text-[#065f46] rounded-[50%] border-none focus:outline-none"
                        onClick={() => openNutrientModal(nutrient)}
                    >
                        <Edit size={22}/>
                    </button>
                </td>
            </tr>
        );
    };

    const renderExpandableNutrient = (nutrient: NutrientMeasurementWithComponents, indentLevel: number = 0) => {
        const isExpanded = expandedNutrients[nutrient.nutrientId] || false;
        const hasComponents = nutrient.components && nutrient.components.length > 0;

        const paddingClasses = ['pl-[4px]', 'pl-[36px]'];
        const paddingClass = indentLevel < paddingClasses.length ? paddingClasses[indentLevel] : paddingClasses[1];

        return (
            <React.Fragment key={`${nutrient.nutrientId}-expandable`}>
                <tr>
                    <td className={`${paddingClass} bg-[white] relative ${hasComponents ? 'cursor-pointer' : ''}`}
                        onClick={() => hasComponents && toggleNutrient(nutrient.nutrientId)}>
                        {indentLevel >= 1 && (
                            <div className="absolute left-[20px] top-[0px] bottom-[0px] w-[3px] bg-[#047857]"></div>
                        )}
                        <span className="relative">
                            {hasComponents && (
                                isExpanded ?
                                    <ChevronDown size={16} className="inline mr-[8px]"/> :
                                    <ChevronRight size={16} className="inline mr-[8px]"/>
                            )}
                            {nutrient.name}
                        </span>
                    </td>
                    <td className="text-center align-middle bg-[white]">
                        {nutrient.measurementUnit}
                    </td>
                    <td className="text-center align-middle bg-[white]">
                        <button
                            className="text-[#047857] hover:text-[#065f46] rounded-[50%] border-none focus:outline-none"
                            onClick={() => openNutrientModal(nutrient)}
                        >
                            <Edit size={22}/>
                        </button>
                    </td>
                </tr>

                {isExpanded && hasComponents && nutrient.components.map(comp =>
                    renderNutrientRow(comp, indentLevel + 1)
                )}
            </React.Fragment>
        );
    };

    return (
        <div className="w-full overflow-x-auto my-[20px]">
            <table className="w-full min-w-[600px] border-collapse rounded-[8px] overflow-hidden">
                <thead>
                <tr>
                    <th className="sticky top-0 bg-[#f7fef7] z-10 align-middle py-[12px] pl-[36px] text-left min-w-[200px] font-[600] text-[#064e3b] border-b-[2px] border-[#047857]">
                        Nutrientes
                    </th>
                    <th className="sticky top-0 bg-[#f7fef7] z-10 align-middle py-[12px] px-[16px] text-center w-[80px] font-[600] text-[#064e3b] border-b-[2px] border-[#047857]">
                        Unidad
                    </th>
                    <th className="sticky top-0 bg-[#f7fef7] z-10 align-middle py-[12px] px-[16px] text-center min-w-[150px] font-[600] text-[#064e3b] border-b-[2px] border-[#047857]">
                        Información
                    </th>
                </tr>
                </thead>

                <tbody className="divide-y divide-[#e5f1eb]">
                <tr>
                    <td
                        colSpan={3}
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

                {expandedSections.energy && nutrientData?.energy?.map(nutrient =>
                    renderNutrientRow(nutrient)
                )}

                <tr>
                    <td
                        colSpan={3}
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

                {expandedSections.macronutrients && nutrientData.macronutrients?.map(nutrient =>
                    renderExpandableNutrient(nutrient)
                )}

                <tr>
                    <td
                        colSpan={3}
                        className="text-[#047857] font-[600] cursor-pointer py-[12px] px-[16px] bg-[white] transition-colors relative"
                        onClick={() => toggleSection('micronutrients')}
                    >
                        <div className="absolute left-[0px] top-[0px] bottom-[0px] w-[2px] bg-[#047857]"></div>
                        <span className="relative">
                            {expandedSections.micronutrients ?
                                <ChevronDown size={16} className="inline mr-[8px]"/> :
                                <ChevronRight size={16} className="inline mr-[8px]"/>
                            }
                            Micronutrientes
                        </span>
                    </td>
                </tr>

                {expandedSections.micronutrients && (
                    <>
                        <tr>
                            <td
                                colSpan={3}
                                className="text-[#047857] font-[600] cursor-pointer py-[12px] px-[16px] pl-[36px] bg-[white] transition-colors relative"
                                onClick={() => toggleSection('vitamins')}
                            >
                                <span className="relative">
                                    {expandedSections.vitamins ?
                                        <ChevronDown size={16} className="inline mr-[8px]"/> :
                                        <ChevronRight size={16} className="inline mr-[8px]"/>
                                    }
                                    Vitaminas
                                </span>
                            </td>
                        </tr>

                        {expandedSections.vitamins && nutrientData.micronutrients?.vitamins?.map(nutrient =>
                            renderNutrientRow(nutrient, 1)
                        )}

                        <tr>
                            <td
                                colSpan={3}
                                className="text-[#047857] font-[600] cursor-pointer py-[12px] px-[16px] pl-[36px] bg-[white] transition-colors relative"
                                onClick={() => toggleSection('minerals')}
                            >
                                <span className="relative">
                                    {expandedSections.minerals ?
                                        <ChevronDown size={16} className="inline mr-[8px]"/> :
                                        <ChevronRight size={16} className="inline mr-[8px]"/>
                                    }
                                    Minerales
                                </span>
                            </td>
                        </tr>

                        {expandedSections.minerals && nutrientData?.micronutrients?.minerals?.map(nutrient =>
                            renderNutrientRow(nutrient, 1)
                        )}
                    </>
                )}
                </tbody>
            </table>
            {modalData && (
                <Modal
                    width={800}
                    height={400}
                    header={"Información adicional"}
                    onClose={closeModal}
                >
                    <div className="w-[100%] p-[16px]">
                        <div className="grid grid-cols-2 gap-[16px] mb-[16px]">
                            <NumericField
                                label="Promedio"
                                value={modalData.average}
                                onChange={(value) => setModalData({...modalData, average: value})}
                                allowDecimals={true}
                            />

                            <NumericField
                                label="Desviación"
                                value={modalData.deviation}
                                onChange={(value) => setModalData({...modalData, deviation: value})}
                                allowDecimals={true}
                            />

                            <NumericField
                                label="Mínimo"
                                value={modalData.min}
                                max={modalData.max}
                                onChange={(value) => setModalData({...modalData, min: value})}
                                allowDecimals={true}
                            />

                            <NumericField
                                label="Máximo"
                                value={modalData.max}
                                min={modalData.min}
                                onChange={(value) => setModalData({...modalData, max: value})}
                                allowDecimals={true}
                            />

                            <NumericField
                                label="Tamaño de muestra"
                                value={modalData.sampleSize}
                                onChange={(value) => setModalData({...modalData, sampleSize: value})}
                                allowDecimals={false}
                            />
                            <div className="flex flex-col">
                                <label className="text-[14px] font-[500] mb-[4px]">Tipo de dato</label>
                                <select
                                    className="px-[12px] py-[8px] rounded-[6px] border border-[#d1d5db]"
                                    value={modalData.dataType}
                                    onChange={(e) => setModalData({...modalData, dataType: e.target.value as any})}
                                >
                                    <option value="analytic">Analítico</option>
                                    <option value="calculated">Calculado</option>
                                    <option value="assumed">Asumido</option>
                                    <option value="borrowed">Prestado</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end mt-[16px]">
                            <button
                                className="px-[16px] py-[8px] bg-[#047857] text-white rounded-[4px] hover:bg-[#065f46]"
                                onClick={saveModalData}
                            >
                                Guardar cambios
                            </button>
                            <button
                                className="px-[16px] py-[8px] ml-[8px] bg-[#f3f4f6] text-[#374151] rounded-[4px] hover:bg-[#e5e7eb]"
                                onClick={closeModal}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
