'use client'
import {AuthProvider} from "../core/context/AuthContext";
import {I18nextProvider, initReactI18next} from "react-i18next";
import ComparisonProvider from "../core/context/ComparisonContext";
import i18next from "i18next";
import spanish from "../translations/es.json";
import english from "../translations/en.json";
i18next.use(initReactI18next).init({
    interpolation: {
        escapeValue: false,
    },
    lng: "es",
    resources: {
        es: {
            translation: spanish,
        },
        en: {
            translation: english,
        },
    },
});
export default function Providers ({children}: {children:React.ReactNode}) {
    return(
        <I18nextProvider i18n={i18next}>
            <ComparisonProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </ComparisonProvider>
        </I18nextProvider>
    )
}
