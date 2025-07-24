import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  FileText, 
  FileCheck, 
  Activity, 
  Bell, 
  Users, 
  IdCard, 
  User, 
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Rédiger",
    icon: FileText,
    to: "/rediger",
    color: "text-blue-400"
  },
  {
    label: "Mes Directives",
    icon: FileCheck,
    to: "/mes-directives",
    color: "text-green-400"
  },
  {
    label: "Suivi Palliatif",
    icon: Activity,
    to: "/suivi-palliatif",
    color: "text-purple-400"
  },
  {
    label: "Alertes",
    icon: Bell,
    to: "/alert-management",
    color: "text-orange-400"
  },
  {
    label: "Multi-Patients",
    icon: Users,
    to: "/suivi-multi-patients",
    color: "text-cyan-400"
  },
  {
    label: "Carte d'Accès",
    icon: IdCard,
    to: "/carte-acces",
    color: "text-indigo-400"
  },
  {
    label: "Profil",
    icon: User,
    to: "/profile",
    color: "text-pink-400"
  }
];

interface ModernSidebarProps {
  hideEditingFeatures?: boolean;
}

export const ModernSidebar = ({ hideEditingFeatures = false }: ModernSidebarProps) => {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-white/90 backdrop-blur-sm border-nav-border"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out",
        "bg-gradient-to-b from-nav-background to-nav-secondary",
        "border-r border-nav-border shadow-large",
        "lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isCollapsed ? "lg:w-16" : "lg:w-64",
        "w-64"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-nav-border">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-nav-primary to-blue-500 rounded-lg flex items-center justify-center">
                    <FileText size={16} className="text-white" />
                  </div>
                  <span className="font-semibold text-nav-foreground text-lg">
                    DirectivesPlus
                  </span>
                </div>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex text-nav-foreground hover:bg-nav-accent"
              >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navItems.map(({ label, icon: Icon, to, color }) => (
                <NavLink
                  key={label}
                  to={to}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                      "text-nav-foreground/80 hover:text-nav-foreground",
                      "hover:bg-nav-accent group relative",
                      isActive && "bg-nav-accent text-nav-foreground shadow-soft border border-nav-border/50",
                      isCollapsed && "justify-center"
                    )
                  }
                >
                  <Icon size={20} className={cn("flex-shrink-0", color)} />
                  {!isCollapsed && (
                    <span className="font-medium">{label}</span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-nav-background text-nav-foreground text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                      {label}
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-nav-border">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center gap-3 text-nav-foreground/80 hover:text-nav-foreground",
                "hover:bg-red-500/10 hover:text-red-400 transition-all duration-200",
                isCollapsed && "justify-center px-3"
              )}
            >
              <LogOut size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Déconnexion</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content spacer */}
      <div className={cn(
        "hidden lg:block transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )} />
    </>
  );
};