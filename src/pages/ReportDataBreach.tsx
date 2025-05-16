
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataBreachForm from "@/components/dataprotection/DataBreachForm";

const ReportDataBreach = () => {
  const navigate = useNavigate();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="flex items-center mb-6 text-gray-600"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <div className="flex items-center gap-3 mb-6">
        <ShieldAlert className="h-8 w-8 text-amber-600" />
        <h1 className="text-3xl font-bold text-gray-800">
          Signaler une violation de données
        </h1>
      </div>

      <p className="text-gray-600 mb-6">
        Utilisez ce formulaire pour signaler toute violation de données personnelles conformément à l'article 33 du RGPD. 
        Une violation de données désigne toute destruction, perte, altération, divulgation non autorisée ou accès non autorisé 
        à des données personnelles.
      </p>

      <DataBreachForm />
    </div>
  );
};

export default ReportDataBreach;
