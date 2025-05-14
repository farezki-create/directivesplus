
import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status: boolean;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status) {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        Oui
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
      Non
    </Badge>
  );
}
