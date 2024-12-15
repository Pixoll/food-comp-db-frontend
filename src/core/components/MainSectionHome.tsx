import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import background from "../../../src/assets/images/main_page_bg.jpg";

export default function MainSectionHome() {
  const { t } = useTranslation();

  return (
    <div
      style={{
        // bg image obtained from https://www.pexels.com/photo/assorted-vegetables-on-brown-surface-616404/
        // marked as free to use by the photographer
        backgroundImage: `url(${background}), radial-gradient(rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 50%)`,
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        color: "white",
        textAlign: "center"
      }}
    >
      {/* Contenido superpuesto sobre la imagen */}
      <Container fluid style={{ height: "100%" }}>
        <Row className="h-100 d-flex justify-content-center align-items-center">
          <Col md={8}>
            <h1
              style={{
                fontWeight: "bold",
                fontSize: "3rem",
                textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)",
                fontFamily: "Poppins, sans-serif"
              }}
            >
              {t("homepage.title")}
            </h1>
            <p
              style={{
                fontSize: "1.5rem",
                marginBottom: "30px",
                textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)",
                fontFamily: "Poppins, sans-serif"
              }}
            >
              {t("homepage.subtitle")}
            </p>

            {/* Barra de búsqueda */}
            <Form>
              <Form.Group className="d-flex" style={{ maxWidth: "600px", margin: "0 auto" }}>
                <Form.Control
                  type="text"
                  placeholder={t("search.placeholder")}
                  style={{
                    padding: "15px",
                    fontSize: "1.2rem",
                    borderRadius: "30px 0 0 30px",
                    border: "none",
                  }}
                />
                <Button
                  type="submit"
                  variant="primary"
                  style={{
                    padding: "15px 30px",
                    fontSize: "1.2rem",
                    borderRadius: "0 30px 30px 0",
                    backgroundColor: "#019803",
                    borderColor: "#28a745",
                  }}
                >
                  {t("search.button")}
                </Button>
              </Form.Group>
            </Form>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Button
                style={{
                  padding: "10px 30px",
                  fontSize: "1.2rem",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  borderColor: "#28a745",
                }}
                onClick={() => window.location.href = "/search"}
              >
                {t("search.advancedSearch")}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
