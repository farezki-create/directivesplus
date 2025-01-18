import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const HealthcareLanding = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mt-8">
          <h1 className="text-4xl font-bold mb-6 text-center">
            Espace Professionnel de Santé
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
            Accédez aux directives anticipées de vos patients
          </p>

          <div className="space-y-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-full max-w-md flex gap-4">
                <Input
                  type="search"
                  placeholder="Rechercher un patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={() => navigate("/healthcare-dashboard")}>
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
              </div>
            </div>

            <div className="text-center space-y-4">
              <Button
                variant="outline"
                onClick={() => navigate("/healthcare")}
                className="w-full max-w-md"
              >
                Se connecter avec CPS
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HealthcareLanding;