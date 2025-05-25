
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SupportHero from "@/components/support/SupportHero";
import VolunteerSection from "@/components/support/VolunteerSection";
import FinancialSection from "@/components/support/FinancialSection";

const Soutenir = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <SupportHero />
        <VolunteerSection />
        <FinancialSection />
      </main>
      <Footer />
    </div>
  );
};

export default Soutenir;
