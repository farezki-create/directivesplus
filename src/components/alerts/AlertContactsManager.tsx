
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Save } from "lucide-react";
import { AlertContactCard } from "./AlertContactCard";
import { useAlertContacts } from "@/hooks/alerts/useAlertContacts";

const AlertContactsManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  console.log("AlertContactsManager - userId:", user?.id);
  
  const {
    alertContacts,
    loading,
    saving,
    handleAddContact,
    handleChange,
    handleRemove,
    handleSave
  } = useAlertContacts(user?.id);

  if (!user) {
    console.error("No user found in AlertContactsManager");
    return (
      <div className="text-center p-8">
        <p>Utilisateur non connecté. Veuillez vous connecter pour gérer vos contacts d'alerte.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Retour au profil
        </Button>
      </div>

      <h1 className="text-2xl font-bold text-center mb-6">
        Contacts d'Alerte
      </h1>

      <div className="text-center mb-8">
        <p className="text-gray-600 mb-4">
          Configurez vos contacts d'alerte qui seront prévenus automatiquement en cas de symptômes critiques.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {alertContacts.map((contact, index) => (
              <AlertContactCard
                key={contact.id || index}
                contact={contact}
                index={index}
                onChange={handleChange}
                onRemove={handleRemove}
              />
            ))}
          </div>

          <div className="flex flex-col gap-4 items-center">
            <Button
              onClick={handleAddContact}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Ajouter un contact d'alerte
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

export default AlertContactsManager;
