
import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: string, success: boolean) => {
  if (status.includes("✅")) return <Badge variant="default" className="bg-green-500">SUCCÈS</Badge>;
  if (status.includes("❌")) return <Badge variant="destructive">ERREUR</Badge>;
  if (status.includes("⚠️")) return <Badge variant="secondary">ATTENTION</Badge>;
  if (status.includes("ℹ️")) return <Badge variant="outline">INFO</Badge>;
  return <Badge variant="outline">{status}</Badge>;
};
