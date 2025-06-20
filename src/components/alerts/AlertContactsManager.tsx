
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus, Save, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertContactCard } from "./AlertContactCard";
import { useAlertContacts } from "@/hooks/alerts/useAlertContacts";

const AlertContactsManager = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  const {
    alertContacts,
    loading,
    saving,
    handleAddContact,
    handleChange,
    handleRemove,
    handleSave
  } = useAlertContacts(user?.id);

  // Afficher le loading pendant la vérification de l'auth
  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }

  // Afficher le message si pas connecté
  if (!isAuthenticated || !user) {
    return (
      <div className="text-center p-8">
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Vous devez être connecté pour gérer vos contacts d'alerte.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate("/auth")}>
          Se connecter
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
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
              disabled={saving || alertContacts.length === 0}
              className="bg-directiveplus-600 hover:bg-directiveplus-700"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Enregistrer
            </Button>
            
            {alertContacts.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Ajoutez au moins un contact pour pouvoir enregistrer
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AlertContactsManager;
