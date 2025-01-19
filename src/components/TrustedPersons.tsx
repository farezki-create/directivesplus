import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { TrustedPersonForm } from "./trusted-persons/TrustedPersonForm";
import { TrustedPersonsList } from "./trusted-persons/TrustedPersonsList";
import { useTrustedPersons } from "@/hooks/useTrustedPersons";
import { TrustedPersonPDFGenerator } from "./trusted-persons/TrustedPersonPDFGenerator";

export const TrustedPersons = () => {
  const { persons, savePerson, removePerson } = useTrustedPersons();

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Personne de confiance</h2>
      {persons.length === 0 && <TrustedPersonForm onSave={savePerson} />}
      {persons.length > 0 && (
        <>
          <TrustedPersonsList
            persons={persons}
            onRemove={removePerson}
          />
          <Separator className="my-6" />
          <TrustedPersonPDFGenerator />
        </>
      )}
    </Card>
  );
};