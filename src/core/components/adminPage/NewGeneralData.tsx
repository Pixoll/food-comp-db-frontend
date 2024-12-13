import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import useGroups, { Group } from "./getters/useGroups";
import useTypes, { Type } from "./getters/useTypes";
import useScientificNames, {
  ScientificName,
} from "./getters/useScientificNames";
import useSubspecies, { Subspecies } from "./getters/useSubspecies";
import { FetchStatus } from "../../hooks/useFetch";
import useLanguages from "./getters/useLanguages";
import SelectorWithInput from "../detailFood/SelectorWithInput";
import { useTranslation } from "react-i18next";
import RequiredFieldLabel from "../detailFood/RequiredFieldLabel";
import makeRequest from "../../utils/makeRequest";
import { useAuth } from "../../context/AuthContext";

const searchScientificNameById = (
  id: number | undefined,
  scientificName: ScientificName[]
) => {
  const sname = scientificName.find((sname) => sname.id === id);
  return sname?.name;
};

const searchSubspeciesNameById = (
  id: number | undefined,
  subspecies: Subspecies[]
) => {
  const subspecie = subspecies.find((subspecie) => subspecie.id === id);
  return subspecie?.name;
};

const searchGroupNameById = (id: number | undefined, groups: Group[]) => {
  const group = groups.find((group) => group.id === id);
  return group?.name;
};

const searchTypeNameById = (id: number | undefined, types: Type[]) => {
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
  groupId: number;
  typeId: number;
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
  const scientificNamesResult = useScientificNames();
  const subspeciesResult = useSubspecies();
  const languagesResult = useLanguages();
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

  const groups =
    groupsResult.status === FetchStatus.Success ? groupsResult.data : [];
  const types =
    typesResult.status === FetchStatus.Success ? typesResult.data : [];
  const languages =
    languagesResult.status === FetchStatus.Success ? languagesResult.data : [];

  const scientificNames =
    scientificNamesResult.status === FetchStatus.Success
      ? scientificNamesResult.data
      : [];
  const subspecies =
    subspeciesResult.status === FetchStatus.Success
      ? subspeciesResult.data
      : [];
  const { t } = useTranslation("global");
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
      alert("No authentication token available");
      return;
    }

    if (!newGroup || !groupCode) {
      alert("Por favor, ingrese tanto el nombre como el código del grupo");
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
        console.error("Error creating group:", error);
        alert("Fallo al crear el grupo");
      }
    );
  };
  console.log(formData);

  const handleCreateType = () => {
    if (!token) {
      alert("No authentication token available");
      return;
    }

    // Verificar que tanto el nombre como el código estén presentes
    if (!newType || !typeCode) {
      alert("Por favor, ingrese tanto el nombre como el código del tipo");
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
        console.error("Error creating type:", error);
        alert("Fallo al crear el tipo");
      }
    );
  };

  const handleCreateScientificName = () => {
    if (!token) {
      alert("No authentication token available");
      return;
    }

    if (!newScientificName) {
      alert("Por favor, ingrese un nombre científico");
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

        // Limpiar el campo después de crear
        setNewScientificName(undefined);
      },
      (error) => {
        console.error("Error creating scientific name:", error);
        alert("Fallo al crear el nombre científico");
      }
    );
  };

  const handleCreateSubspecies = () => {
    if (!token) {
      alert("No authentication token available");
      return;
    }

    if (!newSubspecies) {
      alert("Por favor, ingrese una subespecie");
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
        console.error("Error creating subspecies:", error);
        alert("Fallo al crear la subespecie");
      }
    );
  };

  return (
    <Form>
      <Row>
        <Col md={6}>
          <Form.Group controlId="code">
            <Form.Label column sm={2}>
              <RequiredFieldLabel
                label={t("DetailFood.code")}
                tooltipMessage={t("DetailFood.required")}
              />
            </Form.Label>
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

      <Row xs={1} md={2}>
        {/* Sección Grupo */}
        <Row
          xs={1}
          md={3}
          className="d-flex justify-content-between align-items-stretch mb-3"
        >
          <Col md={4} className="d-flex flex-column">
            <Form.Label>
              <RequiredFieldLabel
                label={t("DetailFood.label_group")}
                tooltipMessage={t("DetailFood.required")}
              />
            </Form.Label>
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
          <Col md={4} className="d-flex align-items-stretch">
            <Form.Control
              type="text"
              placeholder="Código del grupo"
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value)}
              className="h-100"
            />
          </Col>
          <Col md={4} className="d-flex align-items-stretch">
            <Button
              onClick={handleCreateGroup}
              disabled={!newGroup || !groupCode}
              className="w-100"
            >
              Crear Grupo
            </Button>
          </Col>
        </Row>

        {/* Sección Tipo */}
        <Row
          xs={1}
          md={3}
          className="d-flex justify-content-between align-items-stretch"
        >
          <Col md={4} className="d-flex flex-column">
            <Form.Label>
              <RequiredFieldLabel
                label={t("DetailFood.label_type")}
                tooltipMessage={t("DetailFood.required")}
              />
            </Form.Label>
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
          <Col md={4} className="d-flex align-items-stretch">
            <Form.Control
              type="text"
              placeholder="Código del tipo"
              value={typeCode}
              onChange={(e) => setTypeCode(e.target.value)}
              className="h-100"
            />
          </Col>
          <Col md={4} className="d-flex align-items-stretch">
            <Button
              onClick={handleCreateType}
              disabled={!newType || !typeCode}
              className="w-100"
            >
              Crear Tipo
            </Button>
          </Col>
        </Row>
      </Row>
      <Row xs={1} md={2}>
        {/* Sección Nombre Científico */}
        <Row className="d-flex justify-content-between align-items-stretch mb-3">
          <Col md={6} className="d-flex flex-column">
            <Form.Group controlId="scientificName">
              <Form.Label>{t("NewGeneralData.name_scientist")}</Form.Label>
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
                  placeholder={"Selecciona un nombre científico"}
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
            </Form.Group>
          </Col>
          <Col className="d-flex align-items-stretch">
            <Button
              onClick={handleCreateScientificName}
              disabled={!newScientificName}
              className="w-100"
            >
              Crear Nombre Científico
            </Button>
          </Col>
        </Row>

        {/* Sección Subespecie */}
        <Row className="d-flex justify-content-between align-items-stretch">
          <Col md={6} className="d-flex flex-column">
            <Form.Group controlId="subspecies">
              <Form.Label>{t("NewGeneralData.Subspecies")}</Form.Label>
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
                  placeholder={"Selecciona una subespecie"}
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
            </Form.Group>
          </Col>
          <Col className="d-flex align-items-stretch">
            <Button
              onClick={handleCreateSubspecies}
              disabled={!newSubspecies}
              className="w-100"
            >
              Crear Subespecie
            </Button>
          </Col>
        </Row>
      </Row>

      <Row>
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
