import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FreeText = () => {
  const [text, setText] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Expression libre</h1>
          
          <p className="text-muted-foreground mb-6">
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
      </main>
    </div>
  );
};

export default FreeText;