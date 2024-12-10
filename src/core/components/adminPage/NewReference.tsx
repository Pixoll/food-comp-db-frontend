import React from 'react'
import { Card, Form, Button } from 'react-bootstrap'
const NewReference = () => {
  return (
    <Card className="mt-4">
          <Card.Body>
            <Card.Title>Agregar Nueva Referencia</Card.Title>
            <Form>
              <Form.Group controlId="formReferenceCode">
                <Form.Label>Código</Form.Label>
                <Form.Control type="text" placeholder="Ingrese el código" />
              </Form.Group>

              <Form.Group controlId="formReferenceType">
                <Form.Label>Tipo</Form.Label>
                <Form.Control type="text" placeholder="Ingrese el tipo de referencia" />
              </Form.Group>

              <Form.Group controlId="formReferenceTitle">
                <Form.Label>Título</Form.Label>
                <Form.Control type="text" placeholder="Ingrese el título" />
              </Form.Group>

              <Form.Group controlId="formReferenceAuthors">
                <Form.Label>Autores</Form.Label>
                <Form.Control type="text" placeholder="Ingrese los autores" />
              </Form.Group>

              <Button variant="success" className="mt-3">
                Guardar Referencia
              </Button>
            </Form>
          </Card.Body>
        </Card>
  )
}
export default NewReference