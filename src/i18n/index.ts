import { en } from "./en";
import { es } from "./es";

const i18n = {
    en,
    es,
} as const;

export default i18n;

type I18nObject = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: string | I18nObject | ((...args: any[]) => string);
};

type JoinKeys<K extends string, P extends string> = `${K}.${P}`;

type I18nKeys<T extends object> = {
    [K in keyof T & string]: T[K] extends object
        ? K | JoinKeys<K, I18nKeys<T[K]>>
        : T[K] extends string
            ? K
            : never
}[keyof T & string];

type EsKeys = I18nKeys<typeof es>;
type EnKeys = I18nKeys<typeof en>;

/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
// noinspection TypeScriptDuplicateUnionOrIntersectionType
type MissingKeys =
    | Exclude<EsKeys, EnKeys>
    | Exclude<EnKeys, EsKeys>;
/* eslint-enable @typescript-eslint/no-redundant-type-constituents */

/*
 * Ensure build is not possible if:
 *
 * - i18n object has illegal values
 * - some keys are missing in either translation dictionary
 */

// noinspection BadExpressionStatementJS
(es satisfies I18nObject);
// noinspection BadExpressionStatementJS
(en satisfies I18nObject);
// noinspection BadExpressionStatementJS
({} satisfies Record<MissingKeys, never>);
