import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { ChevronDown, ChevronRight, Trash2, PlusCircle } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { LangualCode } from "../../hooks";
import { Pagination } from "../../../app/search/components";

type NewLangualCodeProps = {
  langualCodes: LangualCode[];
  selectedLangualCodes: number[];
  onLangualCodesChange: (updatedLangualCodeId: number) => void;
};

export default function NewLangualCode({
  langualCodes,
  selectedLangualCodes,
  onLangualCodesChange
}: NewLangualCodeProps) {

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedParents, setExpandedParents] = useState<number[]>([]);
  const [childrenPages, setChildrenPages] = useState<Record<number, number>>({});

  const { t } = useTranslation();

  const matchesSearchTerm = (text: string) => 
    text.toLowerCase().includes(searchTerm.toLowerCase());

  const parentCodes = langualCodes.filter(code => code.parentId === null);

  const getChildCodes = (parentId: number) =>
    langualCodes.filter(code => code.parentId === parentId);

  const getFilteredParentAndChildren = () => {
    if (!searchTerm) return parentCodes;

    return parentCodes.filter(parent => {
      const parentMatches = 
        matchesSearchTerm(parent.code)

      const children = getChildCodes(parent.id);
      const childrenMatch = children.some(child =>
        matchesSearchTerm(child.code)
      );

      if ((parentMatches || childrenMatch) && !expandedParents.includes(parent.id)) {
        setExpandedParents(prev => [...prev, parent.id]);
      }

      return parentMatches || childrenMatch;
    });
  };

  const getFilteredChildCodes = (parentId: number) => {
    const children = getChildCodes(parentId);
    
    if (!searchTerm) return children;

    return children.filter(child =>
      matchesSearchTerm(child.code) ||
      matchesSearchTerm(child.descriptor)
    );
  };

  const toggleExpand = (parentId: number) => {
    setExpandedParents(prev =>
      prev.includes(parentId)
        ? prev.filter(id => id !== parentId)
        : [...prev, parentId]
    );
    if (!childrenPages[parentId]) {
      setChildrenPages(prev => ({ ...prev, [parentId]: 1 }));
    }
  };

  const handleChildSelection = (childId: number) => {
    onLangualCodesChange(childId);
  };

  const handleChildPageChange = (parentId: number, page: number) => {
    setChildrenPages(prev => ({ ...prev, [parentId]: page }));
  };

  const ITEMS_PER_PAGE = 5;

  const getPaginatedChildren = (parentId: number) => {
    const children = getFilteredChildCodes(parentId);
    const currentPage = childrenPages[parentId] || 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      children: children.slice(startIndex, endIndex),
      totalPages: Math.ceil(children.length / ITEMS_PER_PAGE),
      currentPage
    };
  };

  const filteredParentCodes = getFilteredParentAndChildren();

  return (
    <div className="space-y-4 py-4">
      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder={t("LangualCode.Search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg shadow-sm"
        />
      </Form>
  
      {filteredParentCodes.map(parent => {
        const { children, totalPages, currentPage } = getPaginatedChildren(parent.id);
        
        return (
          <Card key={parent.id} className="mb-4 shadow-sm">
            <Card.Header 
              className="bg-light cursor-pointer hover:bg-gray-200 transition-all"
              onClick={() => toggleExpand(parent.id)}
            >
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  {expandedParents.includes(parent.id) ? (
                    <ChevronDown className="text-secondary" size={20} />
                  ) : (
                    <ChevronRight className="text-secondary" size={20} />
                  )}
                  <span className="fw-semibold text-dark">
                    {parent.code} - {parent.descriptor}
                  </span>
                </div>
              </div>
            </Card.Header>
  
            {expandedParents.includes(parent.id) && (
              <Card.Body className="p-0">
                {children.map(child => {
                  const isSelected = selectedLangualCodes.includes(child.id);
                  
                  return (
                    <Row key={child.id} className="m-0 border-bottom">
                      <Col xs={9} className="p-3">
                        <div>
                          <div className="fw-medium mb-1">{child.code}</div>
                          <div className="text-secondary small">{child.descriptor}</div>
                        </div>
                      </Col>
                      
                      <Col xs={3} className="p-0">
                        <Button
                          variant={isSelected ? "danger" : "success"}
                          className={`w-100 h-100 border-0 rounded-0 d-flex flex-column align-items-center justify-content-center ${
                            isSelected ? 'hover:bg-danger-dark' : 'hover:bg-success-dark'
                          }`}
                          onClick={() => handleChildSelection(child.id)}
                        >
                          <div className="d-flex flex-column align-items-center">
                            {isSelected ? (
                              <>
                                <Trash2 size={20} className="mb-1" />
                                <span className="small">{t("LangualCode.Eliminate")}</span>
                              </>
                            ) : (
                              <>
                                <PlusCircle size={20} className="mb-1" />
                                <span className="small">{t("LangualCode.Add")}</span>
                              </>
                            )}
                          </div>
                        </Button>
                      </Col>
                    </Row>
                  );
                })}
                
                {totalPages > 1 && (
                  <div className="p-3 border-top">
                    <Pagination
                      currentPage={currentPage}
                      npage={totalPages}
                      onPageChange={(page) => handleChildPageChange(parent.id, page)}
                    />
                  </div>
                )}
              </Card.Body>
            )}
          </Card>
        );
      })}
    </div>
  );
}
