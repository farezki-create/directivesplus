import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  FileText,
  Stethoscope,
  User,
  Settings,
  LogOut,
  IdCard,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const AppNavigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationLinks = [
    {
      name: "Accueil",
      path: "/",
      icon: "home",
    },
    {
      name: "Mes directives",
      path: "/mes-directives",
      icon: "file-text",
    },
    {
      name: "Données médicales",
      path: "/donnees-medicales",
      icon: "stethoscope",
    },
    {
      name: "Carte d'accès",
      path: "/carte-acces",
      icon: "id-card",
    },
  ];

  const profileLinks = [
    {
      name: "Mon profil",
      path: "/profile",
      icon: "user",
    },
    {
      name: "Paramètres",
      path: "/settings",
      icon: "settings",
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "home":
        return <Home className="h-4 w-4 mr-2" />;
      case "file-text":
        return <FileText className="h-4 w-4 mr-2" />;
      case "stethoscope":
        return <Stethoscope className="h-4 w-4 mr-2" />;
      case "user":
        return <User className="h-4 w-4 mr-2" />;
      case "settings":
        return <Settings className="h-4 w-4 mr-2" />;
        case "id-card":
          return <IdCard className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="md:hidden absolute top-4 left-4 text-gray-700 hover:bg-gray-100"
        >
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-64">
        <SheetHeader className="text-left mt-6">
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>
            Explorez les différentes sections de votre espace personnel.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <h4 className="mb-2 font-semibold text-sm text-gray-500 uppercase">
            Navigation
          </h4>
          <ul className="space-y-2">
            {navigationLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`flex items-center px-4 py-2 rounded-md hover:bg-gray-100 ${
                    location.pathname === link.path
                      ? "bg-gray-100 font-medium"
                      : "text-gray-700"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {getIcon(link.icon)}
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h4 className="mb-2 font-semibold text-sm text-gray-500 uppercase">
            Profil
          </h4>
          <ul className="space-y-2">
            {profileLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`flex items-center px-4 py-2 rounded-md hover:bg-gray-100 ${
                    location.pathname === link.path
                      ? "bg-gray-100 font-medium"
                      : "text-gray-700"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {getIcon(link.icon)}
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AppNavigation;
