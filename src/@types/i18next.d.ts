import 'i18next';
import spanish from "../translations/es.json";

declare module "i18next" {
  // noinspection JSUnusedGlobalSymbols
  interface CustomTypeOptions {
    defaultNs: "global";
    resources: {
      global: typeof spanish;
    };
  }
}
