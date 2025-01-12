import { Header } from "@/components/Header";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { QuestionnaireForm } from "@/components/questionnaire/QuestionnaireForm";
import { useDownloadQuestionnaire } from "@/components/home/DownloadButton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

const Index = () => {
  const handleDownload = useDownloadQuestionnaire();
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  const handleStart = () => {
    setShowQuestionnaire(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Hero onDownload={handleStart} />
        <Features />

        <Dialog open={showQuestionnaire} onOpenChange={setShowQuestionnaire}>
          <DialogContent className="max-w-4xl p-0">
            <DialogTitle className="sr-only">Questionnaire des directives anticipées</DialogTitle>
            <QuestionnaireForm />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Index;