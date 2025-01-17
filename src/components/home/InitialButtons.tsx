import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type InitialButtonsProps = {
  onStart: () => void;
};

export const InitialButtons = ({ onStart }: InitialButtonsProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4 md:grid-cols-2 max-w-lg mx-auto">
      <Button
        size="lg"
        onClick={onStart}
      >
        Commencer
      </Button>
      <Button
        variant="outline"
        size="lg"
        onClick={() => navigate("/dashboard")}
      >
        En savoir plus
      </Button>
    </div>
  );
};