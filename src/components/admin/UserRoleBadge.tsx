
import { Badge } from "@/components/ui/badge";

type UserRoleProps = {
  role: string;
};

export function UserRoleBadge({ role }: UserRoleProps) {
  switch (role) {
    case "patient":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Patient
        </Badge>
      );
    case "medecin":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Médecin
        </Badge>
      );
    case "institution":
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          Institution
        </Badge>
      );
    default:
      return <Badge variant="outline">{role || "Non défini"}</Badge>;
  }
}
