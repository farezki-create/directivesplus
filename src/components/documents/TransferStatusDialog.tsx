import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Download, Upload, ArrowRightLeft } from "lucide-react";
import { TransferStatus } from "@/hooks/useDocumentTransfer";

interface TransferStatusDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  status: TransferStatus;
}

const TransferStatusDialog: React.FC<TransferStatusDialogProps> = ({
  isOpen,
  onOpenChange,
  status
}) => {
  const getIcon = () => {
    switch (status.phase) {
      case 'downloading':
        return <Download className="h-6 w-6 text-blue-500 animate-spin" />;
      case 'processing':
        return <ArrowRightLeft className="h-6 w-6 text-yellow-500 animate-pulse" />;
      case 'transferring':
        return <Upload className="h-6 w-6 text-purple-500 animate-bounce" />;
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return null;
    }
  };

  const getProgressColor = () => {
    switch (status.phase) {
      case 'downloading':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'transferring':
        return 'bg-purple-500';
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {getIcon()}
            Transfert de document
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              {status.message}
            </p>
            
            <Progress 
              value={status.progress} 
              className="w-full h-3"
            />
            
            <p className="text-xs text-gray-500 mt-2">
              {status.progress}% terminé
            </p>
          </div>
          
          {status.phase === 'downloading' && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                📥 Récupération du document depuis la source...
              </p>
            </div>
          )}
          
          {status.phase === 'processing' && (
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚙️ Préparation du document pour le transfert...
              </p>
            </div>
          )}
          
          {status.phase === 'transferring' && (
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-purple-800">
                📤 Ajout du document à "Mes Directives"...
              </p>
            </div>
          )}
          
          {status.phase === 'completed' && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Document transféré avec succès !
              </p>
            </div>
          )}
          
          {status.phase === 'error' && (
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-red-800">
                ❌ Une erreur s'est produite lors du transfert.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransferStatusDialog;
