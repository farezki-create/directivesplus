
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { TrustedPersonForm } from "./trusted-persons/TrustedPersonForm";
import { TrustedPersonsList } from "./trusted-persons/TrustedPersonsList";
import { useTrustedPersons } from "@/hooks/useTrustedPersons";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export const TrustedPersons = () => {
  const { persons, savePerson, removePerson } = useTrustedPersons();
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{t('trustedPerson')}</h2>
      {persons.length === 0 ? (
        <TrustedPersonForm onSave={savePerson} />
      ) : (
        <>
          <TrustedPersonsList
            persons={persons}
            onRemove={removePerson}
          />
          <Separator className="my-6" />
          {showForm ? (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Ajouter une autre personne de confiance</h3>
              <TrustedPersonForm 
                onSave={async (person) => {
                  await savePerson(person);
                  setShowForm(false);
                }} 
              />
            </div>
          ) : (
            <Button 
              onClick={() => setShowForm(true)} 
              variant="outline" 
              className="w-full flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter une autre personne de confiance
            </Button>
          )}
        </>
      )}
    </Card>
  );
};
