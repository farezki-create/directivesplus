
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star, User } from "lucide-react";

const mockComments = [
  {
    id: 1,
    name: "Marie Dupont",
    rating: 5,
    comment: "Une plateforme excellente qui m'a permis de rédiger mes directives anticipées en toute simplicité. L'interface est claire et le processus bien guidé.",
    date: "2024-01-15"
  },
  {
    id: 2,
    name: "Pierre Martin",
    rating: 4,
    comment: "Très utile pour organiser mes volontés médicales. La fonction de partage avec les proches est particulièrement appréciable.",
    date: "2024-01-10"
  },
  {
    id: 3,
    name: "Sophie Bernard",
    rating: 5,
    comment: "Je recommande vivement DirectivesPlus. Cela m'a donné la tranquillité d'esprit de savoir que mes souhaits seront respectés.",
    date: "2024-01-05"
  },
  {
    id: 4,
    name: "Jean Moreau",
    rating: 5,
    comment: "Interface intuitive et sécurisée. Le service client est également très réactif en cas de questions.",
    date: "2023-12-28"
  }
];

const CommentsList = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-directiveplus-700 mb-4">
          Ce que disent nos utilisateurs
        </h2>
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-gray-600">4.8/5 basé sur {mockComments.length} avis</span>
        </div>
      </div>
      
      <div className="grid gap-6">
        {mockComments.map((comment) => (
          <Card key={comment.id} className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-directiveplus-100 rounded-full p-2">
                    <User className="h-4 w-4 text-directiveplus-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{comment.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= comment.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{comment.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommentsList;
