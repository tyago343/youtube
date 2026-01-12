import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { sharedResources } from "@shared/i18n/i18n.shared";

i18n.use(initReactI18next).init({
  resources: sharedResources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
