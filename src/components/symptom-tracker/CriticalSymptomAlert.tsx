
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CriticalSymptomAlertProps {
  douleur: number;
  dyspnee: number;
  anxiete: number;
  className?: string;
}

export default function CriticalSymptomAlert({ 
  douleur, 
  dyspnee, 
  anxiete, 
  className = "" 
}: CriticalSymptomAlertProps) {
  const criticalSymptoms = [];
  
  if (douleur >= 8) criticalSymptoms.push("Douleur élevée");
  if (dyspnee >= 7) criticalSymptoms.push("Dyspnée sévère");
  if (anxiete >= 8) criticalSymptoms.push("Anxiété critique");

  if (criticalSymptoms.length === 0) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        🔥 Alerte
      </Badge>
      <span className="text-red-600 font-medium text-sm">
        {criticalSymptoms.join(", ")}
      </span>
    </div>
  );
}
