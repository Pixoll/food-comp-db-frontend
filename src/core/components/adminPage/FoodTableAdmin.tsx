import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../search/Pagination";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { CSVFood } from "./FoodsFromCsv";

interface FoodResultsListProps {
  data: CSVFood[]; 
}

const FoodTableAdmin: React.FC<FoodResultsListProps> = ({ data }) => {
  const navigate = useNavigate();
  const { state } = useAuth(); 
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
  const [filteredData, setFilteredData] = useState(data);
  const { t } = useTranslation("global");

  const npage = Math.ceil(filteredData.length / recordsPerPage); 
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredData.slice(firstIndex, lastIndex);

  useEffect(() => {
    // Actualizar datos cuando se actualice el prop `data`
    setFilteredData(data);
  }, [data]);

  const changePage = (page: number) => {
    if (page >= 1 && page <= npage) {
      setCurrentPage(page);
    }
  };

  const [view, setView] = useState("list"); 
const [selectedFood, setSelectedFood] = useState(null);

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

                    <td>
                      <button onClick={() => { setView("verificar");}}>
                        Verificar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {npage > 1 && (
              <Pagination currentPage={currentPage} npage={npage} onPageChange={changePage} />
            )}
          </>
        )}
      </>
    )}

    {view === "verificar" && (
      <div className="verification-view">
        <h2>{t("FoodTableAdmin.Check")}o</h2>
        {selectedFood && (
          <div className="food-details">
          </div>
        )}
        <button className="button" onClick={() => setView("list")}>{t("FoodTableAdmin.Back")}</button>
      </div>
    )}
  </div>
);
};

export default FoodTableAdmin;
