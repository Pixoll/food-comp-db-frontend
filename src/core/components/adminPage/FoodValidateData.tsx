'use client'
import { BadgeX, CheckCircle, PlusCircle, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  AnyNutrient,
  Commune,
  Group,
  LangualCode,
  Location,
  Province,
  Region,
  ScientificName,
  Subspecies,
  Type,
} from "../../hooks";
import { Collection } from "../../utils/collection";
import makeRequest from "../../utils/makeRequest";
import Pagination from "../../../app/search/components/Pagination";
import CSVFoodDisplay from "./CSVFoodDisplay";
import { CSVFood } from "./DataFromCsv";

enum Flag {
  VALID = 1,
  IS_NEW = 1 << 1,
  UPDATED = 1 << 2,
}

const getIconForFlags = (flags: number) => {
  if (!(flags & Flag.VALID)) {
    return <BadgeX color="red"></BadgeX>;
  }
  if (flags & Flag.IS_NEW) {
    return <PlusCircle color="blue"/>;
  }
  if (flags & Flag.UPDATED) {
    return <RefreshCw color="orange"/>;
  }
  if (flags & Flag.VALID) {
    return <CheckCircle color="green"/>;
  }
  return null;
};
type FoodValidateDataProps = {
  data: CSVFood[];
  nutrientsInfo: Collection<string, AnyNutrient>;
  langualCodesInfo: Collection<string, LangualCode>;
  scientificNamesInfo: Collection<number, ScientificName>;
  subspeciesNamesInfo: Collection<number, Subspecies>;
  typesNamesInfo: Collection<number, Type>;
  groupsNamesInfo: Collection<number, Group>;
  regionsInfo: Collection<number, Region>;
  provincesInfo: Collection<number, Province>;
  communesInfo: Collection<number, Commune>;
  locationsInfo: Collection<number, Location>;
  handleView: (change: boolean) => void;
};

const filterByFlag = (
  references: CSVFood[],
  filterOption: string
): CSVFood[] => {
  switch (filterOption) {
    case "Invalidos":
      return references.filter((ref) => !(ref.flags & Flag.VALID));
    case "Actualizados":
      return references.filter(
        (ref) => ref.flags & Flag.UPDATED && ref.flags & Flag.VALID
      );
    case "Validos":
      return references.filter(
        (ref) => ref.flags & Flag.VALID && !(ref.flags & Flag.UPDATED)
      );
    case "Nuevos":
      return references.filter((ref) => ref.flags & Flag.IS_NEW);
    default:
      return references;
  }
};

function separate(foods: CSVFood[]) {
  const updated: CSVFood[] = [];
  const isNew: CSVFood[] = [];

  for (const food of foods) {
    if (!(food.flags & Flag.VALID)) {
      continue;
    }

    if (food.flags & Flag.UPDATED) {
      updated.push(food);
    }

    if (food.flags & Flag.IS_NEW) {
      isNew.push(food);
    }
  }

  return { updated, isNew };
}

