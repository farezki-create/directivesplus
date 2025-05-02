
import { useLanguage } from "@/hooks/useLanguage";

export function FeatureHighlights() {
  const { currentLanguage } = useLanguage();
  
  return (
    <div className="mt-12 grid gap-8 md:grid-cols-3">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          {currentLanguage === 'en' ? 'Simple and guided' : 'Simple et guidé'}
        </h3>
        <p className="text-muted-foreground">
          {currentLanguage === 'en' ? 'A step-by-step process to guide you through writing your directives.' : 'Un processus pas à pas pour vous accompagner dans la rédaction.'}
        </p>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          {currentLanguage === 'en' ? 'Secure data' : 'Données sécurisées'}
        </h3>
        <p className="text-muted-foreground">
          {currentLanguage === 'en' ? 'Your data is protected and hosted in France' : 'Vos données sont protégées et hébergées en France'}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {currentLanguage === 'en' ? 'See legal notices for details' : 'Voir mentions légales pour plus de détails'}
        </p>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          {currentLanguage === 'en' ? 'Easily shareable' : 'Facilement partageable'}
        </h3>
        <p className="text-muted-foreground">
          {currentLanguage === 'en' ? 'Print, download and share' : 'Télécharger, partager, imprimer'}
        </p>
      </div>
    </div>
  );
}
