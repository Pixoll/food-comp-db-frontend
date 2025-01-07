import { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { PlusCircle, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LangualCode } from "../../hooks";
import { Pagination } from "../search";

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

  const parentCodes = langualCodes.filter(code => code.parentId === null);
  const getChildCodes = (parentId: number) => 
    langualCodes.filter(code => code.parentId === parentId);

  const filteredParentCodes = parentCodes.filter(code =>
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.descriptor.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    const children = getChildCodes(parentId);
    const currentPage = childrenPages[parentId] || 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      children: children.slice(startIndex, endIndex),
      totalPages: Math.ceil(children.length / ITEMS_PER_PAGE),
      currentPage
    };
  };

   return (
    <div className="space-y-4 py-4">
      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder={t("LangualCode.Search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>

      {filteredParentCodes.map(parent => {
        const { children, totalPages, currentPage } = getPaginatedChildren(parent.id);
        
        return (
          <Card key={parent.id} className="mb-4 shadow-sm border-0">
            <Card.Header className="bg-gray-50 cursor-pointer" onClick={() => toggleExpand(parent.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {expandedParents.includes(parent.id) ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                  <span className="font-semibold" color="white">
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
                    <Row key={child.id} className="m-0 border-b last:border-b-0">
                      <Col xs={9} className="p-3">
                        <div className="text-sm">
                          <div className="font-medium">{child.code}</div>
                          <div className="text-gray-600">{child.descriptor}</div>
                        </div>
                      </Col>
                      <Col xs={3} className="p-0">
                        <Button
                          variant={isSelected ? "danger" : "success"}
                          className="w-full h-full rounded-none border-0"
                          onClick={() => handleChildSelection(child.id)}
                        >
                          <div className="flex flex-col items-center">
                            {isSelected ? (
                              <>
                                <Trash2 size={20} className="mb-1" />
                                <span className="text-sm">{t("LangualCode.Eliminate")}</span>
                              </>
                            ) : (
                              <>
                                <PlusCircle size={20} className="mb-1" />
                                <span className="text-sm">{t("LangualCode.Add")}</span>
                              </>
                            )}
                          </div>
                        </Button>
                      </Col>
                    </Row>
                  );
                })}
                {totalPages > 1 && (
                  <div className="p-3 border-t">
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