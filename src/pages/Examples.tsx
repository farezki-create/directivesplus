import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FileText, BookOpen, User } from "lucide-react";
import { DirectivesSynthesis } from "@/components/directives/DirectivesSynthesis";
import { TrustedPersons } from "@/components/TrustedPersons";

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
          <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
            <Button 
              onClick={handleExamplesClick} 
              size="lg"
              className="flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Exemples de Directives anticipées
            </Button>
            <Button 
              onClick={handleDocumentsClick} 
              size="lg"
              className="flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Mes Documents
            </Button>
          </div>
        )}

        {showExamples && (
          <div className="space-y-6">
            <Button 
              onClick={() => setShowExamples(false)} 
              variant="outline" 
              className="mb-4"
            >
              Retour
            </Button>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">Plus de soins thérapeutiques</h3>
                  <p className="text-sm text-gray-600">
                    Exemple de directives anticipées privilégiant les soins thérapeutiques actifs.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">Plus de soulagement des souffrances</h3>
                  <p className="text-sm text-gray-600">
                    Exemple de directives anticipées privilégiant le confort et le soulagement de la douleur.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">Intermédiaire, Soins thérapeutiques et soulagement</h3>
                  <p className="text-sm text-gray-600">
                    Exemple équilibré entre les soins thérapeutiques et le soulagement des souffrances.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {showDocuments && !showDirectives && !showTrustedPerson && (
          <div className="space-y-6">
            <Button 
              onClick={() => setShowDocuments(false)} 
              variant="outline" 
              className="mb-4"
            >
              Retour
            </Button>
            <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
              <Button 
                onClick={handleDirectivesClick}
                size="lg"
                className="flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Mes Directives Anticipées
              </Button>
              <Button 
                onClick={handleTrustedPersonClick}
                size="lg"
                className="flex items-center gap-2"
              >
                <User className="w-5 h-5" />
                Ma Personne de Confiance
              </Button>
            </div>
          </div>
        )}

        {showDirectives && (
          <div className="space-y-6">
            <Button 
              onClick={() => {
                setShowDirectives(false);
                setShowDocuments(true);
              }} 
              variant="outline" 
              className="mb-4"
            >
              Retour
            </Button>
            <DirectivesSynthesis />
          </div>
        )}

        {showTrustedPerson && (
          <div className="space-y-6">
            <Button 
              onClick={() => {
                setShowTrustedPerson(false);
                setShowDocuments(true);
              }} 
              variant="outline" 
              className="mb-4"
            >
              Retour
            </Button>
            <TrustedPersons />
          </div>
        )}
      </main>
    </div>
  );
};

export default Examples;