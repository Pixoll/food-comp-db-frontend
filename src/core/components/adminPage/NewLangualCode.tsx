import React, { useState } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { PlusCircle } from 'lucide-react';
import useLangualCodes from './getters/useLangualCodes';
import { FetchStatus } from '../../hooks/useFetch';
import Pagination from '../search/Pagination';

const ITEMS_PER_PAGE = 5;

const NewLangualCodes = () => {
  const langualCodesResult = useLangualCodes()
  const langualCodes = langualCodesResult.status === FetchStatus.Success ? langualCodesResult.data : [];

const [currentPage, setCurrentPage] = useState(1);

const totalItems = langualCodes.length;
const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
const endIndex = startIndex + ITEMS_PER_PAGE;
const currentItems = langualCodes.slice(startIndex, endIndex);

const handlePageChange = (page: number) => {
  if (page > 0 && page <= totalPages) {
    setCurrentPage(page);
  }
};

return (
    <div className="langual-codes-container space-y-4 py-4">
      {currentItems.map((langualCode) => (
        <Card
          key={langualCode.id}
          className="shadow-lg border-0 overflow-hidden mb-4 hover:scale-[1.01] transition-transform duration-300"
        >
          <Row className="g-0 h-100 align-items-stretch">
            <Col md={9} className="p-4">
              <div className="space-y-2 h-100">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Codigo Langual: {langualCode.code}
                </h3>
                <div className="space-y-1 text-sm text-gray-700">
                  <div>
                    <span className="font-semibold">Descriptor:</span>{' '}
                    {langualCode.descriptor}
                  </div>
                </div>
              </div>
            </Col>
            <Col md={3} className="d-flex">
              <Button
                variant="success"
                className="w-100 d-flex align-items-center justify-content-center border-0 rounded-0 hover:bg-green-700 transition-colors duration-300"
                onClick={() => {
                  /* Acción de agregar */
                }}
              >
                <div className="text-center">
                  <PlusCircle className="mx-auto mb-2" size={24} />
                  <span className="d-block">Agregar</span>
                </div>
              </Button>
            </Col>
          </Row>
        </Card>
      ))}

      <Pagination
        currentPage={currentPage}
        npage={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
export default NewLangualCodes;