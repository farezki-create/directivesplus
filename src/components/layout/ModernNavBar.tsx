
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, FileText, FileCheck, Activity, Bell, Users, IdCard, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    label: "Rédiger",
    icon: FileText,
    to: "/rediger",
  },
  {
    label: "Mes Directives",
    icon: FileCheck,
    to: "/mes-directives",
  },
  {
    label: "Suivi Palliatif",
    icon: Activity,
    to: "/suivi-palliatif",
  },
  {
    label: "Alertes",
    icon: Bell,
    to: "/alert-management",
  },
  {
    label: "Multi-Patients",
    icon: Users,
    to: "/suivi-multi-patients",
  },
  {
    label: "Carte d'Accès",
    icon: IdCard,
    to: "/carte-acces",
  },
  {
    label: "Profil",
    icon: User,
    to: "/profile",
  }
];

interface ModernNavBarProps {
  hideEditingFeatures?: boolean;
}

const ModernNavBar = ({ hideEditingFeatures = false }: ModernNavBarProps) => {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <nav className="w-full bg-background border-b border-nav-border sticky top-0 z-30 backdrop-blur-sm bg-opacity-95">
      <div className="px-4 sm:px-8 md:px-12 lg:px-20">
        <div className="flex items-center justify-between h-16">
          {/* Navigation centrée avec style moderne */}
          <ul className="flex-1 flex justify-center gap-1 md:gap-2 lg:gap-4">
            {navItems.map(({ label, icon: Icon, to }) => (
              <li key={label} className="flex">
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `group flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl font-medium transition-all duration-300 relative
                      ${isActive
                        ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                        : "text-foreground/80 hover:bg-primary/5 hover:text-primary hover:scale-105"}`
                  }
                  end={to === "/profile"}
                >
                  <Icon size={18} className="transition-transform group-hover:scale-110" />
                  <span className="hidden sm:inline text-sm">{label}</span>
                  {/* Effet de ligne active */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-8" />
                </NavLink>
              </li>
            ))}
          </ul>
          {/* Déconnexion avec style chaleureux */}
          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="group flex items-center gap-2 font-medium border border-border text-foreground/80 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-300 rounded-xl px-4 py-2"
                onClick={handleLogout}
              >
                <LogOut size={18} className="transition-transform group-hover:scale-110" /> 
                <span className="hidden sm:inline text-sm">Déconnexion</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ModernNavBar;
