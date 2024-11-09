import { Accordion, Table, Button } from "react-bootstrap";
import nutritionalValue, {
  Vitamin,
  Mineral,
} from "../../types/nutritionalValue";
import { useState } from "react";

interface NutrientAccordionProps {
  data: nutritionalValue;
}

const NutrientAccordionModify: React.FC<NutrientAccordionProps> = ({ data }) => {
  const [editableRow, setEditableRow] = useState<{
    [key: string]: number | null;
  }>({
    energy: null,
    main_nutrients: null,
    micronutrients: null,
  });
  const [tableData, setTableData] = useState(data);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: string,
    index: number,
    field: string
  ) => {
    const newData = { ...tableData };
    (newData as any)[section][index][field] = e.target.value;
    console.log((newData as any)[section][index][field]);
    console.log(newData)
    setTableData(newData);
  };

  const handleEditClick = (section: string, index: number) => {
    setEditableRow({ ...editableRow, [section]: index });
  };

  const handleSaveClick = (section: string) => {
    setEditableRow({ ...editableRow, [section]: null });
  };

  const handleDeleteClick = (section: string, index: number) => {
    const newData = { ...tableData };
    (newData as any)[section] = (newData as any)[section].filter(
      (_: any, i: number) => i !== index
    );
    setTableData(newData);
  };
  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Energy value</Accordion.Header>
        <Accordion.Body>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Unidad</th>
                <th>Desviación</th>
                <th>Min</th>
                <th>Max</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {tableData.energy.map((energy, index) => (
                <tr key={index}>
                  {editableRow.energy === index ? (
                    <>
                      <td>
                        <input
                          type="text"
                          value={energy.type}
                          onChange={(e) =>
                            handleInputChange(e, "energy", index, "type")
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={energy.amount}
                          onChange={(e) =>
                            handleInputChange(e, "energy", index, "amount")
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={energy.unit}
                          onChange={(e) =>
                            handleInputChange(e, "energy", index, "unit")
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={energy.deviation ?? ""}
                          onChange={(e) =>
                            handleInputChange(e, "energy", index, "deviation")
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={energy.min ?? ""}
                          onChange={(e) =>
                            handleInputChange(e, "energy", index, "min")
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={energy.max ?? ""}
                          onChange={(e) =>
                            handleInputChange(e, "energy", index, "max")
                          }
                        />
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleSaveClick("energy")}
                        >
                          Guardar
                        </Button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{energy.type}</td>
                      <td>{energy.amount}</td>
                      <td>{energy.unit}</td>
                      <td>{energy.deviation}</td>
                      <td>{energy.min}</td>
                      <td>{energy.max}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => handleEditClick("energy", index)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteClick("energy", index)}
                          style={{ marginLeft: "5px" }}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Main nutrients</Accordion.Header>
        <Accordion.Body>
          {tableData.main_nutrients.map((nutrient, index) => (
            <div key={index}>
              {!nutrient.components || nutrient.components.length === 0 ? (
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Nutriente</th>
                      <th>Cantidad</th>
                      <th>Desviación</th>
                      <th>Min</th>
                      <th>Max</th>
                      <th>Tipo</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key={index}>
                      {editableRow.main_nutrients === index ? (
                        <>
                          <td>
                            <input
                              type="text"
                              value={nutrient.nutrient}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  "main_nutrients",
                                  index,
                                  "nutrient"
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={nutrient.amount}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  "main_nutrients",
                                  index,
                                  "amount"
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={nutrient.deviation ?? ""}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  "main_nutrients",
                                  index,
                                  "deviation"
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={nutrient.min ?? ""}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  "main_nutrients",
                                  index,
                                  "min"
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={nutrient.max ?? ""}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  "main_nutrients",
                                  index,
                                  "max"
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={nutrient.type}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  "main_nutrients",
                                  index,
                                  "type"
                                )
                              }
                            />
                          </td>
                          <td>
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleSaveClick("main_nutrients")}
                            >
                              Guardar
                            </Button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{nutrient.nutrient}</td>
                          <td>{nutrient.amount}</td>
                          <td>{nutrient.deviation}</td>
                          <td>{nutrient.min}</td>
                          <td>{nutrient.max}</td>
                          <td>{nutrient.type}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="warning"
                              onClick={() =>
                                handleEditClick("main_nutrients", index)
                              }
                            >
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() =>
                                handleDeleteClick("main_nutrients", index)
                              }
                              style={{ marginLeft: "5px" }}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </>
                      )}
                    </tr>
                  </tbody>
                </Table>
              ) : (
                <Accordion>
                  <Accordion.Item eventKey={`comp-${index}`}>
                    <Accordion.Header>
                      Components of {nutrient.nutrient}
                    </Accordion.Header>
                    <Accordion.Body>
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Unit</th>
                            <th>Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {nutrient.components.map((component, compIndex) => (
                            <tr key={`comp-${index}-${compIndex}`}>
                              <td>{component.type}</td>
                              <td>{component.amount ?? "N/A"}</td>
                              <td>N/A</td>
                              <td>
                                <Button
                                  size="sm"
                                  variant="warning"
                                  onClick={() =>
                                    handleEditClick("main_nutrients", compIndex)
                                  }
                                >
                                  Editar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() =>
                                    handleDeleteClick(
                                      "main_nutrients",
                                      compIndex
                                    )
                                  }
                                  style={{ marginLeft: "5px" }}
                                >
                                  Eliminar
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              )}
            </div>
          ))}
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>Micronutrients</Accordion.Header>
        <Accordion.Body>
          {Object.entries(tableData.micronutrients).map(
            ([micronutrientType, micronutrientList]) => (
              <div key={micronutrientType}>
                <h6>
                  {micronutrientType.charAt(0).toUpperCase() +
                    micronutrientType.slice(1)}
                </h6>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Micronutriente</th>
                      <th>Cantidad</th>
                      <th>Unidad</th>
                      <th>Desviación</th>
                      <th>Min</th>
                      <th>Max</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(micronutrientList as (Vitamin | Mineral)[]).map(
                      (micronutrient, index) => (
                        <tr key={index}>
                          {editableRow[micronutrientType] === index ? (
                            <>
                              <td>
                                <input
                                  type="text"
                                  value={
                                    "vitamin" in micronutrient
                                      ? micronutrient.vitamin
                                      : micronutrient.mineral
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      micronutrientType,
                                      index,
                                      "vitamin" in micronutrient
                                        ? "vitamin"
                                        : "mineral"
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={micronutrient.amount}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      micronutrientType,
                                      index,
                                      "amount"
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={micronutrient.unit}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      micronutrientType,
                                      index,
                                      "unit"
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={micronutrient.deviation ?? ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      micronutrientType,
                                      index,
                                      "deviation"
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={micronutrient.min ?? ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      micronutrientType,
                                      index,
                                      "min"
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={micronutrient.max ?? ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      micronutrientType,
                                      index,
                                      "max"
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <Button
                                  size="sm"
                                  variant="success"
                                  onClick={() =>
                                    handleSaveClick(micronutrientType)
                                  }
                                >
                                  Guardar
                                </Button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td>
                                {"vitamin" in micronutrient
                                  ? micronutrient.vitamin
                                  : micronutrient.mineral}
                              </td>
                              <td>{micronutrient.amount}</td>
                              <td>{micronutrient.unit}</td>
                              <td>{micronutrient.deviation}</td>
                              <td>{micronutrient.min}</td>
                              <td>{micronutrient.max}</td>
                              <td>
                                <Button
                                  size="sm"
                                  variant="warning"
                                  onClick={() =>
                                    handleEditClick(micronutrientType, index)
                                  }
                                >
                                  Editar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() =>
                                    handleDeleteClick(micronutrientType, index)
                                  }
                                  style={{ marginLeft: "5px" }}
                                >
                                  Eliminar
                                </Button>
                              </td>
                            </>
                          )}
                        </tr>
                      )
                    )}
                  </tbody>
                </Table>
              </div>
            )
          )}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default NutrientAccordionModify;
