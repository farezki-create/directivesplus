
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DonationHero from "@/components/donation/DonationHero";
import DonationCard from "@/components/donation/DonationCard";
import InfoCards from "@/components/donation/InfoCards";
import { useDonation } from "@/hooks/useDonation";

const Soutenir = () => {
  const {
    selectedAmount,
    customAmount,
    isProcessing,
    handleAmountClick,
    handleCustomAmountChange,
    handleDonation
  } = useDonation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <DonationHero />
        
        {/* Donation Section */}
        <section id="faire-un-don" className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="ponctuel" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="ponctuel">Don ponctuel</TabsTrigger>
                  <TabsTrigger value="mensuel">Don mensuel</TabsTrigger>
                </TabsList>
                
                <TabsContent value="ponctuel">
                  <DonationCard 
                    isRecurring={false}
                    selectedAmount={selectedAmount}
                    customAmount={customAmount}
                    isProcessing={isProcessing}
                    onAmountClick={handleAmountClick}
                    onCustomAmountChange={handleCustomAmountChange}
                    onDonation={() => handleDonation(false)}
                  />
                </TabsContent>
                
                <TabsContent value="mensuel">
                  <DonationCard 
                    isRecurring={true}
                    selectedAmount={selectedAmount}
                    customAmount={customAmount}
                    isProcessing={isProcessing}
                    onAmountClick={handleAmountClick}
                    onCustomAmountChange={handleCustomAmountChange}
                    onDonation={() => handleDonation(true)}
                  />
                </TabsContent>
              </Tabs>
              
              <InfoCards />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Soutenir;
