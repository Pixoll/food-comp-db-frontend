import i18next from "i18next";
import { StrictMode } from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./core/context/AuthContext";
import ComparisonProvider from "./core/context/ComparisonContext";
import { ToastProvider } from "./core/context/ToastContext";
import { AppRouter } from "./core/routes/AppRouter";
import english from "./translations/en.json";
import spanish from "./translations/es.json";
import "./assets/css/_App.css";

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

function App() {
  return (
    <StrictMode>
      <I18nextProvider i18n={i18next}>
        <ToastProvider>
          <BrowserRouter>
            <ComparisonProvider>
              <AuthProvider>
                <AppRouter/>
              </AuthProvider>
            </ComparisonProvider>
          </BrowserRouter>
        </ToastProvider>
      </I18nextProvider>
    </StrictMode>
  );
}

export default App;
