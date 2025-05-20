
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormSubmitButtonProps {
  loading: boolean;
  label: string;
  loadingLabel: string;
}

export const FormSubmitButton = ({ loading, label, loadingLabel }: FormSubmitButtonProps) => {
  return (
    <>
      <Button disabled={loading} type="submit" className="w-full">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {loading ? loadingLabel : label}
      </Button>
      <p className="text-xs text-gray-500 text-center">
        * Champs obligatoires
      </p>
    </>
  );
};
