
import { Header } from "@/components/Header";
import { TrustedPersons } from "@/components/TrustedPersons";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Désignation de la personne de confiance
        </h1>

        <div className="max-w-4xl mx-auto">
          <TrustedPersons />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
