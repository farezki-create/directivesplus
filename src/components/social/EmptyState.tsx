
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const EmptyState = () => {
  return (
    <Card className="bg-white shadow-lg">
      <CardContent className="p-12 text-center">
        <div className="bg-gray-50 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <MessageCircle className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Aucun post pour le moment</h3>
        <p className="text-gray-600 mb-6">
          Soyez le premier à partager quelque chose avec la communauté !
        </p>
        <Button 
          onClick={() => document.querySelector('textarea')?.focus()}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Créer le premier post
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
