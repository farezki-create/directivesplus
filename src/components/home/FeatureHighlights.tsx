
export function FeatureHighlights() {
  return (
    <div className="mt-12 grid gap-8 md:grid-cols-3">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Simple et guidé</h3>
        <p className="text-muted-foreground">
          Un processus pas à pas pour vous accompagner dans la rédaction.
        </p>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">100% sécurisé</h3>
        <p className="text-muted-foreground">
          Vos données sont protégées et confidentielles. Vos directives anticipées ne sont jamais sauvegardées et sont supprimées dès que vous vous déconnectez.
        </p>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Facilement partageable</h3>
        <p className="text-muted-foreground">
          Téléchargez vos directives pour les conserver et les partager.
        </p>
      </div>
    </div>
  );
}
