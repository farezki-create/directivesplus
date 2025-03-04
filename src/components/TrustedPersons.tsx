
import { Card } from "./ui/card";
import { TrustedPersonForm } from "./trusted-persons/TrustedPersonForm";
import { TrustedPersonsList } from "./trusted-persons/TrustedPersonsList";
import { useTrustedPersons } from "@/hooks/useTrustedPersons";
import { useLanguage } from "@/hooks/useLanguage";
import { TrustedPersonsHeader } from "./trusted-persons/TrustedPersonsHeader";
import { TrustedPersonsActions } from "./trusted-persons/TrustedPersonsActions";

export const TrustedPersons = () => {
  const { persons, savePerson, removePerson } = useTrustedPersons();
  const { t } = useLanguage();

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <TrustedPersonsHeader title={t('trustedPerson')} />
      
      {persons.length === 0 && <TrustedPersonForm onSave={savePerson} />}
      
      {persons.length > 0 && (
        <>
          <TrustedPersonsList
            persons={persons}
            onRemove={removePerson}
          />
          <TrustedPersonsActions />
        </>
      )}
    </Card>
  );
};
