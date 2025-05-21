
import React from "react";
import { useParams } from "react-router-dom";
import DocumentViewer from "./DocumentViewer";

const DirectivesViewer: React.FC = () => {
  const { dossierId } = useParams<{ dossierId: string }>();
  
  return <DocumentViewer />;
};

export default DirectivesViewer;
