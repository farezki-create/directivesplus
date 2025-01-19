import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { TrustedPersonForm } from "./trusted-persons/TrustedPersonForm";
import { TrustedPersonsList } from "./trusted-persons/TrustedPersonsList";
import { useTrustedPersons } from "@/hooks/useTrustedPersons";

export const TrustedPersons = () => {
  const { persons, savePerson, removePerson } = useTrustedPersons();

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Personne de confiance</h2>
      {persons.length === 0 && <TrustedPersonForm onSave={savePerson} />}
      {persons.length > 0 && (
        <>
          <Separator className="my-6" />
          <TrustedPersonsList
            persons={persons}
            onRemove={removePerson}
          />
        </>
      )}
    </Card>
  );
};