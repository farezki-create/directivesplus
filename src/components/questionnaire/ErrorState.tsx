
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: string | null;
}

const ErrorState = ({ error }: ErrorStateProps) => {
  if (!error) return null;
  
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <p className="text-red-500">{error}</p>
        <Button variant="outline" onClick={() => window.history.back()} className="mt-4">
          Retour
        </Button>
      </CardContent>
    </Card>
  );
};

export default ErrorState;
