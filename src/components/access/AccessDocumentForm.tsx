
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "./FormField";
import FormActions from "./FormActions";
import { useAccessDocumentForm } from "@/hooks/useAccessDocumentForm";

const AccessDocumentForm = () => {
  const { 
    formData, 
    loading, 
    handleChange, 
    accessDirectives, 
    accessMedicalData 
  } = useAccessDocumentForm();

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-directiveplus-700">
        Accès document
      </h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Accès sans connexion</CardTitle>
          <CardDescription>
            Accédez aux directives anticipées ou aux données médicales d'un patient à l'aide du code d'accès unique
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField 
            id="lastName"
            label="Nom"
            placeholder="Nom de famille"
            value={formData.lastName}
            onChange={handleChange}
          />
          
          <FormField 
            id="firstName"
            label="Prénom"
            placeholder="Prénom"
            value={formData.firstName}
            onChange={handleChange}
          />
          
          <FormField 
            id="birthDate"
            label="Date de naissance"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
          />
          
          <FormField 
            id="accessCode"
            label="Code d'accès"
            placeholder="Code d'accès unique"
            value={formData.accessCode}
            onChange={handleChange}
          />
        </CardContent>
        <CardFooter>
          <FormActions 
            loading={loading}
            onAccessDirectives={accessDirectives}
            onAccessMedicalData={accessMedicalData}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccessDocumentForm;
