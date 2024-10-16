import React from 'react';
import { Container, Row, Col, Form, Button} from 'react-bootstrap';

const HeroSection = () => {
  return (
    <div
      style={{
        //ESTA IMAGEN ES DE PRUEBA! Es de https://foodb.ca
        backgroundImage: `url(https://foodb.ca/assets/foodb_banner-f4a7d9c3f1870c021612d621e3130f3350a3072734ab0c6127dda4745e88b485.jpg)`, // Cambia la URL a tu imagen
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        position: 'relative',
        color: 'white',
        textAlign: 'center'
      }}
    >
      {/* Contenido superpuesto sobre la imagen */}
      <Container fluid style={{ height: '100%' }}>
        <Row className="h-100 d-flex justify-content-center align-items-center">
          <Col md={8}>
            <h1 style={{ fontWeight: 'bold', fontSize: '3rem', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)', fontFamily: 'Montserrat, sans-serif' }}>
              Food Composition Database 
            </h1>
            <p style={{ fontSize: '1.5rem', marginBottom: '30px', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)', fontFamily: 'Montserrat, sans-serif' }}>
              A data collection of food composition and more... something like that must be here hehe 
            </p>

            {/* Barra de búsqueda */}
            <Form>
              <Form.Group className="d-flex" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <Form.Control
                  type="text"
                  placeholder="Buscar..."
                  style={{
                    padding: '15px',
                    fontSize: '1.2rem',
                    borderRadius: '30px 0 0 30px',
                    border: 'none',
                  }}
                />
                <Button
                  type="submit"
                  variant="primary"
                  style={{
                    padding: '15px 30px',
                    fontSize: '1.2rem',
                    borderRadius: '0 30px 30px 0',
                    backgroundColor: '#019803'
                  }}
                >
                  Buscar
                </Button>
              </Form.Group>
            </Form>
            
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Button
                style={{
                  padding: '10px 30px',
                  fontSize: '1.2rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                }}
                onClick={() => window.location.href = '/search'}
              >
                Búsqueda avanzada
              </Button>
            </div>



          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HeroSection;
