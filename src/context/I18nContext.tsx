"use client";

import i18n from "@/i18n";
import { createContext, type JSX, type ReactNode, useContext, useEffect, useState } from "react";

export type Language = keyof typeof i18n;
export type I18nObject = typeof i18n[Language];

type I18nContextType = {
    t: I18nObject;
    language: Language;
    setLanguage: (lang: Language) => void;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

type I18nProviderProps = {
    children: ReactNode;
};

const LANG_KEY = "lang";

export function I18nProvider({ children }: I18nProviderProps): JSX.Element {
    const [language, setLanguage] = useState<Language>("es");
    const t = i18n[language];

    useEffect(() => {
        setLanguage(localStorage.getItem(LANG_KEY) as Language | null ?? "es");
    }, []);

    const onLanguageChange = (lang: Language): void => {
        localStorage.setItem(LANG_KEY, lang);
        setLanguage(lang);
    };

    return (
        <I18nContext.Provider value={{ t, language, setLanguage: onLanguageChange }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useTranslation(): I18nContextType {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error("useTranslation must be used within an I18nProvider");
    }

    return context;
}
