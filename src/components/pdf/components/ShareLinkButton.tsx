
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface ShareLinkButtonProps {
  onShare: () => void;
}

export function ShareLinkButton({ onShare }: ShareLinkButtonProps) {
  return (
    <Button
      onClick={onShare}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Share2 className="h-4 w-4" />
      Copier le lien d'accès
    </Button>
  );
}
