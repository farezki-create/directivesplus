import { Header } from "@/components/Header";
import { ExamplesContent } from "@/components/examples/ExamplesContent";

const Examples = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <ExamplesContent 
          onBack={() => window.history.back()} 
        />
      </main>
    </div>
  );
};

export default Examples;