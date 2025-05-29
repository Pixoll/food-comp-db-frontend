'use client'
import{ useState } from 'react';
import { 
  Table, 
  Container, 
  Row, 
  Col, 
  Button, 
  Modal,
  Badge
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { LangualCode } from "@/types/SingleFoodResult";
import { BsInfoCircle, BsSearch } from 'react-icons/bs';

type LangualCodeComponentProps = {
  data: LangualCode[];
}

export default function LangualCodeComponent({ data }: LangualCodeComponentProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCode, setSelectedCode] = useState<{
    mainDescriptor: string;
    code: string;
    descriptor: string;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleShowDetails = (mainDescriptor: string, code: string, descriptor: string) => {
    setSelectedCode({ mainDescriptor, code, descriptor });
    setShowModal(true);
  };

  const filteredData = data.filter(codeLangual => 
    codeLangual.descriptor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    codeLangual.children.some(child => 
      child.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.descriptor.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Container fluid>
      <Row className="mb-3 align-items-center">
        <Col md={6}>
          <div className="d-flex align-items-center">
            <BsSearch className="me-2 text-muted" />
            <input
              type="text"
              className="form-control"
              placeholder={"Buscar código langual"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </Col>
      </Row>

      <Table responsive="sm" bordered hover striped className="mt-3">
        <thead className="table-primary">
          <tr>
            <th>{t('LangualCode.description_main')}</th>
            <th>{t('LangualCode.code')}</th>
            <th>{t('LangualCode.description')}</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((codeLangual, index) => (
            codeLangual.children.map((child, childIndex) => (
              <tr key={`${index}-${childIndex}`}>
                <td className={childIndex === 0 ? "fw-bold" : "text-muted"}>
                  {childIndex === 0 ? codeLangual.descriptor : ""}
                </td>
                <td>
                  <Badge bg={childIndex === 0 ? "success" : "secondary"}>
                    {child.code}
                  </Badge>
                </td>
                <td>{child.descriptor}</td>
                <td className="text-center">
                  <Button
                    variant="outline-info"
                    size="sm"
                    onClick={() => handleShowDetails(
                      codeLangual.descriptor, 
                      child.code, 
                      child.descriptor
                    )}
                  >
                    <BsInfoCircle />
                  </Button>
                </td>
              </tr>
            ))
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCode && (
            <>
              <p>
                <strong>{t('LangualCode.description_main')}:</strong>{' '}
                {selectedCode.mainDescriptor}
              </p>
              <p>
                <strong>{t('LangualCode.code')}:</strong>{' '}
                <Badge bg="primary">{selectedCode.code}</Badge>
              </p>
              <p>
                <strong>{t('LangualCode.description')}:</strong>{' '}
                {selectedCode.descriptor}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
