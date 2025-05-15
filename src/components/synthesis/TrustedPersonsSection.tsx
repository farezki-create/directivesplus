
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TrustedPersonsSectionProps {
  trustedPersons: any[];
}

const TrustedPersonsSection = ({ trustedPersons }: TrustedPersonsSectionProps) => {
  if (!trustedPersons || trustedPersons.length === 0) return null;
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle>Personne(s) de confiance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trustedPersons.map((person, index) => (
            <div key={person.id || index} className="border-b pb-2 last:border-0">
              <p className="font-medium">{person.name}</p>
              <div className="text-sm text-gray-700">
                {person.relation && <p>Relation: {person.relation}</p>}
                {person.phone && <p>Téléphone: {person.phone}</p>}
                {person.email && <p>Email: {person.email}</p>}
                {person.address && (
                  <p>
                    {person.address}
                    {person.city && person.postal_code && `, ${person.postal_code} ${person.city}`}
                    {!person.city && person.postal_code && `, ${person.postal_code}`}
                    {person.city && !person.postal_code && `, ${person.city}`}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrustedPersonsSection;
