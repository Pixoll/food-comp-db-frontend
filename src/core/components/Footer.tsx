import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#343a40', color: 'white', padding: '20px', marginTop: '0' }}>
      <Container>
        <Row>
          <Col md={4}>
            <h5>Contacto</h5>
            <p>Email: contacto@ejemplo.com</p>
          </Col>
          <Col md={4}>
            <h5>Dirección</h5>
            <p>123 Calle Falsa, Ciudad, País</p>
          </Col>
          <Col md={4}>
            <h5>Políticas</h5>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              <li><a href="/politica-privacidad" style={{ color: 'white', textDecoration: 'none' }}>Política de Privacidad</a></li>
            </ul>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={12} className="text-center">
            <p>&copy; 2024 Mi Empresa. Todos los derechos reservados.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