export default function FoodValidateData({
  data,
  nutrientsInfo,
  langualCodesInfo,
  scientificNamesInfo,
  subspeciesNamesInfo,
  typesNamesInfo,
  groupsNamesInfo,
  regionsInfo,
  provincesInfo,
  communesInfo,
  locationsInfo,
  handleView,
}: FoodValidateDataProps) {
  const [view, setView] = useState("list");
  const [selectedFood, setSelectedFood] = useState<CSVFood | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
  const [filteredData, setFilteredData] = useState(data);

  const { t } = useTranslation();
  const { state } = useAuth();
  const { addToast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Mostrar todos");
  const dropdownRef = useRef(null);

  const options = [
    "Mostrar todos",
    "Invalidos",
    "Actualizados",
    "Validos",
    "Nuevos",
  ];

  useEffect(() => {
    setFilteredData(filterByFlag(data, selectedOption));
    setCurrentPage(1);
  }, [data, selectedOption]);

  const submitFoods = async () => {
    const { updated, isNew } = separate(filteredData);

    const newFoods = isNew.map((food) => {
      return {
        commonName: {
          es: food.commonName.es?.parsed ?? food.commonName.es?.old,
          en:
            food.commonName.en?.parsed ?? food.commonName.en?.old ?? undefined,
          pt:
            food.commonName.pt?.parsed ?? food.commonName.pt?.old ?? undefined,
        },
        ingredients: {
          es: food.ingredients.es?.parsed ?? food.ingredients.es?.old,
          en:
            food.ingredients.en?.parsed ??
            food.ingredients.en?.old ??
            undefined,
          pt:
            food.ingredients.pt?.parsed ??
            food.ingredients.pt?.old ??
            undefined,
        },
        scientificNameId:
          food.scientificName?.parsed ?? food.scientificName?.old ?? undefined,
        subspeciesId:
          food.subspecies?.parsed ?? food.subspecies?.old ?? undefined,
        groupId: food.group.parsed ?? food.group.old,
        typeId: food.type.parsed ?? food.type.old,
        brand: food.brand?.parsed ?? food.brand?.old ?? undefined,
        observation: food.observation?.raw,
        originIds: food.origin,
        nutrientMeasurements: food.measurements.map((measurement) => ({
          nutrientId: measurement.nutrientId,
          average:
            measurement.average.parsed ?? measurement.average.old ?? undefined,
          deviation:
            measurement.deviation?.parsed ??
            measurement.deviation?.old ??
            undefined,
          min: measurement.min?.parsed ?? measurement.min?.old ?? undefined,
          max: measurement.max?.parsed ?? measurement.max?.old ?? undefined,
          sampleSize:
            measurement.sampleSize?.parsed ??
            measurement.sampleSize?.old ??
            undefined,
          dataType:
            measurement.dataType.parsed ??
            measurement.dataType.old ??
            undefined,
          referenceCodes:
            measurement.referenceCodes?.map(
              (referenceCode) => referenceCode.parsed ?? referenceCode.old
            ) ?? undefined,
        })),
        langualCodes: food.langualCodes.map(
          (langualCode) => langualCode.parsed ?? langualCode.old
        ),
        code: food.code.parsed ?? food.code.old,
      };
    });

    const updatedFoods = updated.map((food) => {
      return {
        commonName: {
          es:
            food.commonName.es?.parsed ?? food.commonName.es?.old ?? undefined,
          en:
            food.commonName.en?.parsed ?? food.commonName.en?.old ?? undefined,
          pt:
            food.commonName.pt?.parsed ?? food.commonName.pt?.old ?? undefined,
        },
        ingredients: {
          es:
            food.ingredients.es?.parsed ??
            food.ingredients.es?.old ??
            undefined,
          en:
            food.ingredients.en?.parsed ??
            food.ingredients.en?.old ??
            undefined,
          pt:
            food.ingredients.pt?.parsed ??
            food.ingredients.pt?.old ??
            undefined,
        },
        scientificNameId:
          food.scientificName?.parsed ?? food.scientificName?.old ?? undefined,
        subspeciesId:
          food.subspecies?.parsed ?? food.subspecies?.old ?? undefined,
        groupId: food.group.parsed ?? food.group.old ?? undefined,
        typeId: food.type.parsed ?? food.type.old ?? undefined,
        brand: food.brand?.parsed ?? food.brand?.old ?? undefined,
        observation: food.observation?.raw,
        originIds: food.origin,
        nutrientMeasurements: food.measurements.map((measurement) => ({
          nutrientId: measurement.nutrientId,
          average:
            measurement.average.parsed ?? measurement.average.old ?? undefined,
          deviation:
            measurement.deviation?.parsed ??
            measurement.deviation?.old ??
            undefined,
          min: measurement.min?.parsed ?? measurement.min?.old ?? undefined,
          max: measurement.max?.parsed ?? measurement.max?.old ?? undefined,
          sampleSize:
            measurement.sampleSize?.parsed ??
            measurement.sampleSize?.old ??
            undefined,
          dataType:
            measurement.dataType.parsed ??
            measurement.dataType.old ??
            undefined,
          referenceCodes:
            measurement.referenceCodes?.map(
              (referenceCode) => referenceCode.parsed ?? referenceCode.old
            ) ?? undefined,
        })),
        langualCodes: food.langualCodes.map(
          (langualCode) => langualCode.parsed ?? langualCode.old ?? undefined
        ),
        code: food.code.parsed ?? food.code.old ?? undefined,
      };
    });

    if (updatedFoods.length > 0) {
      let successCount = 0;
      let failureCount = 0;
      for (const food of updatedFoods) {
        await makeRequest("patch", `/foods/${food.code}`, {
          token: state.token,
          payload: food,
          successCallback: () => {
            successCount++;
          },
          errorCallback: (error) => {
            console.log(
              error.response?.data?.message ?? error.message ?? "Error"
            );
            failureCount++;
          }
        });

        if (successCount > 0) {
          addToast({
            message: `Alimentos actualizados: ${successCount}`,
            type: "Success",
          });
        } else {
          addToast({
            message: "No se han actualizado alimentos",
            type: "Light",
          });
        }

        if (failureCount > 0) {
          addToast({
            message: `Alimentos no actualizados: ${failureCount}`,
            type: "Danger",
          });
        }
      }
    } else {
      addToast({
        message: "No existen alimentos actualizados",
        type: "Light",
      });
    }

    if (newFoods.length > 0) {
      makeRequest("post", "/foods", {
        token: state.token,
        payload: {
          foods: newFoods,
        },
        successCallback: () => {
          addToast({
            message: "Los alimentos se han enviado correctamente",
            title: "Éxito",
            type: "Success",
          });
          handleView(false);
        },
        errorCallback: (error) => {
          addToast({
            message: error.response?.data?.message ?? error.message ?? "Error",
            title: "Fallo",
            type: "Danger",
          });
        }
      });
    } else {
      addToast({
        message: "No existen alimentos nuevos",
        type: "Light",
      });
    }
  };

  const npage = Math.ceil(filteredData.length / recordsPerPage);
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredData.slice(firstIndex, lastIndex);

  const changePage = (page: number) => {
    if (page >= 1 && page <= npage) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="food-list">
      {view === "list" && (
        <Container>
          <h4>Mostrar </h4>
          <div className="dropdown-wrapper" ref={dropdownRef}>
            <div className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
              <span id="selected-option">{selectedOption}</span>
              <span>
                <i
                  className={`fa-solid fa-caret-down ${
                    isOpen ? "fa-rotate-180" : ""
                  }`}
                ></i>
              </span>
            </div>
            <div className={`dropdown-menu ${isOpen ? "active" : ""}`}>
              {options.map((option, index) => (
                <div
                  key={index}
                  className={`order-item ${
                    selectedOption === option ? "selected" : ""
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
          <h2>{t("FoodTableAdmin.List")}</h2>
          {filteredData.length === 0 ? (
            <p>{t("FoodTableAdmin.available")}s</p>
          ) : (
            <>
              <table className="content-table-foods">
                <thead>
                <tr>
                  <th>Estado</th>
                  <th>{t("FoodTableAdmin.Name")}</th>
                  <th>{t("FoodTableAdmin.Actions")}</th>
                </tr>
                </thead>
                <tbody>
                {records.map((item, index) => (
                  <tr key={index}>
                    <td>{getIconForFlags(item.flags)}</td>
                    <td>
                      {item.commonName.en?.parsed ||
                        item.commonName.en?.raw ||
                        "N/A"}
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setSelectedFood(item);
                          setView("verificar");
                        }}
                      >
                        {t("FoodTableAdmin.Check")}
                      </button>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
              {npage > 1 && (
                <Pagination
                  currentPage={currentPage}
                  npage={npage}
                  onPageChange={changePage}
                />
              )}
            </>
          )}
        </Container>
      )}
      {view === "verificar" && (
        <div className="verification-view">
          <h2>{t("FoodTableAdmin.Check")}</h2>
          {selectedFood && (
            <div className="food-details">
              <CSVFoodDisplay
                food={selectedFood}
                nutrientsInfo={nutrientsInfo}
                langualCodesInfo={langualCodesInfo}
                groupsNamesInfo={groupsNamesInfo}
                typesNamesInfo={typesNamesInfo}
                scientificNamesInfo={scientificNamesInfo}
                subspeciesNamesInfo={subspeciesNamesInfo}
              />
            </div>
          )}
          <button
            className="button"
            onClick={() => {
              setView("list");
              setSelectedFood(null);
            }}
          >
            {t("FoodTableAdmin.Back")}
          </button>
        </div>
      )}
      <Container>
        <button className="button-form-of-food" onClick={submitFoods}>
          Enviar
        </button>
      </Container>
    </div>
  );
}
