
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto container-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold text-directiveplus-700">DirectivePlus</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-directiveplus-600 px-3 py-2 font-medium">
              Accueil
            </a>
            <a href="#features" className="text-gray-700 hover:text-directiveplus-600 px-3 py-2 font-medium">
              Fonctionnalités
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-directiveplus-600 px-3 py-2 font-medium">
              Témoignages
            </a>
            <a href="#" className="text-gray-700 hover:text-directiveplus-600 px-3 py-2 font-medium">
              Contact
            </a>
          </nav>
          
          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="border-directiveplus-200 text-directiveplus-700 hover:bg-directiveplus-50">
              Se connecter
            </Button>
            <Button className="bg-directiveplus-600 hover:bg-directiveplus-700">
              Essai gratuit
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-directiveplus-600"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-md">
            <a href="#" className="block px-3 py-2 text-gray-700 hover:text-directiveplus-600 font-medium">
              Accueil
            </a>
            <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-directiveplus-600 font-medium">
              Fonctionnalités
            </a>
            <a href="#testimonials" className="block px-3 py-2 text-gray-700 hover:text-directiveplus-600 font-medium">
              Témoignages
            </a>
            <a href="#" className="block px-3 py-2 text-gray-700 hover:text-directiveplus-600 font-medium">
              Contact
            </a>
            <div className="mt-4 flex flex-col space-y-2">
              <Button variant="outline" className="border-directiveplus-200 text-directiveplus-700 hover:bg-directiveplus-50 w-full">
                Se connecter
              </Button>
              <Button className="bg-directiveplus-600 hover:bg-directiveplus-700 w-full">
                Essai gratuit
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
