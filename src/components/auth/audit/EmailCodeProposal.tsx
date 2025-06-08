
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Key } from "lucide-react";

const EmailCodeProposal = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-6 h-6" />
          Proposition: Système de Codes par Email
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Key className="h-4 w-4" />
          <AlertDescription>
            <strong>Amélioration proposée:</strong> Implémenter un système de codes de vérification par email 
            en complément de la confirmation par lien.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h4 className="font-medium">Fonctionnalités à développer:</h4>
          <div className="grid gap-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Génération de codes OTP</p>
                <p className="text-sm text-gray-600">Codes à 6 chiffres avec expiration de 10 minutes</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Interface de saisie de code</p>
                <p className="text-sm text-gray-600">Composant dédié pour la saisie du code reçu par email</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Edge Function d'envoi</p>
                <p className="text-sm text-gray-600">Fonction serverless pour l'envoi sécurisé des codes</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Table de stockage des codes</p>
                <p className="text-sm text-gray-600">Stockage sécurisé avec expiration automatique</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Limitation des tentatives</p>
                <p className="text-sm text-gray-600">Protection contre les attaques par force brute</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Avantages:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Sécurité renforcée avec double validation</li>
            <li>• Expérience utilisateur améliorée (pas besoin d'accéder à sa boîte mail)</li>
            <li>• Réduction des inscriptions abandonnées</li>
            <li>• Compatible avec les clients email restrictifs</li>
            <li>• Audit trail complet des tentatives d'authentification</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailCodeProposal;
