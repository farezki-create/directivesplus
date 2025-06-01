
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, Shield, ArrowRight } from "lucide-react";

const PartageSymptomes = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledCode = searchParams.get('code') || '';

  useEffect(() => {
    // Rediriger vers la page d'accès institution avec le code pré-rempli
    if (prefilledCode) {
      const params = new URLSearchParams();
      params.set('code', prefilledCode);
      navigate(`/acces-institution?${params.toString()}`);
    } else {
      // Redirection simple si pas de code
      navigate('/acces-institution');
    }
  }, [navigate, prefilledCode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-8 w-8 text-pink-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Accès Suivi Palliatif
              </h1>
            </div>
            <p className="text-gray-600">
              Redirection vers l'accès institution...
            </p>
          </div>

          <Card className="shadow-lg border-pink-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-800">
                <Shield className="h-5 w-5" />
                Accès sécurisé
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <Alert className="border-blue-200 bg-blue-50">
                <ArrowRight className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  L'accès au suivi palliatif se fait maintenant via la page 
                  d'accès institution sécurisé. Vous allez être redirigé automatiquement.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PartageSymptomes;
