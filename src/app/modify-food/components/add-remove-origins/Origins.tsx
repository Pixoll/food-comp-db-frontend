"use client";

import { useTranslation } from "@/context/I18nContext";
import type { Commune, Location, Province, Region } from "@/hooks";
import type { Origin } from "@/types/SingleFoodResult";
import { Collection } from "@/utils/collection";
import { type JSX, useCallback, useEffect, useRef, useState } from "react";
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
}: OriginsProps): JSX.Element {
    const { t } = useTranslation();

    const [rows, setRows] = useState<number[]>(
        originsForm.length > 0 ? originsForm.map((_, i) => i) : [0]
    );

    const [addresses, setAddresses] = useState<string[]>(
        originsForm.map((origin) => origin.name)
    );

    const [originIds, setOriginIds] = useState<Array<number | null>>(
        originsForm.map((origin) => origin.id)
    );

    useEffect(() => {
        const formIds = originsForm.map(origin => origin.id);
        const formAddresses = originsForm.map(origin => origin.name);

        const idsEqual = JSON.stringify(formIds) === JSON.stringify(originIds.filter(id => id !== null));
        const addressesEqual = JSON.stringify(formAddresses) === JSON.stringify(addresses.filter(Boolean));

        if (!idsEqual || !addressesEqual) {
            setRows(originsForm.length > 0 ? originsForm.map((_, i) => i) : [0]);
            setAddresses(originsForm.map((origin) => origin.name));
            setOriginIds(originsForm.map((origin) => origin.id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [originsForm]);

    const prevAddressesRef = useRef<string[]>([]);
    const prevOriginIdsRef = useRef<Array<number | null>>([]);

    useEffect(() => {
        const addressesChanged = JSON.stringify(addresses) !== JSON.stringify(prevAddressesRef.current);
        const idsChanged = JSON.stringify(originIds) !== JSON.stringify(prevOriginIdsRef.current);
        if (addressesChanged || idsChanged) {
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
            prevAddressesRef.current = [...addresses];
            prevOriginIdsRef.current = [...originIds];
        }
    }, [addresses, originIds, updateOrigins]);

    const handleAddRow = useCallback(() => {
        setRows((prevRows) => [...prevRows, prevRows.length]);
        setAddresses((prevAddresses) => [...prevAddresses, ""]);
        setOriginIds((prevOriginIds) => [...prevOriginIds, null]);
    }, []);

    const handleRemoveLastRow = (): void => {
        if (rows.length > 1) {
            setRows((prevRows) => prevRows.slice(0, -1));
            setAddresses((prevAddresses) => prevAddresses.slice(0, -1));
            setOriginIds((prevOriginIds) => prevOriginIds.slice(0, -1));
        } else {
            alert(t.origins.minimum);
        }
    };

    const handleAddressChange = useCallback((index: number, address: string) => {
        setAddresses((prevAddresses) => {
            const updatedAddresses = [...prevAddresses];
            updatedAddresses[index] = address;
            return updatedAddresses;
        });
    }, []);

    const handleIdsChange = (id: number | null, index: number): void => {
        setOriginIds((prevOriginIds) => {
            const updatedIds = [...prevOriginIds];
            updatedIds[index] = id;
            return updatedIds;
        });
    };

    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse rounded-[8px] overflow-hidden">
                    <thead>
                        <tr className="bg-[#f7fef7]">
                            <th
                                className="
                                py-[12px]
                                px-[16px]
                                text-left
                                font-[600]
                                text-[#064e3b]
                                border-b-[2px]
                                border-[#047857]
                                "
                            >
                                {t.origins.region}
                            </th>
                            <th
                                className="
                                py-[12px]
                                px-[16px]
                                text-left
                                font-[600]
                                text-[#064e3b]
                                border-b-[2px]
                                border-[#047857]
                                "
                            >
                                {t.origins.province}
                            </th>
                            <th
                                className="
                                py-[12px]
                                px-[16px]
                                text-left
                                font-[600]
                                text-[#064e3b]
                                border-b-[2px]
                                border-[#047857]
                                "
                            >
                                {t.origins.commune}
                            </th>
                            <th
                                className="
                                py-[12px]
                                px-[16px]
                                text-left
                                font-[600]
                                text-[#064e3b]
                                border-b-[2px]
                                border-[#047857]
                                "
                            >
                                {t.origins.location}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5f1eb]">
                        {rows.map((row, index) => (
                            <OriginRow
                                data={data}
                                key={row}
                                onAddressChange={(address: string) => handleAddressChange(index, address)}
                                onIdChange={(id: number | null) => handleIdsChange(id, index)}
                                index={index}
                                initialId={originIds[index] ?? -1}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex mt-[16px] space-x-[12px]">
                <button
                    onClick={handleAddRow}
                    className="
                    px-[16px]
                    py-[8px]
                    bg-[#047857]
                    text-[white]
                    rounded-[4px]
                    border-none
                    hover:bg-[#065f46]
                    transition-colors
                    duration-[200ms]
                    "
                >
                    {t.origins.add}
                </button>

                <button
                    onClick={handleRemoveLastRow}
                    className="
                    px-[16px]
                    py-[8px]
                    bg-[#ef4444]
                    text-[white]
                    rounded-[4px]
                    border-none
                    hover:bg-[#dc2626]
                    transition-colors
                    duration-[200ms]
                    "
                >
                    {t.origins.delete}
                </button>
            </div>

            <div className="mt-[24px] bg-[white] rounded-[8px] p-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                <h5 className="text-[18px] font-[600] text-[#064e3b] mb-[12px]">
                    {"Orígenes seleccionados"}
                </h5>

                {addresses.length > 0 ? (
                    <ul className="divide-y divide-[#e5f1eb] rounded-[4px] border border-[#e5f1eb]">
                        {addresses.map((address, index) => (
                            <li
                                key={index}
                                className="
                                py-[12px]
                                px-[16px]
                                bg-[white]
                                hover:bg-[#f0fdf4]
                                transition-colors
                                duration-[200ms]
                                "
                            >
                                {address
                                  || <span className="text-[#6b7280] italic">
                                      {t.origins.noneSelected}
                                  </span>
                                }
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-[#6b7280] italic">
                        {t.origins.noneSelected}
                    </p>
                )}
            </div>
        </div>
    );
}
