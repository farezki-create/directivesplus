
import React from 'react';
import Header from '@/components/Header';
import PageFooter from '@/components/layout/PageFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CreditCard, Shield, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDonation } from '@/hooks/useDonation';

const DonCarteBancaire = () => {
  const navigate = useNavigate();
  const {
    selectedAmount,
    customAmount,
    isProcessing,
    handleAmountClick,
    handleCustomAmountChange,
    handleDonation
  } = useDonation();

  const donationAmounts = ['5', '10', '25', '50', '100'];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour
          </Button>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Heart className="h-12 w-12 text-directiveplus-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Faire un don par carte bancaire
            </h1>
            <p className="text-lg text-gray-600">
              Soutenez DirectivesPlus et contribuez à rendre les directives anticipées accessibles à tous
            </p>
          </div>
          
          <Card className="shadow-lg">
            <CardHeader className="text-center bg-gradient-to-r from-directiveplus-500 to-directiveplus-600 text-white">
              <CardTitle className="flex items-center justify-center gap-2">
                <CreditCard className="h-6 w-6" />
                Paiement sécurisé
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choisissez le montant de votre don
                </label>
                
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {donationAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      className={`h-12 font-semibold ${
                        selectedAmount === amount 
                          ? "bg-directiveplus-600 hover:bg-directiveplus-700" 
                          : "hover:border-directiveplus-300"
                      }`}
                      onClick={() => handleAmountClick(amount)}
                    >
                      {amount}€
                    </Button>
                  ))}
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ou saisissez un montant personnalisé
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      placeholder="Montant en euros"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-directiveplus-500 focus:border-transparent"
                    />
                    <span className="absolute right-3 top-3 text-gray-500">€</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button
                  onClick={() => handleDonation(false)}
                  disabled={isProcessing || (!selectedAmount && !customAmount)}
                  className="w-full bg-directiveplus-600 hover:bg-directiveplus-700 text-white py-3 text-lg font-semibold"
                >
                  {isProcessing ? "Traitement..." : "Faire un don unique"}
                </Button>
                
                <Button
                  onClick={() => handleDonation(true)}
                  disabled={isProcessing || (!selectedAmount && !customAmount)}
                  variant="outline"
                  className="w-full border-directiveplus-300 text-directiveplus-700 hover:bg-directiveplus-50 py-3 text-lg font-semibold"
                >
                  {isProcessing ? "Traitement..." : "Don mensuel récurrent"}
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">Paiement 100% sécurisé</span>
                </div>
                <p className="text-sm text-green-700">
                  Vos données bancaires sont protégées par un chiffrement de niveau bancaire.
                  Nous ne stockons aucune information de carte bancaire.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Votre don contribue à maintenir DirectivesPlus gratuit et accessible à tous.
              Merci de votre soutien ! 💙
            </p>
          </div>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default DonCarteBancaire;
