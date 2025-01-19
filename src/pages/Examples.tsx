import { Header } from "@/components/Header";
import { DirectivesSynthesis } from "@/components/directives/DirectivesSynthesis";

const Examples = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <DirectivesSynthesis />
      </main>
    </div>
  );
};

export default Examples;