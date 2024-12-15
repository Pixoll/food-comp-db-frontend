import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../search/Pagination";
import CSVFoodDisplay from "./CSVFoodDisplay";
import { CSVFood } from "./FoodsFromCsv";

type FoodValidateDataProps = {
  data: CSVFood[];
}

export default function FoodValidateData({ data }: FoodValidateDataProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
  const [filteredData, setFilteredData] = useState(data);
  const { t } = useTranslation();
  const npage = Math.ceil(filteredData.length / recordsPerPage);
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredData.slice(firstIndex, lastIndex);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const changePage = (page: number) => {
    if (page >= 1 && page <= npage) {
      setCurrentPage(page);
    }
  };

  const [view, setView] = useState("list");
  const [selectedFood, setSelectedFood] = useState<CSVFood | null>(null);

  return (
    <div className="food-list">
      {view === "list" && (
        <>
          <h2>{t("FoodTableAdmin.List")}</h2>
          {filteredData.length === 0 ? (
            <p>{t("FoodTableAdmin.available")}s</p>
          ) : (
            <>
              <table className="content-table-foods">
                <thead>
                <tr>
                  <th>ID</th>
                  <th>{t("FoodTableAdmin.Name")}</th>
                  <th>{t("FoodTableAdmin.Actions")}</th>
                </tr>
                </thead>
                <tbody>
                {records.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {item.commonName.en?.parsed || item.commonName.en?.raw || "N/A"}
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
        </>
      )}
      {view === "verificar" && (
        <div className="verification-view">
          <h2>{t("FoodTableAdmin.Check")}</h2>
          {selectedFood && (
            <div className="food-details">
              <CSVFoodDisplay food={selectedFood}/>
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
    </div>
  );
}
