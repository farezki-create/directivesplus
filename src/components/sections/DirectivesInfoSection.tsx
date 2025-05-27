
import FAQSection from "./directives-info/FAQSection";
import FeaturesSection from "./directives-info/FeaturesSection";
import CTACard from "./directives-info/CTACard";

const DirectivesInfoSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprendre les directives anticipées
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Les directives anticipées vous permettent d'exprimer vos souhaits concernant vos soins médicaux 
              pour le cas où vous ne pourriez plus vous exprimer. Découvrez comment elles fonctionnent.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <FAQSection />
            <FeaturesSection />
          </div>

          <CTACard />
        </div>
      </div>
    </section>
  );
};

export default DirectivesInfoSection;
