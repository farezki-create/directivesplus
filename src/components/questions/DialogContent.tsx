import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DialogContentProps {
  title: string;
  loading: boolean;
  questionsLength: number;
  children: React.ReactNode;
}

export function DialogContent({ 
  title, 
  loading, 
  questionsLength, 
  children 
}: DialogContentProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-semibold text-center">
          {title}
        </DialogTitle>
      </DialogHeader>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : questionsLength > 0 ? (
        <ScrollArea className="flex-1 px-1">
          <div className="space-y-6 py-4">
            {children}
          </div>
        </ScrollArea>
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          Aucune question trouvée.
        </div>
      )}
    </>
  );
}