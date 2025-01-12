import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SectionButtonsProps {
  openSection: string | null;
  handleSectionClick: (section: string) => void;
  sections: Array<{
    id: string;
    title: string;
  }>;
}

export const SectionButtons = ({ openSection, handleSectionClick, sections }: SectionButtonsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="text-xl font-bold">Directives anticipées</div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate("/")}
        className="ml-auto"
      >
        <Home className="h-5 w-5" />
      </Button>
    </div>
  );
};