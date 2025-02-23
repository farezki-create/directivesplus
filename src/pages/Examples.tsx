
import { Header } from "@/components/Header";
import { ExamplesContent } from "@/components/examples/ExamplesContent";

const Examples = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            Propositions de directives anticipées
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Consultez des exemples de formulations et des modèles pré-remplis pour vous aider à rédiger vos directives anticipées.
          </p>
          <ExamplesContent 
            onBack={() => window.history.back()} 
          />
        </div>
      </main>
    </div>
  );
};

export default Examples;
