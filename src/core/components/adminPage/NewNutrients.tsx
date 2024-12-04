import React, { useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { NutrientMeasurementForm , NutrientSummary, getNutrientNameById} from "../../../pages/AdminPage";

type NewNutrientsProps = {
  nutrients: NutrientMeasurementForm[];
  onNutrientUpdate: (updatedNutrient: NutrientMeasurementForm) => void;
  nameAndIdNutrients: NutrientSummary[]
};

const NewNutrients: React.FC<NewNutrientsProps> = ({ nutrients, onNutrientUpdate , nameAndIdNutrients}) => {
  const [editingNutrientId, setEditingNutrientId] = useState<number | null>(null);
  const [formData, setFormData] = useState<NutrientMeasurementForm | null>(null);

  const startEditing = (nutrient: NutrientMeasurementForm) => {
    setEditingNutrientId(nutrient.nutrientId);
    setFormData({
      ...nutrient,
      average: nutrient.average || null,
      deviation: nutrient.deviation || null,
      min: nutrient.min || null,
      max: nutrient.max || null,
      sampleSize: nutrient.sampleSize || null,
      dataType: nutrient.dataType || null,
      referenceCodes: nutrient.referenceCodes || [],
    });
  };

  const handleInputChange = (field: keyof NutrientMeasurementForm, value: any) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const saveChanges = () => {
    if (formData && editingNutrientId !== null) {
      onNutrientUpdate(formData);
      setEditingNutrientId(null);
      setFormData(null);
    }
  };

  const cancelEditing = () => {
    setEditingNutrientId(null);
    setFormData(null);
  };

  return (
    <div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Promedio</th>
            <th>Desviación</th>
            <th>Mínimo</th>
            <th>Máximo</th>
            <th>Tamaño de muestra</th>
            <th>Tipo de dato</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {nutrients.map((nutrient) => (
            <tr key={nutrient.nutrientId}>
              {editingNutrientId === nutrient.nutrientId ? (
                <>
                  <td>{getNutrientNameById(nutrient.nutrientId, nameAndIdNutrients)}</td>
                  <td>
                    <Form.Control
                      type="number"
                      value={formData?.average || ""}
                      onChange={(e) => handleInputChange("average", +e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={formData?.deviation || ""}
                      onChange={(e) => handleInputChange("deviation", +e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={formData?.min || ""}
                      onChange={(e) => handleInputChange("min", +e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={formData?.max || ""}
                      onChange={(e) => handleInputChange("max", +e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={formData?.sampleSize || ""}
                      onChange={(e) => handleInputChange("sampleSize", +e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Select
                      value={formData?.dataType || "analytic"}
                      onChange={(e) => handleInputChange("dataType", e.target.value)}
                    >
                      <option value="analytic">Analítico</option>
                      <option value="calculated">Calculado</option>
                      <option value="assumed">Asumido</option>
                      <option value="borrowed">Prestado</option>
                    </Form.Select>
                  </td>
                  <td>
                    <Button variant="success" onClick={saveChanges}>
                      Guardar
                    </Button>{" "}
                    <Button variant="danger" onClick={cancelEditing}>
                      Cancelar
                    </Button>
                  </td>
                </>
              ) : (
                <>
                  <td>{getNutrientNameById(nutrient.nutrientId, nameAndIdNutrients)}</td>
                  <td>{nutrient.average || "---"}</td>
                  <td>{nutrient.deviation || "---"}</td>
                  <td>{nutrient.min || "---"}</td>
                  <td>{nutrient.max || "---"}</td>
                  <td>{nutrient.sampleSize || "---"}</td>
                  <td>
                    {nutrient.dataType
                      ? nutrient.dataType.charAt(0).toUpperCase() +
                        nutrient.dataType.slice(1)
                      : "---"}
                  </td>
                  <td>
                    <Button variant="warning" onClick={() => startEditing(nutrient)}>
                      Editar
                    </Button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default NewNutrients;
