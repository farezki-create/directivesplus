import { Header } from "@/components/Header";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { QuestionnaireForm } from "@/components/questionnaire/QuestionnaireForm";
import { useDownloadQuestionnaire } from "@/components/home/DownloadButton";

const Index = () => {
  const handleDownload = useDownloadQuestionnaire();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Hero onDownload={handleDownload} />
        <div className="mt-12">
          <QuestionnaireForm />
        </div>
        <Features />
      </main>
    </div>
  );
};

export default Index;