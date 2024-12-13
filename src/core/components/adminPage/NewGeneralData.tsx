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

  const [newGroup, setNewGroup] = useState<string | null>(null);
  const [newType, setNewType] = useState<string | null>(null);
  const [newScientificName, setNewScientificName] = useState<string | null>(
    null
  );
  const [newSubspecies, setNewSubspecies] = useState<string | null>(null);

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

  const handleCreateGroup = (groupName: string) => {
    if (!token) {
      alert("No authentication token available");
      return;
    }
    console.log(groupName);
    makeRequest(
      "post",
      "/groups",
      { groupName },
      token,
      (response) => {
        const newGroupId = response.data.id;
        const updatedFormData = {
          ...formData,
          groupId: newGroupId,
        };
        setFormData(updatedFormData);
        onUpdate(updatedFormData);
      },
      (error) => {
        console.error("Error creating group:", error);
        alert("fallo al crear el grupo");
      }
    );
  };
  console.log(formData);
  const handleCreateType = (typeName: string) => {
    if (!token) {
      alert("No authentication token available");
      return;
    }
    makeRequest(
      "post",
      "/types",
      { name: typeName },
      token,
      (response) => {
        const newTypeId = response.data.id;
        const updatedFormData = {
          ...formData,
          typeId: newTypeId,
        };
        setFormData(updatedFormData);
        onUpdate(updatedFormData);
      },
      (error) => {
        console.error("Error creating type:", error);
        alert("Failed to create type");
      }
    );
  };

  const handleCreateScientificName = (scientificName: string) => {
    if (!token) {
      alert("No authentication token available");
      return;
    }

    makeRequest(
      "post",
      "/scientific_names",
      { name: scientificName },
      token,
      (response) => {
        const newScientificNameId = response.data.id;
        const updatedFormData = {
          ...formData,
          scientificNameId: newScientificNameId,
        };
        setFormData(updatedFormData);
        onUpdate(updatedFormData);
      },
      (error) => {
        console.error("Error creating scientific name:", error);
        alert("Failed to create scientific name");
      }
    );
  };

  const handleCreateSubspecies = (subspeciesName: string) => {
    if (!token) {
      alert("No authentication token available");
      return;
    }

    makeRequest(
      "post",
      "/subspecies",
      { name: subspeciesName },
      token,
      (response) => {
        const newSubspeciesId = response.data.id;
        const updatedFormData = {
          ...formData,
          subspeciesId: newSubspeciesId,
        };
        setFormData(updatedFormData);
        onUpdate(updatedFormData);
      },
      (error) => {
        console.error("Error creating subspecies:", error);
        alert("Failed to create subspecies");
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

      <Col md={6}>
        <Form.Label column sm={2}>
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
                setFormData(updatedFormData);
                onUpdate(updatedFormData);
              } else if (name) {
                handleCreateGroup(name);
              }
            }}
          />
        )}
      </Col>

      <Col md={6}>
        <Form.Label column sm={2}>
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
                setFormData(updatedFormData);
                onUpdate(updatedFormData);
              } else if (name) {
                handleCreateType(name);
              }
            }}
          />
        )}
      </Col>
      <Row>
        <Col md={6}>
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
                placeholder={"Selecciona un nombre cientifico"}
                onSelect={(id, name) => {
                  if (id !== undefined) {
                    const updatedFormData = {
                      ...formData,
                      scientificNameId: id,
                    };
                    setFormData(updatedFormData);
                    onUpdate(updatedFormData);
                  } else if (name) {
                    handleCreateScientificName(name);
                  }
                }}
              />
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
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
                    handleCreateSubspecies(name);
                  }
                }}
              />
            )}
          </Form.Group>
        </Col>
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
