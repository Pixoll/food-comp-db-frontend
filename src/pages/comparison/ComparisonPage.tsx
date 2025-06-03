
import { useState } from "react";
import "../../assets/css/_ComparisonPage.css";
import { useComparison } from "../../core/context/ComparisonContext";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Trash, ArrowRight, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useFetch, FetchStatus } from "../../core/hooks";
import {
  SingleFoodResult
} from "../../core/types/SingleFoodResult";
import NutrientComparisonTable from "../../core/components/comparePage/NutrientComparisonTable";
import { useAuth } from "../../core/context/AuthContext";
import { useNavigate } from "react-router-dom";
export type GetFoodMeasurementsResult = Pick<SingleFoodResult, "commonName" | "nutrientMeasurements"> & {
  code: string;
};

export default function ComparisonPage() {
  const { comparisonFoods, removeFromComparison } = useComparison();
  const [comparisonSectionOpen, setComparisonSectionOpen] = useState(false);
  const { state } = useAuth();
  const { token } = state;
  const codes = comparisonFoods.map((food) => `${food.code}`).join(",");
  const navigate = useNavigate();
  const exportData = async (codes: string[]) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/xlsx?codes=${codes.join(",")}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          }
        );
  
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
  
        let fileName = "foods_data.xlsx";
        const contentDisposition = response.headers["content-disposition"];
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match && match[1]) {
            fileName = match[1];
          }
        }
  
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error(error);
      }
    };

  const foodsResult = useFetch<GetFoodMeasurementsResult[]>(
    `/foods/compare?codes=${codes}`
  );
  const data =
    foodsResult.status === FetchStatus.Success ? foodsResult.data : [];
  console.log(data)
  return (
    <Container className="comparison-page py-4">
      <Row className="mb-4">
        <Col>
          <Button
            onClick={() => navigate('/search')}
            variant="outline-secondary"
            size="lg"
            className="back-btn"
            >
          <ArrowLeft size={16} className="me-2" /> Volver
          </Button>
          <h1 className="text-center mb-3">Comparación de Alimentos</h1>
          <p className="text-center text-muted">
            Selecciona los alimentos que deseas comparar y presiona el botón
            para ver sus nutrientes
          </p>
        </Col>
      </Row>

      {comparisonFoods.length < 2 ? (
        <div className="empty-state text-center">
          <h4 className="heading">No hay alimentos suficientes para comparar</h4>
          <p>
            Por favor, agrega alimentos desde la sección de búsqueda para
            comenzar a comparar.
          </p>
        </div>
      ) : (
        <>
          {!comparisonSectionOpen ? (
            <>
              <Row className="mb-4">
                <Col>
                  <div className="food-count-badge">
                    <span className="count-indicator">
                      {comparisonFoods.length} /5{" "}
                      {comparisonFoods.length === 1 ? "alimento" : "alimentos"}
                    </span>
                  </div>
                </Col>
              </Row>

              <Row className="comparison-items-container mb-4">
                {comparisonFoods.map((food, index) => (
                  <Col key={index} xs={12} md={6} lg={4} className="mb-3">
                    <Card className="comparison-item h-100">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <span className="food-code">{food.code}</span>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeFromComparison(food.code)}
                          className="remove-btn"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                      <div className="card-body">
                        <h5 className="card-title">{food.name}</h5>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Row className="justify-content-center">
                <Col xs={12} md={6} className="text-center">
                  <Button
                    onClick={() => setComparisonSectionOpen(true)}
                    variant="success"
                    size="lg"
                    className="compare-btn"
                  >
                    Ver Comparación de Nutrientes <ArrowRight className="ms-2" />
                  </Button>
                </Col>
              </Row>
            </>
          ) : (
            <div className="nutrient-comparison-section">
              <Row className="mb-4">
                <Col className="d-flex bd-highlight mb-3">
                  <h2 className="me-auto bd-highlight">Comparación de Nutrientes</h2>
                  <button
                  className="export-button-comparison bd-highlight"
                  onClick={() => exportData(data.map((f) => f.code))}
                >
                  Exportar tabla comparativa
                </button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setComparisonSectionOpen(false)}
                    className="back-btn bd-highlight "
                  >
                    <ArrowLeft size={16} className="me-2" /> Volver
                  </Button>
                </Col>
              </Row>

              {foodsResult.status === FetchStatus.Loading && (
                <Row>
                  <Col className="text-center py-5">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-3">Cargando datos nutricionales...</p>
                  </Col>
                </Row>
              )}

              {foodsResult.status === FetchStatus.Failed && (
                <Row>
                  <Col className="text-center py-5">
                    <div className="alert alert-danger">
                      Error al cargar los datos nutricionales. Por favor, intente nuevamente.
                    </div>
                  </Col>
                </Row>
              )}

              {foodsResult.status === FetchStatus.Success && (
                <NutrientComparisonTable 
                foodsData={data}
                onRemoveFood={removeFromComparison}
              />
              )}
            </div>
          )}
        </>
      )}
    </Container>
  );
}