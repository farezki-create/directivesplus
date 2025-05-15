
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const EmptyDocumentsState: FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="text-center p-6">
      <CardContent className="pt-6">
        <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-medium mb-2">Aucun document</h3>
        <p className="text-gray-500">
          Vous n'avez pas encore généré de directives anticipées.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={() => navigate("/synthese")}>
          Créer mes directives
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmptyDocumentsState;
