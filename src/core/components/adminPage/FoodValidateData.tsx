import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../search/Pagination";
import { BadgeX, CheckCircle, PlusCircle, RefreshCw } from "lucide-react";
import CSVFoodDisplay from "./CSVFoodDisplay";
import { Collection } from "../../utils/collection";
import {
  AnyNutrient,
  LangualCode,
  Group,
  Type,
  ScientificName,
  Subspecies,
} from "../../hooks";
import { CSVFood } from "./FoodsFromCsv";
import { Container } from "react-bootstrap";
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
    return <PlusCircle color="blue" />;
  }
  if (flags & Flag.UPDATED) {
    return <RefreshCw color="orange" />;
  }
  if (flags & Flag.VALID) {
    return <CheckCircle color="green" />;
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
  handleView: (change: boolean) => void;
};

const filterByFlag = (references: CSVFood[], filterOption: string): CSVFood[] => {

  switch (filterOption) {
    case "Invalidos":
      return references.filter(ref => !(ref.flags & Flag.VALID))
    case "Actualizados":
      return references.filter(ref => (ref.flags & Flag.UPDATED) && (ref.flags & Flag.VALID));
    case "Validos":
      return references.filter(ref => ((ref.flags & Flag.VALID) && !(ref.flags & Flag.UPDATED)));
    case "Nuevos":
      return references.filter(ref => (ref.flags & Flag.IS_NEW))
    default:
      return references;
  }
};
export default function FoodValidateData({
  data,
  nutrientsInfo,
  langualCodesInfo,
  scientificNamesInfo,
  subspeciesNamesInfo,
  typesNamesInfo,
  groupsNamesInfo,
  handleView,
}: FoodValidateDataProps) {
  
  const [view, setView] = useState("list");
  const [selectedFood, setSelectedFood] = useState<CSVFood | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
  const [filteredData, setFilteredData] = useState(data);
  const { t } = useTranslation();
    
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Mostrar todos");
  const dropdownRef = useRef(null);

  const options = ["Mostrar todos", "Invalidos", "Actualizados", "Validos", "Nuevos"];

  useEffect(() => {
      setFilteredData(filterByFlag(data, selectedOption));
      setCurrentPage(1); 
    }, [data, selectedOption]);

  const changePage = (page: number) => {
    if (page >= 1 && page <= npage) {
      setCurrentPage(page);
    }
  };

  const handleFoods = () => {
    console.log("Se ha enviado las referencias");
    handleView(false);
  };

  const npage = Math.ceil(filteredData.length / recordsPerPage);
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredData.slice(firstIndex, lastIndex);

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
  const handleReferences = () => {
    console.log("Se ha enviado las referencias");
    handleView(false);
  };

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
        <button className="button-form-of-food" onClick={handleFoods}>
          Enviar
        </button>
      </Container>
    </div>
  );
}
