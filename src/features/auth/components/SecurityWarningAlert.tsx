
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface SecurityWarningAlertProps {
  warning: string | null;
}

export const SecurityWarningAlert = ({ warning }: SecurityWarningAlertProps) => {
  if (!warning) return null;

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>{warning}</AlertDescription>
    </Alert>
  );
};
