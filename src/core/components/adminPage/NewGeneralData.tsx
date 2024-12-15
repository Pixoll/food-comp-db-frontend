import React, { useState } from "react";
import { 
  Form, 
  Row, 
  Col, 
  Button, 
  InputGroup 
} from 'react-bootstrap';
import { 
  TagIcon, 
  ListIcon, 
  FolderIcon, 
  FileTextIcon, 
  PackageIcon,
  TypeIcon,
  PlusIcon
} from 'lucide-react';
import { Group } from "./getters/useGroups";
import { Type } from "./getters/useTypes";
import {
  ScientificName,
} from "./getters/useScientificNames";
import { Subspecies } from "./getters/useSubspecies";
import {Language} from "./getters/useLanguages";
import SelectorWithInput from "../detailFood/SelectorWithInput";
import { useTranslation } from "react-i18next";
import RequiredFieldLabel from "../detailFood/RequiredFieldLabel";
import makeRequest from "../../utils/makeRequest";
import { useAuth } from "../../context/AuthContext";

export const searchScientificNameById = (
  id: number | undefined,
  scientificName: ScientificName[]
) => {
  const sname = scientificName.find((sname) => sname.id === id);
  return sname?.name;
};

export const searchSubspeciesNameById = (
  id: number | undefined,
  subspecies: Subspecies[]
) => {
  const subspecie = subspecies.find((subspecie) => subspecie.id === id);
  return subspecie?.name;
};

export const searchGroupNameById = (id: number | undefined, groups: Group[]) => {
  const group = groups.find((group) => group.id === id);
  return group?.name;
};

export const searchTypeNameById = (id: number | undefined, types: Type[]) => {
  const type = types.find((type) => type.id === id);
  return type?.name;
};

type GeneralData = {
  code: string;
  strain?: string | null;
  brand?: string | null;
  observation?: string | null;
  scientificNameId?: number;
  subspeciesId?: number;
  groupId?: number;
  typeId?: number;
  commonName: Record<"es", string> &
    Partial<Record<"en" | "pt", string | null>>;
  ingredients: Partial<Record<"es" | "en" | "pt", string | null>>;
};

type NewGeneralDataProps = {
  data: GeneralData;
  onUpdate: (updatedData: Partial<GeneralData>) => void;
    types: Type[];
    groups: Group[];
    languages: Language[]
    scientificNames: ScientificName[];
    subspecies: Subspecies[];
};

