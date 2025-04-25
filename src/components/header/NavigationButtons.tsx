
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Move } from "lucide-react";

export function NavigationButtons({ navButtonClass }: { navButtonClass: string }) {
  const navigate = useNavigate();

  return (
    <Button
      className={navButtonClass}
      onClick={() => navigate("/faq")}
    >
      <Move className="h-4 w-4 mr-1" />
      FAQ
    </Button>
  );
}

