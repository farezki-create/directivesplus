
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  className?: string;
  label?: string;
}

const BackButton = ({ className = "", label = "Retour" }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      onClick={() => navigate(-1)}
      className={`flex items-center gap-2 mb-4 ${className}`}
    >
      <ArrowLeft size={18} />
      {label}
    </Button>
  );
};

export default BackButton;
