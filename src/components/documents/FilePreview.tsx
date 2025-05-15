
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, X } from "lucide-react";
import { FilePreviewProps } from "./types";

const FilePreview: React.FC<FilePreviewProps> = ({ file, onClear }) => {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
      <div className="flex items-center gap-2">
        <FileText size={16} className="text-gray-600" />
        <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
        <span className="text-xs text-gray-500">
          ({(file.size / (1024 * 1024)).toFixed(2)} MB)
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClear}
        className="p-1 h-auto"
      >
        <X size={16} className="text-gray-500" />
      </Button>
    </div>
  );
};

export default FilePreview;
