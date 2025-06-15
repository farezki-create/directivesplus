
import React from "react";
import { Image as ImageIcon, Video, FileAudio, FileText, Link2 } from "lucide-react";

type MediaIconByTypeProps = {
  type: "image" | "video" | "audio" | "document" | "link" | string;
  className?: string;
};

const MediaIconByType = ({ type, className }: MediaIconByTypeProps) => {
  switch (type) {
    case "image":
      return <ImageIcon className={className ?? "h-4 w-4"} />;
    case "video":
      return <Video className={className ?? "h-4 w-4"} />;
    case "audio":
      return <FileAudio className={className ?? "h-4 w-4"} />;
    case "document":
      return <FileText className={className ?? "h-4 w-4"} />;
    case "link":
      return <Link2 className={className ?? "h-4 w-4"} />;
    default:
      return <FileText className={className ?? "h-4 w-4"} />;
  }
};

export default MediaIconByType;
