
import { ReactNode } from "react";
import AppNavigation from "@/components/AppNavigation";

type PageHeaderProps = {
  children?: ReactNode;
};

const PageHeader = ({ children }: PageHeaderProps) => {
  return (
    <header>
      <AppNavigation />
      {children}
    </header>
  );
};

export default PageHeader;
