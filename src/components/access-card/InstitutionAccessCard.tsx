
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hospital, Loader2, Share2, Shield } from "lucide-react";

interface InstitutionAccessCardProps {
  userId?: string;
  isGenerating: boolean;
  onGenerateCode: () => void;
}

const InstitutionAccessCard = ({
  userId,
  isGenerating,
  onGenerateCode
}: InstitutionAccessCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hospital className="h-5 w-5 text-directiveplus-600" />
          Accès professionnel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Générez un code temporaire sécurisé pour permettre à un professionnel de santé 
          ou une institution médicale d'accéder à vos directives anticipées.
        </p>
        
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-md">
          <Shield className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-blue-800">
            Code sécurisé, valable 30 jours, révocable à tout moment
          </span>
        </div>
        
        <Button 
          onClick={onGenerateCode}
          disabled={isGenerating || !userId}
          className="w-full"
        >
          {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Share2 className="mr-2 h-4 w-4" />
          Générer un code d'accès professionnel
        </Button>
      </CardContent>
    </Card>
  );
};

export default InstitutionAccessCard;
