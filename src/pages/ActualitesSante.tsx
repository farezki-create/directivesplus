
import React from "react";
import Header from "@/components/Header";
import PageFooter from "@/components/layout/PageFooter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ActualitesSante = () => {
  const navigate = useNavigate();

  const articles = [
    {
      id: 1,
      title: "Comprendre les directives anticipées",
      excerpt: "Tout ce que vous devez savoir sur la rédaction de vos directives anticipées médicales.",
      author: "Dr. Martin",
      date: "2024-01-15",
      category: "Guide"
    },
    {
      id: 2,
      title: "L'importance de la personne de confiance",
      excerpt: "Comment choisir et désigner votre personne de confiance pour vos décisions médicales.",
      author: "Dr. Durand",
      date: "2024-01-10",
      category: "Conseil"
    },
    {
      id: 3,
      title: "Évolution de la législation",
      excerpt: "Les dernières modifications légales concernant les directives anticipées en France.",
      author: "Équipe juridique",
      date: "2024-01-05",
      category: "Juridique"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour
          </Button>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-directiveplus-800">
            Actualités Santé
          </h1>
          
          <div className="grid gap-6">
            {articles.map((article) => (
              <article key={article.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <span className="inline-block bg-directiveplus-100 text-directiveplus-700 px-3 py-1 rounded-full text-sm font-medium">
                    {article.category}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(article.date).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold mb-3 text-gray-900">
                  {article.title}
                </h2>
                
                <p className="text-gray-600 mb-4">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="w-4 h-4 mr-1" />
                    {article.author}
                  </div>
                  
                  <Button variant="outline" size="sm">
                    Lire la suite
                  </Button>
                </div>
              </article>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Vous souhaitez être informé des dernières actualités ?
            </p>
            <Button>
              S'abonner à la newsletter
            </Button>
          </div>
        </div>
      </main>
      
      <PageFooter />
    </div>
  );
};

export default ActualitesSante;
