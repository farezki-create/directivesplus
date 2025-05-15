import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

interface ListItemProps {
  href: string;
  title: string;
  children?: React.ReactNode;
}

function ListItem({ href, title, children }: ListItemProps) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          to={href}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

const AppNavigation = () => {
  const { user, signOut, profile } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold text-directiveplus-600">
              DirectivesPlus
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Documents</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-directiveplus-500 to-directiveplus-600 p-6 text-white no-underline outline-none focus:shadow-md"
                            to="/rediger"
                          >
                            <div className="text-lg font-medium mb-2">Rédiger mes directives</div>
                            <p className="text-directiveplus-100 text-sm">
                              Créez vos directives anticipées en répondant à des questions simples
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/mes-directives" title="Mes Directives">
                        Consultez et gérez vos directives anticipées
                      </ListItem>
                      <ListItem href="/donnees-medicales" title="Données médicales">
                        Gérez vos documents médicaux importants
                      </ListItem>
                      <ListItem href="/acces-document" title="Accès document">
                        Accès sans connexion aux documents médicaux
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/profile"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:shadow-md"
                    >
                      <div className="text-sm font-medium leading-none">Profile</div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        Gérer votre profil
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            {user && (
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} />
                  <AvatarFallback>{profile?.first_name?.charAt(0)}{profile?.last_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" onClick={signOut}>
                  Se déconnecter
                </Button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 py-4">
            <Link
              to="/rediger"
              className="block px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Rédiger mes directives
            </Link>
            <Link
              to="/mes-directives"
              className="block px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Mes Directives
            </Link>
            <Link
              to="/donnees-medicales"
              className="block px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Données médicales
            </Link>
            <Link
              to="/acces-document"
              className="block px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Accès document
            </Link>
            <Link
              to="/profile"
              className="block px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <Button variant="outline" size="sm" onClick={signOut}>
              Se déconnecter
            </Button>
          </div>
          
          <div className="mt-4">
            {user && (
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} />
                  <AvatarFallback>{profile?.first_name?.charAt(0)}{profile?.last_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{profile?.first_name} {profile?.last_name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default AppNavigation;
