
import { Card, CardContent } from "@/components/ui/card";

export function TemplatesList() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">Plus de soins thérapeutiques</h3>
          <p className="text-sm text-gray-600">
            Exemple de directives anticipées privilégiant les soins thérapeutiques actifs.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">Plus de soulagement des souffrances</h3>
          <p className="text-sm text-gray-600">
            Exemple de directives anticipées privilégiant le confort et le soulagement de la douleur.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">Intermédiaire, Soins thérapeutiques et soulagement</h3>
          <p className="text-sm text-gray-600">
            Exemple équilibré entre les soins thérapeutiques et le soulagement des souffrances.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
