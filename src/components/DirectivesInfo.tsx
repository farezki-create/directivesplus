
import { Card, CardContent } from "@/components/ui/card";
import { Lock, FileText, Users, Clock } from "lucide-react";

const DirectivesInfo = () => {
  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">Les Directives Anticipées</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg border-directiveplus-200">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-directiveplus-50 rounded-full p-5 mb-6">
                <img 
                  src="/lovable-uploads/41199219-9056-4e5f-bae3-17439ecbb194.png" 
                  alt="Simple et guidé" 
                  className="w-24 h-24 object-contain" 
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Simple et guidé</h3>
              <p className="text-gray-600">
                Notre plateforme vous guide pas à pas dans la rédaction de vos directives
                anticipées avec des questions claires et des exemples.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-directiveplus-200">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-directiveplus-50 rounded-full p-5 mb-6">
                <img 
                  src="/lovable-uploads/abf0ddf7-3dc9-4888-a686-76305831172b.png" 
                  alt="Facilement partageable" 
                  className="w-24 h-24 object-contain" 
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Facilement partageable</h3>
              <p className="text-gray-600">
                Partagez vos directives avec vos proches et vos médecins
                en toute simplicité pour vous assurer qu'elles seront respectées.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DirectivesInfo;
