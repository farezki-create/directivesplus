
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
    to: "/alertes",
  },
  // Correction ici : le bon path pour Multi-Patients
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

const ModernNavBar = () => {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <nav className="w-full bg-white border-b shadow-sm sticky top-0 z-30">
      <div className="px-4 sm:px-8 md:px-12 lg:px-20">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/rediger" className="flex items-center group">
              <span className="text-xl font-bold text-directiveplus-700 group-hover:text-directiveplus-800 transition-colors">
                <span className="text-directiveplus-600">
                  Directives
                </span>
                <span className="text-directiveplus-500">Plus</span>
              </span>
            </NavLink>
          </div>
          {/* Navigation */}
          <ul className="flex-1 flex justify-center gap-2 md:gap-4 lg:gap-6">
            {navItems.map(({ label, icon: Icon, to }) => (
              <li key={label} className="flex">
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-1.5 rounded-md font-medium transition-all
                      ${isActive
                        ? "bg-directiveplus-50 text-directiveplus-700 shadow border border-directiveplus-200"
                        : "text-gray-700 hover:bg-gray-50 hover:text-directiveplus-600"}`
                  }
                  end={to === "/profile"}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          {/* Déconnexion */}
          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2 font-semibold border border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                onClick={handleLogout}
              >
                <LogOut size={18} /> 
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ModernNavBar;
