
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import LegalPage from "@/components/LegalPage";
import { AGBContent } from "@/constants/LegalContent";

export default function AGBScreen() {
  const { t } = useLanguage();
  
  return (
    <LegalPage 
      headerTitle={t('agb')}
      content={AGBContent}
    />
  );
}
