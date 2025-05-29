'use client'

import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Commune, Location, Province, Region } from "@/hooks";
import { Origin } from "@/types/SingleFoodResult";
import { Collection } from "@/utils/collection";
import OriginRow from "./OriginRow";

type OriginsProps = {
  originsForm: Origin[];
  data: {
    regions: Collection<number, Region>;
    provinces: Collection<number, Province>;
    communes: Collection<number, Commune>;
    locations: Collection<number, Location>;
  };
  updateOrigins: (origins: Origin[] | undefined) => void;
};

export default function Origins({
  data,
  updateOrigins,
  originsForm,
}: OriginsProps) {
  const { t } = useTranslation();

  const [rows, setRows] = useState<number[]>(
    originsForm.length > 0 ? originsForm.map((_, i) => i) : [0]
  );

  const [addresses, setAddresses] = useState<string[]>(
    originsForm.map((origin) => origin.name)
  );

  const [originIds, setOriginIds] = useState<(number | null)[]>(
    originsForm.map((origin) => origin.id)
  );
  useEffect(() => {
    const updatedOrigins: Origin[] = [];

    for (let index = 0; index < originIds.length; index++) {
      const id = originIds[index];
      const name = addresses[index];
      if (id === null || !name) {
        continue;
      }

      updatedOrigins.push({ id, name });
    }

    updateOrigins(updatedOrigins);
    // eslint-disable-next-line
  }, [addresses, originIds]);

  const handleAddRow = useCallback(() => {
    setRows((prevRows) => [...prevRows, prevRows.length]);
    setAddresses((prevAddresses) => [...prevAddresses, ""]);
    setOriginIds((prevOriginIds) => [...prevOriginIds, null]);
  }, []);

  const handleRemoveLastRow = () => {
    if (rows.length > 1) {
      setRows((prevRows) => prevRows.slice(0, -1));
      setAddresses((prevAddresses) => prevAddresses.slice(0, -1));
      setOriginIds((prevOriginIds) => prevOriginIds.slice(0, -1));
    } else {
      alert(t("Origins.minimum"));
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
            data={data}
            key={row}
            onAddressChange={(address: string) =>
              handleAddressChange(index, address)
            }
            onIdChange={(id: number | null) => handleIdsChange(id, index)}
            index={index}
            initialId={originIds[index] ?? -1}
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
        {t("Origins.Delete")}
      </Button>

      <div className="mt-4">
        <h5>{"Origines seleccionados"}</h5>
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
}
