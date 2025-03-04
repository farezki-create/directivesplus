
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { PurchaseDialog } from "./purchase/PurchaseDialog";
import { HeaderLogo } from "./header/HeaderLogo";
import { HeaderUserControls } from "./header/HeaderUserControls";
import { HeaderNavigation } from "./header/HeaderNavigation";

export const Header = () => {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isHomePage = location.pathname === "/";

  return (
    <>
      <header className="w-full border-b">
        <div className="container mx-auto px-4">
          {/* Top level - Logo and User Authentication */}
          <div className="py-3 flex justify-between items-center border-b">
            <HeaderLogo />
            <HeaderUserControls user={user} setUser={setUser} />
          </div>
          
          {/* Second level - Navigation */}
          <div className="py-2">
            <HeaderNavigation setShowPurchaseDialog={setShowPurchaseDialog} />
          </div>
        </div>
      </header>

      <PurchaseDialog 
        open={showPurchaseDialog}
        onOpenChange={setShowPurchaseDialog}
        user={user}
      />
    </>
  );
};
