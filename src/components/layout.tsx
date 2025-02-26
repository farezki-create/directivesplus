
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface LayoutProps {
  isIndex?: boolean;
}

export default function Layout({ isIndex }: LayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    }

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className={`min-h-screen ${isIndex ? 'bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800' : ''}`}>
      <div className="container mx-auto px-4">
        <Outlet />
      </div>
    </div>
  );
}
