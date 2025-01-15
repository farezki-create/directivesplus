import { useEffect } from "react";
import { Header } from "@/components/Header";
import { ExplanationDialog } from "@/components/ExplanationDialog";
import { useDialogState } from "@/hooks/useDialogState";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";

const Dashboard = () => {
  const { explanationOpen, setExplanationOpen } = useDialogState();

  useEffect(() => {
    const shouldShowDialog = sessionStorage.getItem('showExplanationDialog') === 'true';
    if (shouldShowDialog) {
      setExplanationOpen(true);
      sessionStorage.removeItem('showExplanationDialog');
    }
  }, [setExplanationOpen]);

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

      <ExplanationDialog 
        open={explanationOpen}
        onOpenChange={setExplanationOpen}
        onContinue={() => setExplanationOpen(false)}
      />
    </div>
  );
};

export default Dashboard;