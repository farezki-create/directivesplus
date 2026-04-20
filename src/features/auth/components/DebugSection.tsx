
import { useState } from "react";
import EmailConfigDiagnostic from "@/components/debug/EmailConfigDiagnostic";

export const DebugSection = () => {
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  return (
    <>
      {/* Boutons de diagnostic */}
      <div className="text-center mb-4 space-y-2">
        <div className="flex gap-2 justify-center flex-wrap">
          <button
            onClick={() => setShowDiagnostic(!showDiagnostic)}
            className="text-sm text-red-600 hover:text-red-800 underline font-medium"
          >
            {showDiagnostic ? "Masquer" : "🔧 Diagnostic"} Complet
          </button>
        </div>
        
        <div className="flex gap-2 justify-center flex-wrap">
          <a
            href="/admin/audit?tab=auth"
            className="text-sm text-green-600 hover:text-green-800 underline font-bold"
          >
            🛡️ Audit Auth Complet
          </a>
        </div>
      </div>

      {/* Composant de diagnostic principal */}
      {showDiagnostic && <EmailConfigDiagnostic />}

      {/* Retourner si on doit afficher le contenu principal */}
      {showDiagnostic ? null : true}
    </>
  );
};
