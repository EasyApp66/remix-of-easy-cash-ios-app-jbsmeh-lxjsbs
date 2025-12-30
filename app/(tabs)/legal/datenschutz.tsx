
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import LegalPage from "@/components/LegalPage";
import { DatenschutzContent } from "@/constants/LegalContent";

export default function DatenschutzScreen() {
  const { t } = useLanguage();
  
  return (
    <LegalPage 
      headerTitle={t('privacy')}
      content={DatenschutzContent}
    />
  );
}
