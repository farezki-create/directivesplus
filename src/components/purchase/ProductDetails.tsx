
export const ProductDetails = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="h-[400px] bg-white relative rounded-lg overflow-hidden">
        <img 
          src="/lovable-uploads/6bb21b02-63a3-4da2-8feb-a4ec9237c2bf.png"
          alt="Carte mémoire USB Directives Anticipées"
          className="object-contain w-full h-full"
        />
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium">Caractéristiques</h4>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Format carte de crédit - Se range facilement dans votre portefeuille</li>
            <li>Connecteur USB intégré</li>
            <li>Capacité de stockage de 2 Go</li>
            <li>Stockage sécurisé de vos directives anticipées</li>
            <li>Compatibilité universelle</li>
          </ul>
        </div>

        <div>
          <p className="text-2xl font-bold">
            Prix : 19,90 €
          </p>
          <p className="text-sm text-muted-foreground">
            Frais de port inclus
          </p>
        </div>
      </div>
    </div>
  );
};
