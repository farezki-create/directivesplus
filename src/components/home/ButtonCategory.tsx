
import { ReactNode } from "react";

interface ButtonCategoryProps {
  children: ReactNode;
  className?: string;
}

export function ButtonCategory({ children, className = "" }: ButtonCategoryProps) {
  return (
    <div className={`grid gap-4 ${className}`}>
      {children}
    </div>
  );
}
