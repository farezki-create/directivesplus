
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Loader2 } from "lucide-react";
import { useUnifiedDocumentSharing, type ShareableDocument } from "@/hooks/sharing/useUnifiedDocumentSharing";
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
  const { isSharing } = useUnifiedDocumentSharing();

  const isCurrentDocumentSharing = isSharing === document.id;

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsDialogOpen(true)}
        disabled={isCurrentDocumentSharing}
        className={`flex items-center gap-1 ${className}`}
      >
        {isCurrentDocumentSharing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Share2 className="h-4 w-4" />
        )}
        {isCurrentDocumentSharing ? "Partage..." : "Partager"}
      </Button>

      <ShareDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        document={document}
      />
    </>
  );
};
