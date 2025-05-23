
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  loading: boolean;
  onClick: () => void;
}

const SubmitButton = ({ loading, onClick }: SubmitButtonProps) => {
  return (
    <Button
      className="w-full"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Vérification...
        </>
      ) : (
        "Accéder à mes directives"
      )}
    </Button>
  );
};

export default SubmitButton;
