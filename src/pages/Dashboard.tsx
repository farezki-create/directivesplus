import { Header } from "@/components/Header";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Tableau de bord
        </h1>

        <ProfileCard />
        <DashboardTabs />
      </main>
    </div>
  );
};

export default Dashboard;