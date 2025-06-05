'use client'

import qs from "qs";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useFetch ,FetchStatus } from "@/hooks";
import { City, Author, Journal } from "@/hooks";
import { SearchBox } from "@/app/search/components";
import { Collection } from "@/utils/collection";
import {
  getNutrientNameById,
  NutrientMeasurementForm,
  NutrientMeasurementWithComponentsForm,
  NutrientSummary,
} from "@/types/nutrients";
import { Reference } from "@/hooks";
import Pagination from "@/app/search/components/Pagination";
import ModalReferences from "@/app/admin-page/add-food/components/ModalReferences";

type NutrientsValueForm = {
  energy: NutrientMeasurementForm[];
  mainNutrients: NutrientMeasurementWithComponentsForm[];
  micronutrients: {
    vitamins: NutrientMeasurementForm[];
    minerals: NutrientMeasurementForm[];
  };
};

type NewReferencesProps = {
  references: Reference[];
  nutrientValueForm: NutrientsValueForm;
  nameAndIdNutrients: NutrientSummary[];
  onSelectReferenceForNutrients: (updatedForm: NutrientsValueForm) => void;
  cities: City[];
  authors: Author[];
  journals: Journal[];
};

type NutrientConvert = {
  id: number;
  name: string;
  selected: boolean;
};

const ITEMS_PER_PAGE = 5;

const hasValidData = <T extends NutrientMeasurementForm>(
  nutrient: T
  // @ts-expect-error
): nutrient is Omit<T, "average" | "dataType"> &
  Required<Pick<T, "average" | "dataType">> => {
  return (
    typeof nutrient.average !== "undefined" &&
    typeof nutrient.dataType !== "undefined"
  );
};
type Filters = {
  nameTittle: string;
  citiesFilter: Set<string>;
  authorsFilter: Set<string>;
  journalsFilter: Set<string>;
};

