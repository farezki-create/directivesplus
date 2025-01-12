import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuestionnaireHeader = () => {
  const navigate = useNavigate();

  return (
    <CardHeader className="sticky top-0 bg-white z-50 border-b px-6">
      <div className="flex items-center justify-between">
        <CardTitle>Directives anticipées</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
        >
          <Home className="h-5 w-5" />
        </Button>
      </div>
    </CardHeader>
  );
};