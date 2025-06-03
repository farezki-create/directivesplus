
import { useState } from "react";
import SMTPTestComponent from "@/components/debug/SMTPTestComponent";
import EmailConfigDiagnostic from "@/components/debug/EmailConfigDiagnostic";
import { BrevoEmailTest } from "@/components/debug/BrevoEmailTest";

export const DebugSection = () => {
  const [showDebug, setShowDebug] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [showBrevoTest, setShowBrevoTest] = useState(false);

  return (
    <>
      {/* Boutons de debug et diagnostic */}
      <div className="text-center mb-4 space-y-2">
        <div className="flex gap-2 justify-center flex-wrap">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            {showDebug ? "Masquer" : "Test"} SMTP
          </button>
          
          <button
            onClick={() => setShowDiagnostic(!showDiagnostic)}
            className="text-sm text-red-600 hover:text-red-800 underline font-medium"
          >
            {showDiagnostic ? "Masquer" : "🔧 Diagnostic"} Complet
          </button>
          
          <button
            onClick={() => setShowBrevoTest(!showBrevoTest)}
            className="text-sm text-green-600 hover:text-green-800 underline font-medium"
          >
            {showBrevoTest ? "Masquer" : "📧 Test"} Brevo
          </button>
        </div>
        
        <a
          href="/auth-audit"
          className="text-sm text-purple-600 hover:text-purple-800 underline block mx-auto"
        >
          🔍 Audit Email Complet
        </a>
      </div>

      {/* Composant de test Brevo */}
      {showBrevoTest && (
        <div className="mb-6">
          <BrevoEmailTest />
        </div>
      )}

      {/* Composant de diagnostic principal */}
      {showDiagnostic && <EmailConfigDiagnostic />}

      {/* Composant de test SMTP */}
      {showDebug && <SMTPTestComponent />}

      {/* Retourner si on doit afficher le contenu principal */}
      {showDiagnostic || showDebug || showBrevoTest ? null : true}
    </>
  );
};
