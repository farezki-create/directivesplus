
import React from "react";
import AppNavigation from "@/components/AppNavigation";
import { DatabaseDiagnostic } from "@/components/debug/DatabaseDiagnostic";

const Diagnostic = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavigation />
      
      <main className="container mx-auto px-4 py-8">
        <DatabaseDiagnostic />
      </main>
    </div>
  );
};

export default Diagnostic;
