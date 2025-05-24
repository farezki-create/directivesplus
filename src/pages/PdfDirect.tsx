
import React from "react";
import { useParams, Navigate } from "react-router-dom";

const PdfDirect = () => {
  const { documentId } = useParams<{ documentId: string }>();

  if (!documentId) {
    return <Navigate to="/mes-directives" replace />;
  }

  // Rediriger vers le visualisateur PDF avec le paramètre inapp=true
  return <Navigate to={`/pdf-viewer?id=${documentId}&inapp=true`} replace />;
};

export default PdfDirect;