export default function AddReferences({
  nutrientValueForm,
  nameAndIdNutrients,
  onSelectReferenceForNutrients,
  cities,
  authors,
  journals,
}: NewReferencesProps) {
  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    nameTittle: "",
    citiesFilter: new Set(),
    authorsFilter: new Set(),
    journalsFilter: new Set(),
  });


  const filters = {
    title: selectedFilters.nameTittle,
    author: Array.from(selectedFilters.authorsFilter),
    journal: Array.from(selectedFilters.journalsFilter),
    city: Array.from(selectedFilters.citiesFilter),
  };

  const queryString = qs.stringify(filters, {
    arrayFormat: "repeat",
    skipNulls: true,
  });
  
  const referencesResult = useFetch<Reference[]>(`/references?${queryString}`);
  const filteredReferences  = referencesResult.status === FetchStatus.Success ? referencesResult.data : [];

  const handleFilterChange = (
    filterKey: keyof typeof selectedFilters,
    values: string[]
  ) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: new Set(values),
    }));
    setCurrentPage(1)
  };

  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = filteredReferences.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentReferences = filteredReferences.slice(startIndex, endIndex);

  const [modalsState, setModalsState] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [selectedReferenceIndex, setSelectedReferenceIndex] = useState<
    number | null
  >(null);

  const convert = (): NutrientConvert[] => {
    const nutrientsConvert: NutrientConvert[] = [];

    const isReferenceAssigned = (
      nutrient: NutrientMeasurementForm,
      refCode: number
    ) => {
      return nutrient.referenceCodes?.includes(refCode);
    };

    const addNutrientWithSelection = (
      nutrient: NutrientMeasurementForm,
      refCode: number
    ) => {
      nutrientsConvert.push({
        id: nutrient.nutrientId,
        name: getNutrientNameById(nutrient.nutrientId, nameAndIdNutrients),
        selected: isReferenceAssigned(nutrient, refCode),
      });
    };

    const referenceCode = currentReferences[selectedReferenceIndex!]?.code;

    nutrientValueForm.energy
      .filter(hasValidData)
      .forEach((energy) => addNutrientWithSelection(energy, referenceCode));

    nutrientValueForm.mainNutrients
      .filter(hasValidData)
      .forEach((mainNutrient) => {
        addNutrientWithSelection(mainNutrient, referenceCode);

        if (mainNutrient.components) {
          mainNutrient.components
            .filter(hasValidData)
            .forEach((component) =>
              addNutrientWithSelection(component, referenceCode)
            );
        }
      });

    nutrientValueForm.micronutrients.minerals
      .filter(hasValidData)
      .forEach((mineral) => addNutrientWithSelection(mineral, referenceCode));

    nutrientValueForm.micronutrients.vitamins
      .filter(hasValidData)
      .forEach((vitamin) => addNutrientWithSelection(vitamin, referenceCode));

    return nutrientsConvert;
  };

  const handleShowModal = (index: number) => {
    const globalIndex = startIndex + index;
    setModalsState((prev) => ({ ...prev, [globalIndex]: true }));
    setSelectedReferenceIndex(globalIndex);
  };

  const handleHideModal = (index: number) => {
    const globalIndex = startIndex + index; // Índice global
    setModalsState((prev) => ({ ...prev, [globalIndex]: false }));
  };

  const handleAddReference = (ids: number[], reference: number) => {
    if (selectedReferenceIndex !== null) {
      const referenceCode = reference;
      const updatedForm = { ...nutrientValueForm };

      const updateNutrientReferences = (
        nutrientsArray: (
          | NutrientMeasurementForm
          | NutrientMeasurementWithComponentsForm
        )[]
      ) => {
        nutrientsArray.forEach((nutrient) => {
          if (ids.includes(nutrient.nutrientId)) {
            nutrient.referenceCodes = nutrient.referenceCodes || [];
            if (!nutrient.referenceCodes.includes(referenceCode)) {
              nutrient.referenceCodes.push(referenceCode);
            }
          } else if (nutrient.referenceCodes) {
            nutrient.referenceCodes = nutrient.referenceCodes.filter(
              (code) => code !== referenceCode
            );
          }

          if ("components" in nutrient) {
            const components = nutrient.components as (
              | NutrientMeasurementForm
              | NutrientMeasurementWithComponentsForm
            )[];
            updateNutrientReferences(components);
          }
        });
      };

      updateNutrientReferences(updatedForm.energy);
      updateNutrientReferences(updatedForm.mainNutrients);
      updateNutrientReferences(updatedForm.micronutrients.minerals);
      updateNutrientReferences(updatedForm.micronutrients.vitamins);

      onSelectReferenceForNutrients(updatedForm);

      setModalsState((prev) => ({ ...prev, [selectedReferenceIndex]: false }));
    }
  };
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return (
      <div className="w-full max-w-[1200px] mx-auto py-[24px] px-[16px]">
        <div className="bg-[white] rounded-[8px] p-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.08)] mb-[32px]">
          <h2 className="text-[22px] font-[700] text-[#064e3b] mb-[20px]">Filtros de búsqueda</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
            <div className="flex flex-col">
              <label className="text-[14px] font-[600] text-[#374151] mb-[8px]">Título</label>
              <input
                  className="w-full h-[42px] px-[12px] rounded-[6px] border-[1px] border-[#d1d5db] bg-[white] text-[#1f2937]
                     focus:outline-none focus:ring-[2px] focus:ring-[#047857] focus:border-[#047857]
                     transition-all duration-[200ms]"
                  type="text"
                  placeholder="Ingrese nombre..."
                  value={selectedFilters.nameTittle}
                  onChange={(e) =>
                      setSelectedFilters((prev) => ({
                        ...prev,
                        nameTittle: e.target.value,
                      }))
                  }
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[14px] font-[600] text-[#374151] mb-[8px]">Ciudad</label>
              <SearchBox
                  filterOptions={
                    new Collection(
                        Array.from(cities.values()).map((city) => [
                          city.id.toString(),
                          city.name,
                        ])
                    )
                  }
                  onChange={(values) => handleFilterChange("citiesFilter", values)}
                  single={false}
                  selectedOptions={Array.from(selectedFilters.citiesFilter)}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[14px] font-[600] text-[#374151] mb-[8px]">Revista</label>
              <SearchBox
                  filterOptions={
                    new Collection(
                        Array.from(journals.values()).map((journal) => [
                          journal.id.toString(),
                          journal.name,
                        ])
                    )
                  }
                  onChange={(values) => handleFilterChange("journalsFilter", values)}
                  single={false}
                  selectedOptions={Array.from(selectedFilters.journalsFilter)}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[14px] font-[600] text-[#374151] mb-[8px]">Autor</label>
              <SearchBox
                  filterOptions={
                    new Collection(
                        Array.from(authors.values()).map((author) => [
                          author.id.toString(),
                          author.name,
                        ])
                    )
                  }
                  onChange={(values) => handleFilterChange("authorsFilter", values)}
                  single={false}
                  selectedOptions={Array.from(selectedFilters.authorsFilter)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-[24px] mb-[32px] overflow-y-auto max-h-[calc(100vh-200px)] pr-[8px]">
          {currentReferences.map((ref, index) => (
              <div
                  key={ref.code}
                  className="rounded-[8px] overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.08)]
                   hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] transition-all duration-[300ms]
                    h-full flex flex-col"
              >
                <div className="flex-grow p-[20px]">
                  <h3 className="text-[18px] font-[700] text-[#064e3b] mb-[12px] line-clamp-2">
                    {ref.title}
                  </h3>

                  <div className="flex items-center mb-[16px]">
              <span className="px-[10px] py-[4px] bg-[#ecfdf5] text-[#047857] rounded-[20px] text-[12px] font-[600] capitalize">
                {ref.type.toLowerCase()}
              </span>
                    {ref.year && (
                        <span className="ml-[12px] text-[14px] text-[#6b7280]">{ref.year}</span>
                    )}
                  </div>

                  <div className="space-y-[8px] text-[14px] text-[#4b5563]">
                    {ref.authors && (
                        <div className="flex">
                          <span className="text-[#374151] font-[600] min-w-[90px]">Autores:</span>
                          <span className="flex-grow">{ref.authors.join(", ")}</span>
                        </div>
                    )}

                    {ref.journalName && (
                        <div className="flex">
                          <span className="text-[#374151] font-[600] min-w-[90px]">Publicación:</span>
                          <span className="flex-grow">{ref.journalName}</span>
                        </div>
                    )}

                    {ref.pageStart && ref.pageEnd && (
                        <div className="flex">
                          <span className="text-[#374151] font-[600] min-w-[90px]">Páginas:</span>
                          <span className="flex-grow">{ref.pageStart} - {ref.pageEnd}</span>
                        </div>
                    )}

                    {ref.city && (
                        <div className="flex">
                          <span className="text-[#374151] font-[600] min-w-[90px]">Ciudad:</span>
                          <span className="flex-grow">{ref.city}</span>
                        </div>
                    )}

                    {ref.other && (
                        <div className="flex">
                          <span className="text-[#374151] font-[600] min-w-[90px]">Info adicional:</span>
                          <span className="flex-grow">{ref.other}</span>
                        </div>
                    )}
                  </div>
                </div>

                <div className="mt-auto">
                  <button
                      className="w-full py-[12px] bg-[#047857] hover:bg-[#065f46] text-[white] font-[600]
                       flex items-center justify-center gap-[8px] transition-colors duration-[200ms]"
                      onClick={() => handleShowModal(index)}
                  >
                    <PlusCircle size={18} />
                    <span>Agregar referencia</span>
                  </button>
                </div>
              </div>
          ))}
        </div>

        {currentReferences.map((ref, index) => (
            <ModalReferences
                key={ref.code}
                nutrients={convert()}
                show={modalsState[startIndex + index] || false}
                onHide={() => handleHideModal(index)}
                onSelectReferenceForNutrients={handleAddReference}
                selectedReference={ref.code}
            />
        ))}

        <div className="mt-[16px]">
          <Pagination
              currentPage={currentPage}
              npage={totalPages}
              onPageChange={handlePageChange}
          />
        </div>
      </div>
  );
}
