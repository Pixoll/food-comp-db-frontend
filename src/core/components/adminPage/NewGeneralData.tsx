import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import useGroups from "./getters/useGroups";
import useTypes from "./getters/useTypes";
import { FetchStatus } from "../../hooks/useFetch";
import useLanguages from "./getters/useLanguages";
import OriginSelector from "./OriginSelector";
import { useTranslation } from "react-i18next";

type GeneralData = {
  code: string;
  strain?: string | null;
  brand?: string | null;
  observation?: string | null;
  group: {
    code: string;
    name: string;
  };
  type: {
    code: string;
    name: string;
  };
  scientificName?: string | null;
  subspecies?: string | null;
  commonName: Record<"es", string> &
    Partial<Record<"en" | "pt", string | null>>;
  ingredients: Partial<Record<"es" | "en" | "pt", string | null>>;
};

type NewGeneralDataProps = {
  data: GeneralData;
  onUpdate: (updatedData: Partial<GeneralData>) => void;
};


const NewGeneralData: React.FC<NewGeneralDataProps> = ({ data, onUpdate }) => {
  const groupsResult = useGroups();
  const typesResult = useTypes();
  const languagesResult = useLanguages();

  const [formData, setFormData] = useState<GeneralData>(data);

  const groups = groupsResult.status === FetchStatus.Success ? groupsResult.data : [];
  const types = typesResult.status === FetchStatus.Success ? typesResult.data : [];
  const languages = languagesResult.status === FetchStatus.Success ? languagesResult.data : [];
  const { t } = useTranslation("global");
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    onUpdate(updatedFormData);
  };

  const handleGroupSelect = (id: number | null) => {
    const selectedGroup = groups.find((group) => group.id === id);
    if (selectedGroup) {
      const updatedFormData = {
        ...formData,
        group: { code: selectedGroup.code, name: selectedGroup.name },
      };
      setFormData(updatedFormData);
      onUpdate(updatedFormData); 
    }
  };
  
  const handleTypeSelect = (id: number | null) => {
    const selectedType = types.find((type) => type.id === id);
    if (selectedType) {
      const updatedFormData = {
        ...formData,
        type: { code: selectedType.code, name: selectedType.name },
      };
      setFormData(updatedFormData);
      onUpdate(updatedFormData); 
    }
  };
  
  return (
    <Form>
      <Row>
        <Col md={6}>
          <Form.Group controlId="code">
            <Form.Label>{t("NewGeneralData.code")}</Form.Label>
            <Form.Control
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="strain">
            <Form.Label>{t("NewGeneralData.strain")}</Form.Label>
            <Form.Control
              type="text"
              name="strain"
              value={formData.strain || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group controlId="brand">
            <Form.Label>{t("NewGeneralData.brand")}</Form.Label>
            <Form.Control
              type="text"
              name="brand"
              value={formData.brand || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="observation">
            <Form.Label>{t("NewGeneralData.Observation")}</Form.Label>
            <Form.Control
              as="textarea"
              name="observation"
              value={formData.observation || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Label>{t("NewGeneralData.group")}</Form.Label>
          {groups && (
            <OriginSelector
              options={groups.map((group) => ({
                id: group.id,
                name: group.name,
              }))}
              selectedValue={formData.group.name}
              placeholder={t("NewGeneralData.select_G")}
              onSelect={handleGroupSelect}
            />
          )}
        </Col>
        <Col md={6}>
        <Form.Label>{t("NewGeneralData.type")}</Form.Label>
          {types && (
            <OriginSelector
              options={types.map((type) => ({ id: type.id, name: type.name }))}
              selectedValue={formData.type.name}
              placeholder={t("NewGeneralData.select_A")}
              onSelect={handleTypeSelect}
            />
          )}
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group controlId="scientificName">
            <Form.Label>{t("NewGeneralData.name_scientist")}</Form.Label>
            <Form.Control
              type="text"
              name="scientificName"
              value={formData.scientificName || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="subspecies">
            <Form.Label>{t("NewGeneralData.Subspecies")}</Form.Label>
            <Form.Control
              type="text"
              name="subspecies"
              value={formData.subspecies || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Form.Group controlId="commonName">
            <Form.Label>{t("NewGeneralData.name_common")}</Form.Label>
            {languages?.map((lang) => (
              <Form.Control
              key={lang.code}
              type="text"
              placeholder={`${t("NewGeneralData.name_com")} (${lang.code})`}
              value={formData.commonName[lang.code] || ""}
              onChange={(e) => {
                const updatedFormData = {
                  ...formData,
                  commonName: {
                    ...formData.commonName,
                    [lang.code]: e.target.value,
                  },
                };
                setFormData(updatedFormData);
                onUpdate(updatedFormData); 
              }}
            />
            ))}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Form.Group controlId="ingredients">
            <Form.Label>{t("NewGeneralData.Ingredients")}</Form.Label>
            {languages?.map((lang) => (
              <Form.Control
              key={lang.code}
              type="text"
              placeholder={`${t("NewGeneralData.Ingredient")} (${lang.code})`}
              value={formData.ingredients[lang.code] || ""}
              onChange={(e) => {
                const updatedFormData = {
                  ...formData,
                  ingredients: {
                    ...formData.ingredients,
                    [lang.code]: e.target.value,
                  },
                };
                setFormData(updatedFormData);
                onUpdate(updatedFormData); 
              }}
            />
            ))}
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default NewGeneralData;


