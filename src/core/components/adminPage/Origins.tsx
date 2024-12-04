import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import OriginRow from "./OriginRow";
import { useTranslation } from "react-i18next";

const Origins: React.FC = () => {
  const [rows, setRows] = useState<number[]>([0]);
  const [addresses, setAddresses] = useState<string[]>([]);
  const { t } = useTranslation("global");
  const addRow = () => {
    setRows((prevRows) => [...prevRows, prevRows.length]);
    setAddresses((prev) => [...prev, ""]); 
  };
  

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      setRows((prevRows) => prevRows.filter((_, i) => i !== index));
      setAddresses((prev) => prev.filter((_, i) => i !== index));
    } else {
      alert("Debe haber al menos un Origen.");
    }
  };

  const updateAddress = (index: number, address: string) => {
    setAddresses((prev) => {
      const updated = [...prev]; // Crear una copia del array
      updated[index] = address; // Actualizar el índice correspondiente
      console.log("Updated addresses array:", updated);
      return updated;
    });
  };
  
  

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>{t("Origins.Region")}</th>
            <th>{t("Origins.Province")}</th>
            <th>{t("Origins.Commune")}</th>
            <th>{t("Origins.Location")}</th>
            <th>{t("Origins.action")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((_, index) => (
            <OriginRow
              key={index}
              onRemove={() => removeRow(index)}
              isRemovable={rows.length > 1}
              onAddressChange={(address: string) =>
                updateAddress(index, address)
              }
            />
          ))}
        </tbody>
      </Table>

      <Button onClick={addRow} className="mt-3">
      {t("Origins.add")}
      </Button>
        <div className="mt-4">
          <h5>{t("Origins.selected")}</h5>
          <ListGroup>
            {addresses.map((address, index) => (
              <ListGroup.Item key={index}>
                {address || t("Origins.no_direction")}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
    </div>
  );
};

export default Origins;
