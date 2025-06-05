import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./en";
import { es } from "./es";

i18next.use(initReactI18next).init({
    interpolation: {
        escapeValue: false,
    },
    lng: "es",
    resources: {
        es: {
            translation: es,
        },
        en: {
            translation: en,
        },
    },
});

export default i18next;

declare module "i18next" {
    // noinspection JSUnusedGlobalSymbols
    interface CustomTypeOptions {
        resources: {
            translation: (typeof es) & (typeof en);
        };
    }
}

type I18NObject = {
    [key: string]: string | I18NObject;
};

type JoinKeys<K extends string, P extends string> = `${K}.${P}`;

type I18NKeys<T extends object> = {
    [K in keyof T & string]: T[K] extends object
        ? K | JoinKeys<K, I18NKeys<T[K]>>
        : T[K] extends string
            ? K
            : never
}[keyof T & string];

type EsKeys = I18NKeys<typeof es>;
type EnKeys = I18NKeys<typeof en>;

type MissingKeys =
    | Exclude<EsKeys, EnKeys>
    | Exclude<EnKeys, EsKeys>;

/*
 * Ensure build is not possible if:
 *
 * - i18n object has illegal values
 * - some keys are missing in either translation dictionary
 */

// noinspection BadExpressionStatementJS
(es satisfies I18NObject);
// noinspection BadExpressionStatementJS
(en satisfies I18NObject);
// noinspection BadExpressionStatementJS
({} satisfies Record<MissingKeys, never>);
