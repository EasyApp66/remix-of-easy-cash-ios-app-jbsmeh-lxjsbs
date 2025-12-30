
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import LegalPage from "@/components/LegalPage";
import { ImpressumContent } from "@/constants/LegalContent";

export default function ImpressumScreen() {
  const { t } = useLanguage();
  
  return (
    <LegalPage 
      headerTitle={t('imprint')}
      content={ImpressumContent}
    />
  );
}
