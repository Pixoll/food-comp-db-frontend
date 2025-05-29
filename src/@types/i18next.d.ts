import "i18next";
import spanish from "@/translations/es.json";
import english from "@/translations/en.json";

declare module "i18next" {
  // noinspection JSUnusedGlobalSymbols
  interface CustomTypeOptions {
    resources: {
      translation: (typeof spanish) & (typeof english);
    };
  }
}
