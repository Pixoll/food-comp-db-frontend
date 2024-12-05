import React, { useState, useCallback, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import OriginRow from "./OriginRow";
import { useTranslation } from "react-i18next";

type OriginsProps = {
  updateOrigins: (ids: (number | null)[], addresses: string[]) => void;
  origins: (number | null)[];
};

const Origins: React.FC<OriginsProps> = ({ updateOrigins, origins }) => {
  const { t } = useTranslation("global");

  const [rows, setRows] = useState<number[]>([0]);
  const [addresses, setAddresses] = useState<string[]>([]);

  const [originIds, setOriginIds] = useState<(number | null)[]>(origins);

  const [uniqueOriginIds, setUniqueOriginIds] = useState<Set<number>>(
    new Set()
  );

  const handleAddRow = useCallback(() => {
    setRows((prevRows) => {
      const newRow = prevRows.length;
      return [...prevRows, newRow];
    });
    setAddresses((prevAddresses) => [...prevAddresses, ""]);
    setOriginIds((prevOriginIds) => [...prevOriginIds, null]);
  }, []);
  const handleRemoveLastRow = () => {
    if (rows.length > 1) {
      setRows((prevRows) => prevRows.slice(0, -1));
      setAddresses((prevAddresses) => prevAddresses.slice(0, -1));
      setOriginIds((prevOriginIds) => {
        const lastOriginId = prevOriginIds[prevOriginIds.length - 1];
        setUniqueOriginIds((prevUniqueIds) => {
          const updatedUniqueIds = new Set(prevUniqueIds);
          if (lastOriginId !== null) updatedUniqueIds.delete(lastOriginId);
          return updatedUniqueIds;
        });
        return prevOriginIds.slice(0, -1);
      });
    } else {
      alert("El mínimo de orígenes es 1");
    }
  };
  

  const handleAddressChange = useCallback((index: number, address: string) => {
    setAddresses((prevAddresses) => {
      const updatedAddresses = [...prevAddresses];
      updatedAddresses[index] = address;
      return updatedAddresses;
    });
  }, []);

  const handleIdsChange = (id: number | null, index: number) => {
    setOriginIds((prevOriginIds) => {
      const updatedIds = [...prevOriginIds];
      updatedIds[index] = id;
      return updatedIds;
    });

    setUniqueOriginIds((prevUniqueIds) => {
      const updatedUniqueIds = new Set(prevUniqueIds);
      const previousId = originIds[index];

      if (previousId !== null) {
        updatedUniqueIds.delete(previousId);
      }

      if (id !== null) {
        updatedUniqueIds.add(id);
      }

      return updatedUniqueIds;
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
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <OriginRow
              key={row}
              onAddressChange={(address: string) =>
                handleAddressChange(index, address)
              }
              onIdChange={(id: number | null, index: number) =>
                handleIdsChange(id, index)
              }
              index={index}
              originId={originIds[index]} 
              address={addresses[index]} 
            />
          ))}
        </tbody>
      </Table>

      <Button onClick={handleAddRow} className="mt-3">
        {t("Origins.Add")}
      </Button>

      <Button
        onClick={handleRemoveLastRow}
        className="mt-3 ml-3"
        variant="danger"
      >
        {t("Origins.RemoveLast")}
      </Button>

      <div className="mt-4">
        <h5>{t("Origins.Selected")}</h5>
        <ListGroup>
          {addresses.map((address, index) => (
            <ListGroup.Item key={index}>
              {address || t("Origins.NoDirection")}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default Origins;
