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
