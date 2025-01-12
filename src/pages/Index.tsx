import { Header } from "@/components/Header";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { useDownloadQuestionnaire } from "@/components/home/DownloadButton";

const Index = () => {
  const handleDownload = useDownloadQuestionnaire();
  const handleStart = handleDownload;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Hero onDownload={handleStart} />
        <Features />
      </main>
    </div>
  );
};

export default Index;