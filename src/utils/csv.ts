/**
 * Exportación a CSV en el navegador (reemplaza la exportación a Excel que dependía del endpoint /xlsx,
 * que ya no existe en el backend).
 *
 * En español se usa ";" como separador y coma decimal, que es lo que espera Excel con configuración regional
 * de Chile; en inglés, "," y punto decimal.
 */
export type CsvCell = string | number | null | undefined;

export function toCsv(rows: CsvCell[][], language: string): string {
    const separator = language === "es" ? ";" : ",";

    const formatCell = (cell: CsvCell): string => {
        if (cell === null || cell === undefined) return "";

        const text = typeof cell === "number"
            ? (language === "es" ? cell.toString().replace(".", ",") : cell.toString())
            : cell;

        return /[";,\n\r]/.test(text) ? `"${text.replace(/"/g, "\"\"")}"` : text;
    };

    return rows.map(row => row.map(formatCell).join(separator)).join("\r\n");
}

export function downloadCsv(fileName: string, rows: CsvCell[][], language: string): void {
    // BOM para que Excel reconozca UTF-8 (tildes y ñ)
    const blob = new Blob(["﻿" + toCsv(rows, language)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
}
