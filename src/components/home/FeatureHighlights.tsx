import { useLanguage } from "@/hooks/useLanguage";
export function FeatureHighlights() {
  const {
    t,
    currentLanguage
  } = useLanguage();
  return <div className="mt-12 grid gap-8 md:grid-cols-3">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          {currentLanguage === 'en' ? 'Simple and guided' : 'Simple et guidé'}
        </h3>
        <p className="text-muted-foreground">
          {currentLanguage === 'en' ? 'A step-by-step process to guide you through writing your directives.' : 'Un processus pas à pas pour vous accompagner dans la rédaction.'}
        </p>
      </div>
      <div className="text-center">
        
        
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">
          {currentLanguage === 'en' ? 'Easily shareable' : 'Facilement partageable'}
        </h3>
        <p className="text-muted-foreground">
          {currentLanguage === 'en' ? 'Print, download and share' : 'Télécharger, partager, imprimer'}
        </p>
      </div>
    </div>;
}