
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import LegalPage from "@/components/LegalPage";
import { NutzungsbedingungenContent } from "@/constants/LegalContent";

export default function NutzungsbedingungenScreen() {
  const { t } = useLanguage();
  
  return (
    <LegalPage 
      headerTitle={t('terms')}
      content={NutzungsbedingungenContent}
    />
  );
}
