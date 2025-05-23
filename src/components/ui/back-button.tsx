
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  className?: string;
  label?: string;
  onClick?: () => void;
}

const BackButton = ({ className = "", label = "Retour", onClick }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className={`flex items-center gap-2 mb-4 ${className}`}
    >
      <ArrowLeft size={18} />
      {label}
    </Button>
  );
};

export default BackButton;
