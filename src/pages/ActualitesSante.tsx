
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';

const ActualitesSante = () => {
  const articles = [
    {
      id: 1,
      title: "Nouvelles directives anticipées : ce qui change en 2024",
      excerpt: "Découvrez les dernières évolutions législatives concernant les directives anticipées...",
      date: "15 mars 2024",
      author: "Dr. Marie Dubois",
      category: "Législation"
    },
    {
      id: 2,
      title: "L'importance du dialogue avec ses proches",
      excerpt: "Comment aborder le sujet des directives anticipées avec sa famille...",
      date: "10 mars 2024",
      author: "Prof. Jean Martin",
      category: "Conseil"
    },
    {
      id: 3,
      title: "Soins palliatifs : accompagner la fin de vie",
      excerpt: "Les soins palliatifs permettent d'améliorer la qualité de vie des patients...",
      date: "5 mars 2024",
      author: "Dr. Sophie Leroux",
      category: "Soins"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-directiveplus-800 mb-4">
              Actualités Santé
            </h1>
            <p className="text-xl text-gray-600">
              Restez informé des dernières actualités en matière de santé et de directives anticipées
            </p>
          </div>

          <div className="space-y-6">
            {articles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary">{article.category}</Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {article.date}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{article.title}</CardTitle>
                  <CardDescription className="text-base">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-1" />
                    {article.author}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ActualitesSante;
