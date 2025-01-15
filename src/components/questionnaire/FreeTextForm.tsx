import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function FreeTextForm() {
  const [text, setText] = useState("");
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Expression libre</h2>
      <p className="text-muted-foreground mb-4">
        Utilisez cet espace pour exprimer librement vos souhaits, vos valeurs ou toute autre information que vous souhaitez partager avec l'équipe soignante.
      </p>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Écrivez ici..."
        className="min-h-[200px] mb-6"
      />

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
        >
          Retour
        </Button>
        <Button
          onClick={() => {
            // TODO: Save the text
            navigate("/");
          }}
        >
          Enregistrer
        </Button>
      </div>
    </div>
  );
}