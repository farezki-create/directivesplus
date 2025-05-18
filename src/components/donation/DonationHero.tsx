
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const DonationHero = () => {
  return (
    <section className="bg-directiveplus-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-directiveplus-700 mb-6">
            Soutenez DirectivesPlus
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Votre soutien nous permet de continuer notre mission : rendre accessible à tous la gestion des directives anticipées.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#faire-un-don">
              <Button 
                size="lg"
                className="bg-directiveplus-600 hover:bg-directiveplus-700 text-lg flex items-center gap-2"
              >
                <Heart className="h-5 w-5" />
                Je fais un don
              </Button>
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Vos dons sont déductibles des impôts à hauteur de 66%
          </p>
        </div>
      </div>
    </section>
  );
};

export default DonationHero;
