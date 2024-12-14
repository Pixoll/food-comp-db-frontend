import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/_index.css'
import App from './App';
import {I18nextProvider} from "react-i18next";
import i18next from 'i18next';
import global_español from "./translations/español/global_es.json";
import global_ingles from "./translations/ingles/global_en.json";
import { ToastProvider } from './core/context/ToastContext';

i18next.init({
  interpolation:{escapeValue: false },
  lng:"es",
  resources:{
    es:{
      global:global_español
    },
    en:{
      global:global_ingles
    }
  }
})
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
    <ToastProvider>
      <App />
      </ToastProvider>
    </I18nextProvider>
  </React.StrictMode>
);
