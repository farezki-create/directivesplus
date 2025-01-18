import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ResponseCard } from "./ResponseCard";

interface UniqueIdentifierProps {
  userId: string;
}

export function UniqueIdentifier({ userId }: UniqueIdentifierProps) {
  const [uniqueIdentifier, setUniqueIdentifier] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniqueIdentifier = async () => {
      try {
        console.log("[UniqueIdentifier] Fetching unique identifier for user:", userId);
        const { data, error } = await supabase
          .from('profiles')
          .select('unique_identifier')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error("[UniqueIdentifier] Error fetching unique identifier:", error);
          return;
        }

        if (data) {
          console.log("[UniqueIdentifier] Found unique identifier:", data.unique_identifier);
          setUniqueIdentifier(data.unique_identifier);
        }
      } catch (error) {
        console.error("[UniqueIdentifier] Error in fetchUniqueIdentifier:", error);
      }
    };

    if (userId) {
      fetchUniqueIdentifier();
    }
  }, [userId]);

  return (
    <ResponseCard title="Identifiant unique">
      <p className="font-mono text-lg">
        {uniqueIdentifier || "Identifiant non disponible"}
      </p>
    </ResponseCard>
  );
}