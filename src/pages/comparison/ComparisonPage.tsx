import "../../assets/css/_ComparisonPage.css";
import { useComparison } from "../../core/context/ComparisonContext";
import { Container, Row, Col, Card, Button} from "react-bootstrap";
import { Trash, ArrowRight } from "lucide-react";
import { useFetch , FetchStatus} from "../../core/hooks";
import { SingleFoodResult } from "../../core/types/SingleFoodResult";

type SingleFoodWithCodeResult = SingleFoodResult & {
    code: string
}

export default function ComparisonPage() {
  const { comparisonFoods, removeFromComparison } = useComparison();

  const codes = comparisonFoods.map((food) => `${food.code}`).join(',');
  
 const foodsResult = useFetch<SingleFoodWithCodeResult[]>(`/foods/compare?codes=${codes}`);
 const data = foodsResult.status === FetchStatus.Success ?foodsResult.data : []

  return (
    <Container className="comparison-page py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-3">Comparación de Alimentos</h1>
          <p className="text-center text-muted">
            Selecciona los alimentos que deseas comparar y presiona el botón para ver sus nutrientes
          </p>
        </Col>
      </Row>
      
      {comparisonFoods.length === 0 ? (
        <div className="empty-state text-center">
          <h4 className="heading">No hay alimentos para comparar</h4>
          <p>Por favor, agrega alimentos desde la sección de búsqueda para comenzar a comparar.</p>
        </div>
      ) : (
        <>
          <Row className="mb-4">
            <Col>
              <div className="food-count-badge">
                <span className="count-indicator">
                  {comparisonFoods.length} /5 {comparisonFoods.length === 1 ? "alimento" : "alimentos"}
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
              <Button onClick={()=>console.log(data)}variant="success" size="lg" className="compare-btn">
                Ver Comparación de Nutrientes <ArrowRight className="ms-2" />
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}