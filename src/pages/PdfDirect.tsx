
import React from "react";
import { useParams, Navigate } from "react-router-dom";
import PdfViewer from "./PdfViewer";

const PdfDirect = () => {
  const { documentId } = useParams<{ documentId: string }>();

  if (!documentId) {
    return <Navigate to="/mes-directives" replace />;
  }

  // Rediriger vers le visualisateur PDF avec le bon paramètre
  return <Navigate to={`/pdf-viewer?id=${documentId}`} replace />;
};

export default PdfDirect;
