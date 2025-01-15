import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="container mx-auto px-4 py-16 flex flex-col items-center text-center gap-8">
          <h1 className="text-4xl font-bold">
            Directives anticipées
          </h1>
          <p className="text-xl max-w-2xl">
            Exprimez vos volontés sur les décisions médicales à prendre lorsque vous ne serez plus en état de les exprimer
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-8">
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="w-full"
            >
              Privilégier le laisser mourir
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="w-full"
            >
              Privilégier le maintien en vie
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;