
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
          Vos directives anticipées ne sont jamais stockées et sont automatiquement supprimées dès que vous vous déconnectez.
        </p>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Facilement partageable</h3>
        <p className="text-muted-foreground">
          Téléchargez vos directives pour les partager avec vos proches.
        </p>
      </div>
    </div>
  );
}
