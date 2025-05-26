
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, CheckCircle } from "lucide-react";

const InstitutionalAccessSection = () => {
  return (
    <section className="py-16 bg-directiveplus-50 border-y-2 border-directiveplus-200">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-directiveplus-600 rounded-full flex items-center justify-center">
              <Building2 className="w-10 h-10 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Accès Institutionnel
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Professionnels de santé et établissements : accédez rapidement et en toute sécurité 
            aux directives anticipées de vos patients grâce à notre système d'accès institutionnel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/acces-institution">
              <Button size="lg" className="bg-directiveplus-600 hover:bg-directiveplus-700">
                <Building2 className="mr-2 h-5 w-5" />
                Accès Institutionnel
              </Button>
            </Link>
            <Link to="/en-savoir-plus">
              <Button size="lg" variant="outline" className="border-directiveplus-600 text-directiveplus-600 hover:bg-directiveplus-100">
                En savoir plus
              </Button>
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              Accès sécurisé par code
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              Conforme RGPD
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              Support 24/7
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstitutionalAccessSection;
