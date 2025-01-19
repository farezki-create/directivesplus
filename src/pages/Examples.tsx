import { Header } from "@/components/Header";
import { DirectivesSynthesis } from "@/components/directives/DirectivesSynthesis";
import { TrustedPersons } from "@/components/TrustedPersons";
import { useState } from "react";
import { ExamplesButtons } from "@/components/examples/ExamplesButtons";
import { ExamplesContent } from "@/components/examples/ExamplesContent";
import { DocumentsButtons } from "@/components/examples/DocumentsButtons";

const Examples = () => {
  const [showExamples, setShowExamples] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showDirectives, setShowDirectives] = useState(false);
  const [showTrustedPerson, setShowTrustedPerson] = useState(false);

  const handleExamplesClick = () => {
    setShowExamples(true);
    setShowDocuments(false);
    setShowDirectives(false);
    setShowTrustedPerson(false);
  };

  const handleDocumentsClick = () => {
    setShowDocuments(true);
    setShowExamples(false);
    setShowDirectives(false);
    setShowTrustedPerson(false);
  };

  const handleDirectivesClick = () => {
    setShowDirectives(true);
    setShowDocuments(false);
  };

  const handleTrustedPersonClick = () => {
    setShowTrustedPerson(true);
    setShowDocuments(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {!showExamples && !showDocuments && !showDirectives && !showTrustedPerson && (
          <ExamplesButtons 
            onExamplesClick={handleExamplesClick}
            onDocumentsClick={handleDocumentsClick}
          />
        )}

        {showExamples && (
          <ExamplesContent 
            onBack={() => setShowExamples(false)} 
          />
        )}

        {showDocuments && !showDirectives && !showTrustedPerson && (
          <DocumentsButtons 
            onBack={() => setShowDocuments(false)}
            onDirectivesClick={handleDirectivesClick}
            onTrustedPersonClick={handleTrustedPersonClick}
          />
        )}

        {showDirectives && (
          <div className="space-y-6">
            <button 
              onClick={() => {
                setShowDirectives(false);
                setShowDocuments(true);
              }} 
              className="mb-4"
            >
              Retour
            </button>
            <DirectivesSynthesis />
          </div>
        )}

        {showTrustedPerson && (
          <div className="space-y-6">
            <button 
              onClick={() => {
                setShowTrustedPerson(false);
                setShowDocuments(true);
              }} 
              className="mb-4"
            >
              Retour
            </button>
            <TrustedPersons />
          </div>
        )}
      </main>
    </div>
  );
};

export default Examples;