const NewGeneralData: React.FC<NewGeneralDataProps> = ({ data, onUpdate, groups , types, languages, scientificNames, subspecies}) => {

  const { state } = useAuth();
  const token = state.token;
  const [actualIdSubspecies, setActualIdSubspecies] = useState<
    number | undefined
  >(undefined);
  const [newGroup, setNewGroup] = useState<string | undefined>(undefined);
  const [newType, setNewType] = useState<string | undefined>(undefined);
  const [newScientificName, setNewScientificName] = useState<
    string | undefined
  >(undefined);
  const [newSubspecies, setNewSubspecies] = useState<string | undefined>(
    undefined
  );

  const [groupCode, setGroupCode] = useState<string>("");
  const [typeCode, setTypeCode] = useState<string>("");

  const [formData, setFormData] = useState<GeneralData>(data);

  const { t } = useTranslation();
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    onUpdate(updatedFormData);
  };

  const handleCreateGroup = () => {
    if (!token) {
      alert(t("NewGeneralData.alert.authentication"));
      return;
    }

    if (!newGroup || !groupCode) {
      alert(t("NewGeneralData.alert.group"));
      return;
    }

    makeRequest(
      "post",
      "/groups",
      {
        groupName: newGroup,
        code: groupCode,
      },
      token,
      (response) => {
        const newGroupId = response.data.id;
        const updatedFormData = {
          ...formData,
          groupId: newGroupId,
        };
        setFormData(updatedFormData);
        onUpdate(updatedFormData);
        setNewGroup(undefined);
        setGroupCode("");
      },
      (error) => {
        console.error(t("NewGeneralData.error.group"), error);
        alert(t("NewGeneralData.alert.Failed_group"));
      }
    );
  };

  const handleCreateType = () => {
    if (!token) {
      alert(t("NewGeneralData.alert.authentication"));
      return;
    }

    // Verificar que tanto el nombre como el código estén presentes
    if (!newType || !typeCode) {
      alert(t("NewGeneralData.alert.type"));
      return;
    }

    makeRequest(
      "post",
      "/types",
      {
        name: newType,
        code: typeCode,
      },
      token,
      (response) => {
        const newTypeId = response.data.id;
        const updatedFormData = {
          ...formData,
          typeId: newTypeId,
        };
        setFormData(updatedFormData);
        onUpdate(updatedFormData);

        setNewType(undefined);
        setTypeCode("");
      },
      (error) => {
        console.error(t("NewGeneralData.error.type"), error);
        alert(t("NewGeneralData.alert.Failed_type"));
      }
    );
  };

  const handleCreateScientificName = () => {
    if (!token) {
      alert(t("NewGeneralData.alert.authentication"));
      return;
    }

    if (!newScientificName) {
      alert(t("NewGeneralData.alert.scientific"));
      return;
    }

    makeRequest(
      "post",
      "/scientific_names",
      { name: newScientificName },
      token,
      (response) => {
        const newScientificNameId = response.data.id;
        const updatedFormData = {
          ...formData,
          scientificNameId: newScientificNameId,
        };
        setFormData(updatedFormData);
        onUpdate(updatedFormData);
        setNewScientificName(undefined);
      },
      (error) => {
        console.error(t("NewGeneralData.error.scientific"), error);
        alert(t("NewGeneralData.alert.Failed_scientific"));
      }
    );
  };

  const handleCreateSubspecies = () => {
    if (!token) {
      alert(t("NewGeneralData.alert.authentication"));
      return;
    }

    if (!newSubspecies) {
      alert(t("NewGeneralData.alert.subspecies"));
      return;
    }

    makeRequest(
      "post",
      "/subspecies",
      { name: newSubspecies },
      token,
      (response) => {
        const newSubspeciesId = response.data.id;
        const updatedFormData = {
          ...formData,
          subspeciesId: newSubspeciesId,
        };
        setFormData(updatedFormData);
        onUpdate(updatedFormData);
        setNewSubspecies(undefined);
      },
      (error) => {
        console.error(t("NewGeneralData.error.subspecies"), error);
        alert(t("NewGeneralData.alert.Failed_subspecies"));
      }
    );
  };

  return (
    <Form className="p-4 bg-light rounded shadow-sm">
      {/* First Row: Code and Strain */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="code">
            <Form.Label>
              <RequiredFieldLabel 
                label={t("DetailFood.code")} 
                tooltipMessage={t("DetailFood.required")} 
              />
            </Form.Label>
            <InputGroup>
              <InputGroup.Text><TagIcon size={18} /></InputGroup.Text>
              <Form.Control
                type="text"
                name="code"
                value={formData.code || ''}
                onChange={handleInputChange}
                placeholder={t("DetailFood.code")}
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="strain">
            <Form.Label>{t("NewGeneralData.strain")}</Form.Label>
            <InputGroup>
              <InputGroup.Text><ListIcon size={18} /></InputGroup.Text>
              <Form.Control
                type="text"
                name="strain"
                value={formData.strain || ""}
                onChange={handleInputChange}
                placeholder={t("NewGeneralData.strain")}
              />
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      {/* Second Row: Brand and Observation */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="brand">
            <Form.Label>{t("NewGeneralData.brand")}</Form.Label>
            <InputGroup>
              <InputGroup.Text><PackageIcon size={18} /></InputGroup.Text>
              <Form.Control
                type="text"
                name="brand"
                value={formData.brand || ""}
                onChange={handleInputChange}
                placeholder={t("NewGeneralData.brand")}
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="observation">
            <Form.Label>{t("NewGeneralData.Observation")}</Form.Label>
            <InputGroup>
              <InputGroup.Text><FileTextIcon size={18} /></InputGroup.Text>
              <Form.Control
                as="textarea"
                name="observation"
                value={formData.observation || ""}
                onChange={handleInputChange}
                placeholder={t("NewGeneralData.Observation")}
                rows={3}
              />
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      {/* Group Section */}
      <Row className="mb-3">
        <Col>
          <Form.Label>
            <RequiredFieldLabel
              label={t("DetailFood.label_group")}
              tooltipMessage={t("DetailFood.required")}
            />
          </Form.Label>
          <Row>
            <Col md={4}>
              {groups && (
                <SelectorWithInput
                  options={groups.map((group) => ({
                    id: group.id,
                    name: group.name,
                  }))}
                  selectedValue={searchGroupNameById(formData.groupId, groups)}
                  placeholder={t("NewGeneralData.select_G")}
                  onSelect={(id, name) => {
                    if (id !== undefined) {
                      const updatedFormData = {
                        ...formData,
                        groupId: id,
                      };
                      setGroupCode("");
                      setFormData(updatedFormData);
                      onUpdate(updatedFormData);
                    } else if (name) {
                      setNewGroup(name);
                    }
                  }}
                />
              )}
            </Col>
            <Col md={4}>
              <InputGroup className="w-100 h-100">
                <InputGroup.Text><FolderIcon size={18} /></InputGroup.Text>
                <Form.Control
                  className="h-100"
                  type="text"
                  placeholder={t("NewGeneralData.Group")}
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <Button
                variant="outline-success"
                onClick={handleCreateGroup}
                disabled={!newGroup || !groupCode}
                className="w-100 h-100"
              >
                <PlusIcon size={18} className="me-2" />
                {t("NewGeneralData.create_group")}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Type Section */}
      <Row className="mb-3">
        <Col>
          <Form.Label>
            <RequiredFieldLabel
              label={t("DetailFood.label_type")}
              tooltipMessage={t("DetailFood.required")}
            />
          </Form.Label>
          <Row>
            <Col md={4}>
              {types && (
                <SelectorWithInput
                  options={types.map((type) => ({
                    id: type.id,
                    name: type.name,
                  }))}
                  selectedValue={searchTypeNameById(formData.typeId, types)}
                  placeholder={t("NewGeneralData.select_A")}
                  onSelect={(id, name) => {
                    if (id !== undefined) {
                      const updatedFormData = {
                        ...formData,
                        typeId: id,
                      };
                      setTypeCode("");
                      setFormData(updatedFormData);
                      onUpdate(updatedFormData);
                    } else if (name) {
                      setNewType(name);
                    }
                  }}
                />
              )}
            </Col>
            <Col md={4}>
              <InputGroup className="w-100 h-100">
                <InputGroup.Text><TypeIcon size={18} /></InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder={t("NewGeneralData.Type")}
                  value={typeCode}
                  onChange={(e) => setTypeCode(e.target.value)}
                  className="h-100"
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <Button
                variant="outline-success"
                onClick={handleCreateType}
                disabled={!newType || !typeCode}
                className="w-100 h-100"
              >
                <PlusIcon size={18} className="me-2" />
                {t("NewGeneralData.Create")}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Scientific Name Section */}
      <Row className="mb-3">
        <Col>
          <Form.Label>{t("NewGeneralData.name_scientist")}</Form.Label>
          <Row>
            <Col md={6}>
              {scientificNames && (
                <SelectorWithInput
                  options={scientificNames.map((sname) => ({
                    id: sname.id,
                    name: sname.name,
                  }))}
                  selectedValue={searchScientificNameById(
                    formData.scientificNameId,
                    scientificNames
                  )}
                  placeholder={t("NewGeneralData.Select_scientific")}
                  onSelect={(id, name) => {
                    if (id !== undefined) {
                      const updatedFormData = {
                        ...formData,
                        scientificNameId: id,
                      };
                      setFormData(updatedFormData);
                      onUpdate(updatedFormData);
                    } else if (name) {
                      setNewScientificName(name);
                    }
                  }}
                />
              )}
            </Col>
            <Col>
              <Button
                variant="outline-success"
                onClick={handleCreateScientificName}
                disabled={!newScientificName}
                className="w-100 h-100"
              >
                 <PlusIcon size={18} className="me-2" />
                {t("NewGeneralData.Create_Scientific")}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Subspecies Section */}
      <Row className="mb-3">
        <Col>
          <Form.Label>{t("NewGeneralData.Subspecies")}</Form.Label>
          <Row>
            <Col md={6}>
              {subspecies && (
                <SelectorWithInput
                  options={subspecies.map((sname) => ({
                    id: sname.id,
                    name: sname.name,
                  }))}
                  selectedValue={searchSubspeciesNameById(
                    formData.subspeciesId,
                    subspecies
                  )}
                  placeholder={t("NewGeneralData.Select_subspecies")}
                  onSelect={(id, name) => {
                    if (id !== undefined) {
                      const updatedFormData = {
                        ...formData,
                        subspeciesId: id,
                      };
                      setFormData(updatedFormData);
                      onUpdate(updatedFormData);
                    } else if (name) {
                      setNewSubspecies(name);
                    }
                  }}
                />
              )}
            </Col>
            <Col>
              <Button
                variant="outline-success"
                onClick={handleCreateSubspecies}
                disabled={!newSubspecies}
                className="w-100 h-100"
              >
                 <PlusIcon size={18} className="me-2" />
                {t("NewGeneralData.Create_subspecies")}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Common Names Section */}
      <Row className="mb-3">
        <Col md={12}>
          <Form.Group controlId="commonName">
            <Form.Label>
              <RequiredFieldLabel
                label={"Nombres comunes"}
                tooltipMessage={`${t("DetailFood.name.title")} (es): ${t(
                  "DetailFood.required"
                )}`}
              />
            </Form.Label>
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

      {/* Ingredients Section */}
      <Row className="mb-3">
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
