
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function NavigationButtons({ navButtonClass }: { navButtonClass: string }) {
  const navigate = useNavigate();
  
  const navigateTo = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(path);
  };
  
  return (
    <>
      <Button
        className={navButtonClass}
        onClick={navigateTo("/examples")}
      >
        Exemples
      </Button>
      
      <Button
        className={navButtonClass}
        onClick={navigateTo("/faq")}
      >
        FAQ
      </Button>
      
      <Button
        className={navButtonClass}
        onClick={navigateTo("/rgpd")}
      >
        RGPD
      </Button>
    </>
  );
}
