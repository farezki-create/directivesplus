
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

type DebugInfoAlertProps = {
  debugInfo: any;
  showAlert: boolean;
};

const DebugInfoAlert = ({ debugInfo, showAlert }: DebugInfoAlertProps) => {
  if (!showAlert) return null;
  
  const supabaseUrl = process.env.SUPABASE_URL || "https://kytqqjnecezkxyhmmjrz.supabase.co";

  return (
    <Alert variant="default" className="bg-gray-100 text-xs mt-2">
      <AlertTitle>Informations de débogage</AlertTitle>
      <AlertDescription>
        <p className="mb-1">URL Supabase: {supabaseUrl}</p>
        <pre className="text-xs overflow-auto max-h-32 p-2 bg-gray-200 rounded">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </AlertDescription>
    </Alert>
  );
};

export default DebugInfoAlert;
