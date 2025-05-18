
import React from 'react';
import { Star } from 'lucide-react';

export interface Comment {
  id: string;
  name: string;
  role?: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  itemType: 'general' | 'questionnaires' | 'acces' | 'medical';
}

interface CommentListProps {
  comments: Comment[];
}

export const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  // Si pas de commentaires dans cette catégorie
  if (comments.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <p className="text-gray-500">Aucun commentaire disponible pour le moment dans cette catégorie.</p>
        <p className="text-gray-500 mt-2">Soyez le premier à partager votre expérience!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <h3 className="font-semibold text-lg text-gray-800">{comment.title}</h3>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    size={16}
                    className={i < comment.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {new Date(comment.date).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
          
          <p className="mt-4 text-gray-700">{comment.content}</p>
          
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center">
            <div className="h-10 w-10 rounded-full bg-directiveplus-100 flex items-center justify-center text-directiveplus-700 font-semibold">
              {comment.name.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="font-medium text-sm">{comment.name}</p>
              {comment.role && <p className="text-xs text-gray-500">{comment.role}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
