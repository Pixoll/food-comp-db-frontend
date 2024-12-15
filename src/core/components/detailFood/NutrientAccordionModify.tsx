import { Accordion, Table, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import "../../../assets/css/_nutrientAccordion.css"
import {
  NutrientsValue,
  NutrientMeasurement,
  NutrientMeasurementWithComponents
} from "../../types/SingleFoodResult";
import { BsPencil } from "react-icons/bs";
import CenteredModifyModal from "./CenteredModifyModal";
import { useTranslation } from "react-i18next";

interface NutrientAccordionProps {
  data: NutrientsValue;
  onUpdate: (updatedData: NutrientsValue) => void;
}

const NutrientAccordionModify: React.FC<NutrientAccordionProps> = ({
  data,
  onUpdate
}) => {
  const {t} = useTranslation();
  const [selectedNutrient, setSelectedNutrient] =
    useState<NutrientMeasurement | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = (nutrient: NutrientMeasurement) => {
    setSelectedNutrient(nutrient);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNutrient(null);
  };
  const [nutrientData, setNutrientData] = useState<NutrientsValue>(data);

  const handleSave = (
  updatedNutrient: NutrientMeasurement | NutrientMeasurementWithComponents
) => {
  setNutrientData((prevData) => {
    const updateCategory = (
      category: NutrientMeasurementWithComponents[] | NutrientMeasurement[]
    ) =>
      category.map((item) =>
        item.nutrientId === updatedNutrient.nutrientId
          ? { ...item, ...updatedNutrient }
          : item
      );

    const updatedData = {
      ...prevData,
      energy: updateCategory(prevData.energy),
      mainNutrients: prevData.mainNutrients.map((nutrient) => {
        if (nutrient.nutrientId === updatedNutrient.nutrientId) {
          return { ...nutrient, ...updatedNutrient };
        }
        if (nutrient.components) {
          return {
            ...nutrient,
            components: updateCategory(nutrient.components),
          };
        }
        return nutrient;
      }),
      micronutrients: {
        vitamins: updateCategory(prevData.micronutrients.vitamins),
        minerals: updateCategory(prevData.micronutrients.minerals),
      },
    };

    onUpdate(updatedData);
    return updatedData;
  });
};
useEffect(() => {
  setNutrientData(data);
}, [data]);

  return (
    <>
      <Accordion className="mi-accordion" defaultActiveKey={["0", "1", "2"]} >
        <Accordion.Item eventKey="0">
          <Accordion.Header>{t('nutrientAccordion.Energy')}</Accordion.Header>
          <Accordion.Body>
            <Table responsive="sm">
              <thead>
                <tr>
                  <th>{t('nutrientAccordion.name')} </th>
                  <th>{t('nutrientAccordion.modify')}</th>
                </tr>
              </thead>
              <tbody>
                {data.energy.map((energy, index) => (
                  <tr key={index}>
                    <td>{energy.name}({energy.measurementUnit})</td>
                    <td>
                      <Button
                        variant="link"
                        onClick={() => handleOpenModal(energy)}
                      >
                        <BsPencil size={30} color="#caca16" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>{t('nutrientAccordion.Main')}</Accordion.Header>
          <Accordion.Body>
            <Table responsive="sm">
              <thead>
                <tr>
                <th>{t('nutrientAccordion.name')} </th>
                <th>{t('nutrientAccordion.modify')}</th>
                </tr>
              </thead>
              <tbody>
                {data.mainNutrients
                  .filter(
                    (nutrient) =>
                      !nutrient.components || nutrient.components.length === 0
                  )
                  .map((nutrient, index) => (
                    <tr key={index}>
                      <td>{nutrient.name}</td>
                      <td>
                        <Button
                          variant="link"
                          onClick={() => handleOpenModal(nutrient)}
                        >
                          <BsPencil size={30} color="#caca16" />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            {data.mainNutrients
              .filter(
                (nutrient) =>
                  nutrient.components && nutrient.components.length > 0
              )
              .map((nutrient, index) => (
                <Accordion
                 className="mi-accordion"
                  key={`sub-${index}`}
                  defaultActiveKey={`sub-${index}`}
                >
                  <Accordion.Item eventKey={`sub-${index}`}>
                    <Accordion.Header>{nutrient.name}</Accordion.Header>
                    <Accordion.Body>
                      <Table responsive="sm">
                        <thead>
                          <tr>
                          <th>{t('nutrientAccordion.name')} </th>
                          <th>{t('nutrientAccordion.modify')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {nutrient.components.map((subComponent, subIndex) => (
                            <tr key={subIndex}>
                              <td>{subComponent.name}</td>
                              <td>
                                <Button
                                  variant="link"
                                  onClick={() => handleOpenModal(subComponent)}
                                >
                                  <BsPencil size={30} color="#caca16" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td>
                              <strong>{nutrient.name}(Total)</strong>
                            </td>
                            <td>
                              <Button
                                variant="link"
                                onClick={() => handleOpenModal(nutrient)}
                              >
                                <BsPencil size={30} color="#caca16" />
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              ))}
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>{t('nutrientAccordion.Micronutrients')}</Accordion.Header>
          <Accordion.Body>
            <Table responsive="sm">
              <thead>
                <tr>
                <th>{t('nutrientAccordion.name')} </th>
                <th>{t('nutrientAccordion.modify')}</th>
                </tr>
              </thead>
              <tbody>
                {data.micronutrients.minerals.map((micronutrient, index) => (
                  <tr key={index}>
                    <td>{micronutrient.name}</td>
                    <td>
                      <Button
                        variant="link"
                        onClick={() => handleOpenModal(micronutrient)}
                      >
                        <BsPencil size={30} color="#caca16" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {data.micronutrients.vitamins.map((micronutrient, index) => (
                  <tr key={index}>
                    <td>{micronutrient.name}</td>

                    <td>
                      <Button
                        variant="link"
                        onClick={() => handleOpenModal(micronutrient)}
                      >
                        <BsPencil size={30} color="#caca16" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {showModal && selectedNutrient && (
        <CenteredModifyModal
          data={selectedNutrient}
          onHide={handleCloseModal}
          onSave={handleSave} 
        />
      )}
    </>
  );
};

export default NutrientAccordionModify;
