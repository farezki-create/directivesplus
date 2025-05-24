
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Key, Loader2, FileText } from "lucide-react";
import { useSharedDocumentsAccess } from "@/hooks/access/useSharedDocumentsAccess";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export const SharedDocumentsAccessForm = () => {
  const navigate = useNavigate();
  const { loading, result, validateAccess } = useSharedDocumentsAccess();
  
  const [formData, setFormData] = useState({
    accessCode: "",
    firstName: "",
    lastName: "",
    birthDate: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'accessCode' ? value.toUpperCase() : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.accessCode.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un code d'accès",
        variant: "destructive"
      });
      return;
    }
    
    const validationResult = await validateAccess(formData);
    
    if (validationResult.success) {
      toast({
        title: "Accès autorisé",
        description: validationResult.message
      });
      
      // Redirection vers la page des documents
      navigate("/mes-directives");
    } else {
      toast({
        title: "Accès refusé",
        description: validationResult.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Information sur l'accès aux documents partagés */}
      <Alert className="bg-blue-50 border-blue-200">
        <FileText className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Accès aux documents partagés</strong><br />
          Saisissez le code d'accès pour consulter les documents partagés.
        </AlertDescription>
      </Alert>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <Label htmlFor="accessCode" className="text-base font-medium">
            Code d'accès *
          </Label>
          <Input
            id="accessCode"
            name="accessCode"
            value={formData.accessCode}
            onChange={handleChange}
            placeholder="Saisissez le code d'accès"
            className="text-center text-lg tracking-widest font-mono h-12"
            required
          />
        </div>

        {/* Champs optionnels pour vérification d'identité */}
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-3">
            Informations optionnelles (pour vérification d'identité) :
          </p>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="firstName" className="text-sm">
                Prénom
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Prénom"
              />
            </div>
            
            <div>
              <Label htmlFor="lastName" className="text-sm">
                Nom
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Nom de famille"
              />
            </div>
            
            <div>
              <Label htmlFor="birthDate" className="text-sm">
                Date de naissance
              </Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-base"
          disabled={loading || !formData.accessCode.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Vérification en cours...
            </>
          ) : (
            "Accéder aux documents"
          )}
        </Button>
      </form>

      {/* Résultat de la validation */}
      {result && (
        <Alert 
          variant={result.success ? "default" : "destructive"} 
          className={result.success ? "bg-green-50 border-green-200" : ""}
        >
          {result.success ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <AlertDescription className={result.success ? "text-green-800" : ""}>
            {result.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Instructions d'utilisation */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">Instructions</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Saisissez le code d'accès fourni</li>
          <li>• Les informations personnelles sont optionnelles</li>
          <li>• Vous accéderez aux documents partagés avec ce code</li>
        </ul>
      </div>
    </div>
  );
};
