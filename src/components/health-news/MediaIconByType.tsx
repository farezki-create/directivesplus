
import React from 'react';
import { Image, Video, Music, FileText, File, Link, ExternalLink } from 'lucide-react';

interface MediaIconByTypeProps {
  type: string;
  className?: string;
}

const MediaIconByType = ({ type, className = "h-4 w-4" }: MediaIconByTypeProps) => {
  switch (type.toLowerCase()) {
    case 'image':
      return <Image className={className} />;
    case 'video':
      return <Video className={className} />;
    case 'audio':
      return <Music className={className} />;
    case 'document':
      return <FileText className={className} />;
    case 'link':
      return <ExternalLink className={className} />;
    default:
      return <File className={className} />;
  }
};

export default MediaIconByType;
