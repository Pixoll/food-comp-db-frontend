import { Col, Container, Nav, Row, Tab } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useState } from "react";
import "../../assets/css/_DetailPage.css";
import NutrientAccordion from "../../core/components/detailFood/NutrientAccordion";
import Footer from "../../core/components/Footer";
import useFetch, { FetchStatus } from "../../core/hooks/useFetch";
import { SingleFoodResult } from "../../core/types/SingleFoodResult";
import Graphic from "../../core/components/detailFood/Graphic";
import ReferencesList from "../../core/components/detailFood/ReferencesList";
import LengualCodeComponent from "../../core/components/detailFood/LengualCodeComponent";
import { useTranslation } from "react-i18next";

export default function DetailPage() {
  const {t} = useTranslation("global");
  const [key, setKey] = useState<string | undefined>(undefined); 

  const handleReferenceClick = (code: string) => {
    setKey("second"); 
  };

  const { code } = useParams();
  const [grams, setGrams] = useState<number>(100);
  const [inputGrams, setInputGrams] = useState<number>(100);
  
  const result = useFetch<SingleFoodResult>(
    `http://localhost:3000/api/v1/foods/${code?.toString()}`
  );
  if (result.status !== FetchStatus.Success) {
    return <h2>Cargando...</h2>;
  }

  const { data } = result;

  const colors = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CC3", "#FF6361","#BC5090", "#58508D",
    "#003F5C", "#FFA600", "#2F4B7C", "#665191","#D45087", "#F95D6A", "#FF7C43", "#1F77B4", 
    "#AEC7E8", "#FF9896","#98DF8A", "#C5B0D5", "#FFBB78", "#9467BD", "#C49C94", "#E377C2",
    "#F7B6D2", "#7F7F7F", "#C7C7C7", "#BCBD22", "#DBDB8D", "#17BECF",
  ];

  const references = data?.references ?? [];
  const mainNutrients = data?.nutrientMeasurements?.mainNutrients ?? [];

  const graphicData = mainNutrients
    .filter((mainNutrient) => mainNutrient.nutrientId !== 12)
    .map((mainNutrient, index) => ({
      name: mainNutrient.name,
      value: +((grams / 100) * mainNutrient.average).toFixed(2),
      fill: colors[index % colors.length],
    })) || [];
  

  const graphicDataPorcent = mainNutrients
    .filter((mainNutrient) => mainNutrient.nutrientId !== 12 && mainNutrient.nutrientId !== 1)
    .map((mainNutrient, index) => ({
      name: mainNutrient.name,
      value: +(((grams / 100) * mainNutrient.average) / 100).toFixed(2),
      fill: colors[index % colors.length],
    })) || [];

  const handleGramsChange = () => {
    setGrams(inputGrams);
  };

  return (
    <div className="detail-background">
      <Container>
        <Row>
          <Col md={6}>
            <div className="transparent-container">
              <h2>{t('DetailFood.title')}</h2>
              <p>
                <strong>{t('DetailFood.code')}:</strong> {data.code}
              </p>

              {data.commonName?.es && (
                <p>
                  <strong>{t('DetailFood.name.Spanish')}</strong> {data.commonName.es}
                </p>
              )}
              {data.commonName?.pt && (
                <p>
                  <strong>{t('DetailFood.name.Portuguese')}</strong> {data.commonName.pt}
                </p>
              )}
              {data.commonName?.en && (
                <p>
                  <strong>{t('DetailFood.name.English')}</strong> {data.commonName.en}
                </p>
              )}

              {data.scientificName && (
                <p>
                  <strong>{t('DetailFood.name.scientific')}</strong> {data.scientificName}
                </p>
              )}
              {data.subspecies && (
                <p>
                  <strong>{t('DetailFood.subspecies')}</strong> {data.subspecies}
                </p>
              )}
              {data.strain && (
                <p>
                  <strong>{t('DetailFood.strain')}</strong> {data.strain}
                </p>
              )}
              {data.brand && (
                <p>
                  <strong>{t('DetailFood.brand')}</strong> {data.brand}
                </p>
              )}
              {data.origins && (
                  data.origins.map((origin,index)=>(
                    <div key = {index}>
                      <p>Origen {index+1}: {origin}</p>
                    </div>
                  ))
              )}
              {data.observation && (
                <p>
                  <strong>{t('DetailFood.observation')}</strong> {data.observation}
                </p>
              )}

              <p>
                <strong>{t('DetailFood.group')}</strong> {data.group.name} (Código:{" "}
                {data.group.code})
              </p>
              <p>
                <strong>{t('DetailFood.type')}</strong> {data.type.name} (Código:{" "}
                {data.type.code})
              </p>

              {data.ingredients?.es && (
                <p>
                  <strong>{t('DetailFood.ingredients.Spanish')}</strong> {data.ingredients.es}
                </p>
              )}
              {data.ingredients?.pt && (
                <p>
                  <strong>{t('DetailFood.ingredients.Portuguese')}</strong>{" "}
                  {data.ingredients.pt}
                </p>
              )}
              {data.ingredients?.en && (
                <p>
                  <strong>{t('DetailFood.ingredients.English')}</strong> {data.ingredients.en}
                </p>
              )}
            </div>
          </Col>
          <Col md={6}>
            <div className="transparent-container">
              <Row>
                <Col md={6}>
                  <Graphic data={graphicData} />
                </Col>
                <Col md={6}>
                  <Graphic data={graphicDataPorcent} />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <div style={{ textAlign: "center" }}>
                    <input
                      type="number"
                      value={inputGrams}
                      onChange={(e) => setInputGrams(+(e.target.value))}
                      placeholder={t('DetailFood.grams.enter')}
                      min={1}
                      style={{ marginRight: "10px", padding: "5px", width: "120px" }}
                    />
                    <button
                      onClick={handleGramsChange}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#0d6efd",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                      }}
                    >
                      {t('DetailFood.grams.change')}
                    </button>
                    <p>{t('DetailFood.grams.current')} {grams}g</p>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <div style={{
               backgroundColor: "#d1e7dd", 
               padding: "20px 10px 5px 15px", 
               borderRadius: "5px",
               height: "auto" 
               }}>
              <Tab.Container activeKey={key} onSelect={(k) => setKey(k as string)}>
                <Nav variant="tabs" className="mb-3" style={{ 
                  borderBottom: "1px solid #d1e7dd",
                  paddingLeft: "50px"
                  }}>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="first"
                      style={{

                        backgroundColor: "#f8f9fa",
                        borderRadius: "5px 5px 5px 5px",
                        border: "1px solid #d1e7dd",
                        marginRight: "5px",
                        color: "#0d6efd",
                        transition: "background-color 0.3s ease",
                        padding: "8px 80px",
                      }}
                    >
                      {t('DetailFood.labels.Nutritional')}
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="second"
                      style={{
                        backgroundColor: "#f8f9fa",
                        borderRadius: "5px 5px 5px 5px",
                        border: "1px solid #d1e7dd",
                        marginRight: "5px",
                        color: "#0d6efd",
                        transition: "background-color 0.3s ease",
                        padding: "8px 120px",
                      }}
                    >
                      {t('DetailFood.references.title')}
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="third"
                      style={{
                        backgroundColor: "#f8f9fa",
                        borderRadius: "5px 5px 5px 5px",
                        border: "1px solid #d1e7dd",
                        color: "#0d6efd",
                        transition: "background-color 0.3s ease",
                        padding: "8px 100px",
                        
                      }}
                    >
                      {t('DetailFood.labels.data')}
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <NutrientAccordion
                      data={data?.nutrientMeasurements ?? { energy: [], mainNutrients: [], micronutrients: { vitamins: [], minerals: [] } }}
                      onReferenceClick={handleReferenceClick}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <h4>{t('DetailFood.references.nutrients')}</h4>
                    <ReferencesList references={references} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <h4>{t('DetailFood.codes')}</h4>
                    <LengualCodeComponent data={data.langualCodes} />
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}
