
import { Link } from "react-router-dom";
import { Heart, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Footer = () => {
  const { user } = useAuth();
  
  // Vérifier si l'utilisateur est admin
  const isAdmin = user?.email?.endsWith('@directivesplus.fr') || false;

  return (
    <footer className="bg-directiveplus-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/0736fb9f-e3d2-48ea-af2a-fd37ecaf8b1a.png" 
                alt="DirectivesPlus Logo" 
                className="w-12 h-12 mr-2"
              />
              <div>
                <h2 className="text-xl font-bold">DirectivesPlus</h2>
                <p className="text-sm text-gray-300">simplicité et sécurité</p>
              </div>
            </div>
            <p className="mb-4 text-gray-300">
              Notre mission est de faciliter la création, le stockage et le partage des directives anticipées pour tous.
            </p>
            <Link 
              to="/soutenir" 
              className="inline-flex items-center text-white bg-directiveplus-600 hover:bg-directiveplus-500 px-4 py-2 rounded-md transition-colors"
            >
              <Heart className="mr-2 h-4 w-4" />
              Soutenir le projet
            </Link>
          </div>

          {/* Produit */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Produit</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/commentaires" className="hover:text-white transition-colors">
                  Commentaires
                </Link>
              </li>
              <li>
                <Link to="/en-savoir-plus" className="hover:text-white transition-colors">
                  En savoir plus
                </Link>
              </li>
              <li>
                <Link to="/carte-acces" className="hover:text-white transition-colors">
                  Carte d'accès
                </Link>
              </li>
              <li>
                <Link to="/acces-institution" className="hover:text-white transition-colors">
                  Accès institutionnel
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:mesdirectives@directivesplus.fr" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <Link to="/mentions-legales" className="hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/confidentialite" className="hover:text-white transition-colors">
                  Confidentialité
                </Link>
              </li>
              {/* Lien admin visible uniquement pour les administrateurs */}
              {isAdmin && (
                <li>
                  <Link 
                    to="/security-dashboard" 
                    className="inline-flex items-center hover:text-white transition-colors text-yellow-300"
                  >
                    <Shield className="mr-1 h-4 w-4" />
                    Administration
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} DirectivesPlus. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
