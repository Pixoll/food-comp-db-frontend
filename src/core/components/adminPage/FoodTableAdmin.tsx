import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PaginationAdmin from "./PaginationAdmin"; // Asegúrate de tener este componente disponible
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

interface FoodResultsListProps {
  data: { id: string; name: string; code: string }[]; // Asegúrate de que los datos tengan esta estructura
}

const FoodTable: React.FC<FoodResultsListProps> = ({ data }) => {
  const navigate = useNavigate();
  const { state } = useAuth(); // Mantener autenticación para "modificar"
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
  const [filteredData, setFilteredData] = useState(data);
  const { t } = useTranslation("global");

  // Calcular los datos para la página actual
  const npage = Math.ceil(filteredData.length / recordsPerPage); // Número total de páginas
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

  const [view, setView] = useState("list"); // Inicialmente muestra la lista
const [selectedFood, setSelectedFood] = useState(null); // Para almacenar el alimento seleccionado

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
                {records.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>
                      <button onClick={() => { setView("verificar"); {/*setSelectedFood(item); LA IDEA ES ACCEDER AL ITEM...*/} }}>
                        Verificar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {npage > 1 && (
              <PaginationAdmin currentPage={currentPage} npage={npage} onPageChange={changePage} />
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
            {/* Agrega más detalles o acciones relacionadas con el alimento */}
          </div>
        )}
        <button className="button" onClick={() => setView("list")}>{t("FoodTableAdmin.Back")}</button>
      </div>
    )}
  </div>
);
};

export default FoodTable;
