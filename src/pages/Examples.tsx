import { Header } from "@/components/Header";
import { useState } from "react";
import { ExamplesButtons } from "@/components/examples/ExamplesButtons";
import { ExamplesContent } from "@/components/examples/ExamplesContent";

const Examples = () => {
  const [showExamples, setShowExamples] = useState(false);

  const handleExamplesClick = () => {
    setShowExamples(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {!showExamples && (
          <ExamplesButtons 
            onExamplesClick={handleExamplesClick}
          />
        )}

        {showExamples && (
          <ExamplesContent 
            onBack={() => setShowExamples(false)} 
          />
        )}
      </main>
    </div>
  );
};

export default Examples;