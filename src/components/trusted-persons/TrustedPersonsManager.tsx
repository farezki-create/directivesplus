
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Save } from "lucide-react";
import { TrustedPersonCard } from "./TrustedPersonCard";
import { useTrustedPersons } from "./useTrustedPersons";

const TrustedPersonsManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const {
    trustedPersons,
    loading,
    saving,
    handleAddPerson,
    handleChange,
    handleRemove,
    handleSave
  } = useTrustedPersons(user?.id);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/rediger")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Retour à la rédaction
        </Button>
      </div>

      <h1 className="text-2xl font-bold text-center mb-6">
        Personne de Confiance
      </h1>

      <div className="text-center mb-8">
        <p className="text-gray-600 mb-4">
          La personne de confiance est une personne que vous désignez pour vous accompagner dans vos démarches médicales et qui sera consultée en priorité si vous n'êtes plus en mesure d'exprimer votre volonté.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {trustedPersons.map((person, index) => (
              <TrustedPersonCard
                key={person.id || index}
                person={person}
                index={index}
                onChange={handleChange}
                onRemove={handleRemove}
              />
            ))}
          </div>

          <div className="flex flex-col gap-4 items-center">
            <Button
              onClick={handleAddPerson}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Ajouter une personne de confiance
            </Button>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-directiveplus-600 hover:bg-directiveplus-700"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Enregistrer
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TrustedPersonsManager;
