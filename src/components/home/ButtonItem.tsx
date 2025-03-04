
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface ButtonItemProps {
  onClick: () => void;
  label: string;
  icon?: ReactNode;
  className?: string;
}

export function ButtonItem({ onClick, label, icon, className = "" }: ButtonItemProps) {
  return (
    <Button 
      onClick={onClick} 
      size="lg"
      className={className}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </Button>
  );
}
