
import { useState, useEffect } from "react";
import { TextEditor } from "./TextEditor";
import { useLanguage } from "@/hooks/useLanguage";

interface FreeTextSectionProps {
  freeText: string;
  onTextChange: (text: string) => void;
}

export function FreeTextSection({ freeText, onTextChange }: FreeTextSectionProps) {
  const { t } = useLanguage();
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{t('synthesisTitle')}</h2>
      <p className="text-sm text-gray-500 mb-4">
        {t('synthesisDescription')}
      </p>
      
      <TextEditor 
        value={freeText} 
        onChange={onTextChange} 
        placeholder={t('writeSynthesis')}
      />
    </div>
  );
}
