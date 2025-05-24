
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Loader2 } from "lucide-react";
import { useSharing, type ShareableDocument } from "@/hooks/sharing/useSharing";
import { ShareDialog } from "./ShareDialog";

interface DocumentShareButtonProps {
  document: ShareableDocument;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export const DocumentShareButton: React.FC<DocumentShareButtonProps> = ({
  document,
  variant = "outline",
  size = "sm",
  className = ""
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isGenerating } = useSharing();

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsDialogOpen(true)}
        disabled={isGenerating}
        className={`flex items-center gap-1 ${className}`}
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Share2 className="h-4 w-4" />
        )}
        {isGenerating ? "Partage..." : "Partager"}
      </Button>

      <ShareDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        document={document}
      />
    </>
  );
};
