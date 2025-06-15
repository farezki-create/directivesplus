
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MediaIconByType from "./MediaIconByType";
import { mediaTypeLabels, NewMedia } from "./NewsMediaForm";

interface NewsMediaListProps {
  mediaList: NewMedia[];
  removeMedia: (idx: number) => void;
}

const NewsMediaList: React.FC<NewsMediaListProps> = ({ mediaList, removeMedia }) => (
  <div>
    <span className="form-label font-medium">Médias ajoutés</span>
    <div className="space-y-2">
      {mediaList.length === 0 && (
        <div className="text-gray-500 text-sm">Aucun support ajouté.</div>
      )}
      {mediaList.map((media, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 border rounded p-2 bg-gray-50"
        >
          <Badge variant="secondary">{mediaTypeLabels[media.media_type]}</Badge>
          <span className="truncate flex-1">{media.media_url}</span>
          {media.caption && (
            <span className="text-xs text-gray-500 italic">
              [{media.caption}]
            </span>
          )}
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="text-red-600"
            onClick={() => removeMedia(idx)}
          >
            <MediaIconByType type={media.media_type} />
          </Button>
        </div>
      ))}
    </div>
  </div>
);

export default NewsMediaList;
