
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Building, Banknote } from "lucide-react";
import DonationCard from "@/components/donation/DonationCard";
import PayPalDonationCard from "@/components/donation/PayPalDonationCard";
import { useDonation } from "@/hooks/useDonation";
import { donationConfig } from "@/config/donationConfig";

const FinancialSection = () => {
  const oneTimeDonation = useDonation();
  const recurringDonation = useDonation();

  const paymentMethods = [
    {
      icon: <CreditCard className="h-8 w-8 text-directiveplus-600" />,
      title: "Carte bancaire",
      description: "Paiement sécurisé par carte de crédit ou débit",
      action: "Donner par carte",
      onClick: () => {
        if (oneTimeDonation.selectedAmount || oneTimeDonation.customAmount) {
          oneTimeDonation.handleDonation(false);
        } else {
          alert("Veuillez d'abord sélectionner un montant dans la section ci-dessus.");
        }
      }
    },
    {
      icon: <Building className="h-8 w-8 text-directiveplus-600" />,
      title: "PayPal",
      description: "Utilisez votre compte PayPal pour contribuer facilement",
      action: "Donner via PayPal",
      onClick: () => {
        alert("Fonctionnalité en cours de développement. Merci de nous contacter par email.");
      }
    },
    {
      icon: <Banknote className="h-8 w-8 text-directiveplus-600" />,
      title: "Virement bancaire",
      description: "Effectuez un virement directement sur notre compte",
      action: "Voir les coordonnées",
      onClick: () => {
        window.open('mailto:contact@directiveplus.fr?subject=Demande coordonnées bancaires', '_blank');
      }
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-directiveplus-800 mb-4">
            Contributions financières
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Votre soutien financier nous permet de maintenir et développer DirectivePlus. 
            Chaque contribution, quelle que soit sa taille, fait la différence.
          </p>
        </div>
        
        {/* Niveaux de contribution suggérés */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-directiveplus-700 text-center mb-8">
            Niveaux de contribution suggérés
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationConfig.suggestedLevels.map((level, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl text-directiveplus-600">{level.amount}</CardTitle>
                  <CardDescription>{level.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 font-medium">{level.impact}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Formulaires de don - Stripe */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-directiveplus-700 text-center mb-8">
            Dons via Stripe (Carte bancaire)
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DonationCard
              isRecurring={false}
              selectedAmount={oneTimeDonation.selectedAmount}
              customAmount={oneTimeDonation.customAmount}
              isProcessing={oneTimeDonation.isProcessing}
              onAmountClick={oneTimeDonation.handleAmountClick}
              onCustomAmountChange={oneTimeDonation.handleCustomAmountChange}
              onDonation={() => oneTimeDonation.handleDonation(false)}
            />
            
            <DonationCard
              isRecurring={true}
              selectedAmount={recurringDonation.selectedAmount}
              customAmount={recurringDonation.customAmount}
              isProcessing={recurringDonation.isProcessing}
              onAmountClick={recurringDonation.handleAmountClick}
              onCustomAmountChange={recurringDonation.handleCustomAmountChange}
              onDonation={() => recurringDonation.handleDonation(true)}
            />
          </div>
        </div>

        {/* Formulaires de don - PayPal */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-directiveplus-700 text-center mb-8">
            Dons via PayPal (Carte bancaire ou compte PayPal)
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PayPalDonationCard isRecurring={false} />
            <PayPalDonationCard isRecurring={true} />
          </div>
        </div>
        
        {/* Méthodes de paiement alternatives */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-directiveplus-700 text-center mb-8">
            Autres méthodes de paiement
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentMethods.map((method, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {method.icon}
                  </div>
                  <CardTitle className="text-xl">{method.title}</CardTitle>
                  <CardDescription>{method.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    onClick={method.onClick}
                    className="w-full bg-directiveplus-600 hover:bg-directiveplus-700"
                  >
                    {method.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Utilisation des fonds */}
        <div className="bg-directiveplus-50 p-8 rounded-lg">
          <h3 className="text-2xl font-semibold text-directiveplus-700 text-center mb-6">
            Comment vos dons sont utilisés
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-directiveplus-600 mb-2">
                {donationConfig.fundUsage.development.percentage}%
              </div>
              <h4 className="font-semibold text-directiveplus-700 mb-2">
                {donationConfig.fundUsage.development.title}
              </h4>
              <p className="text-sm text-gray-600">
                {donationConfig.fundUsage.development.description}
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-directiveplus-600 mb-2">
                {donationConfig.fundUsage.infrastructure.percentage}%
              </div>
              <h4 className="font-semibold text-directiveplus-700 mb-2">
                {donationConfig.fundUsage.infrastructure.title}
              </h4>
              <p className="text-sm text-gray-600">
                {donationConfig.fundUsage.infrastructure.description}
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-directiveplus-600 mb-2">
                {donationConfig.fundUsage.communication.percentage}%
              </div>
              <h4 className="font-semibold text-directiveplus-700 mb-2">
                {donationConfig.fundUsage.communication.title}
              </h4>
              <p className="text-sm text-gray-600">
                {donationConfig.fundUsage.communication.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinancialSection;
