import type { XlsxIssue } from "@/api";
import type { I18nObject } from "@/context/I18nContext";

/**
 * Texto de un aviso de la importación en el idioma actual. El backend manda el tipo y los datos; el texto se arma
 * aquí para que salga traducido.
 */
export function formatIssue(t: I18nObject, issue: XlsxIssue): string {
    const x = t.importXlsx;
    const { column, value, max } = issue;

    switch (issue.type) {
        case "invalid_code":
            return x.issue.invalid_code(value);
        case "duplicate_code":
            return x.issue.duplicate_code();
        case "missing_group":
            return x.issue.missing_group();
        case "unknown_group":
            return x.issue.unknown_group(value);
        case "missing_name":
            return x.issue.missing_name();
        case "too_long": {
            const field = issue.field && issue.field in x.fields
                ? x.fields[issue.field as keyof typeof x.fields]
                : issue.field ?? "";
            return x.issue.too_long(field, max);
        }
        case "invalid_portion":
            return x.issue.invalid_portion(value);
        case "not_in_composition":
            return x.issue.not_in_composition();
        case "no_measurements":
            return x.issue.no_measurements();
        case "non_numeric_value":
            return x.issue.non_numeric_value(column, value);
        case "negative_value":
            return x.issue.negative_value(column, value);
        case "out_of_range":
            return x.issue.out_of_range(column, value);
        case "invalid_deviation":
            return x.issue.invalid_deviation(column, value);
        case "deviation_without_average":
            return x.issue.deviation_without_average(column);
        case "portion_unit":
            return x.issue.portion_unit(value);
        case "no_reference":
            return x.issue.no_reference();
        case "rows_without_food":
            return x.issue.rows_without_food(value);
        case "duplicate_composition_row":
            return x.issue.duplicate_composition_row(value);
        case "missing_metadata_sheet":
            return x.issue.missing_metadata_sheet();
    }
}
