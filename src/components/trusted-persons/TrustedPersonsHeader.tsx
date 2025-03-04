
import { useLanguage } from "@/hooks/useLanguage";

interface TrustedPersonsHeaderProps {
  title: string;
}

export const TrustedPersonsHeader = ({ title }: TrustedPersonsHeaderProps) => {
  return (
    <h2 className="text-2xl font-bold mb-6">{title}</h2>
  );
};
