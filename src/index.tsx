import i18next from "i18next";
import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/_index.css"
import { I18nextProvider, initReactI18next } from "react-i18next";
import App from "./App";
import { ToastProvider } from "./core/context/ToastContext";
import spanish from "./translations/es.json";
import english from "./translations/en.json";

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

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <ToastProvider>
        <App/>
      </ToastProvider>
    </I18nextProvider>
  </React.StrictMode>
);
