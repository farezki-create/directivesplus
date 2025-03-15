
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { TrustedPersonForm } from "./trusted-persons/TrustedPersonForm";
import { TrustedPersonsList } from "./trusted-persons/TrustedPersonsList";
import { useTrustedPersons } from "@/hooks/useTrustedPersons";
import { TrustedPersonPDFGenerator } from "./trusted-persons/TrustedPersonPDFGenerator";
import { useLanguage } from "@/hooks/useLanguage";
import { useState } from "react";

export const TrustedPersons = () => {
  const { persons, savePerson, removePerson } = useTrustedPersons();
  const { t } = useLanguage();
  const [showGenerator, setShowGenerator] = useState(false);

  const handleRemovePerson = async (id: string) => {
    await removePerson(id);
    setShowGenerator(true);
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{t('trustedPerson')}</h2>
      {persons.length === 0 && !showGenerator && <TrustedPersonForm onSave={savePerson} />}
      {persons.length > 0 && (
        <>
          <TrustedPersonsList
            persons={persons}
            onRemove={handleRemovePerson}
          />
          <Separator className="my-6" />
          <TrustedPersonPDFGenerator />
        </>
      )}
      {persons.length === 0 && showGenerator && (
        <>
          <div className="mb-6">
            <p className="text-gray-600 mb-4">{t('trustedPersonRemoved')}</p>
            <TrustedPersonPDFGenerator />
          </div>
          <Separator className="my-6" />
          <button 
            onClick={() => setShowGenerator(false)} 
            className="text-blue-500 hover:text-blue-700"
          >
            {t('addNewTrustedPerson')}
          </button>
        </>
      )}
    </Card>
  );
};
