
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Database, Mail, Users } from "lucide-react";

const AuthAuditMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Niveau de sécurité</p>
              <p className="text-2xl font-bold text-blue-600">Moyen</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Database className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Base de données</p>
              <p className="text-2xl font-bold text-green-600">OK</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Mail className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">Système email</p>
              <p className="text-2xl font-bold text-yellow-600">À améliorer</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Gestion utilisateurs</p>
              <p className="text-2xl font-bold text-blue-600">Fonctionnel</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthAuditMetrics;
