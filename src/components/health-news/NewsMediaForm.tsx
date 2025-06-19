
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type NewMedia = {
  media_type: "image" | "video" | "audio" | "document" | "link";
  media_url: string;
  media_name?: string;
  caption?: string;
};

const mediaTypeLabels = {
  image: "Image",
  video: "Vidéo",
  audio: "Audio",
  document: "Document",
  link: "Lien externe",
};

interface NewsMediaFormProps {
  newMedia: NewMedia;
  setNewMedia: React.Dispatch<React.SetStateAction<NewMedia>>;
  handleAddMedia: () => void;
}

const NewsMediaForm: React.FC<NewsMediaFormProps> = ({
  newMedia,
  setNewMedia,
  handleAddMedia,
}) => {
  const isValidUrl = (url: string) => {
    if (!url.trim()) return false;
    // Vérification simple pour s'assurer que l'URL commence par http ou https
    return url.startsWith('http://') || url.startsWith('https://');
  };

  const isFormValid = isValidUrl(newMedia.media_url);

  return (
    <div className="grid md:grid-cols-2 gap-4 items-end">
      <div>
        <Label>Type de support</Label>
        <Select
          value={newMedia.media_type}
          onValueChange={(v) =>
            setNewMedia((prev) => ({
              ...prev,
              media_type: v as NewMedia["media_type"],
            }))
          }
        >
          <SelectTrigger>
            <SelectValue>{mediaTypeLabels[newMedia.media_type]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="video">Vidéo</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
            <SelectItem value="document">Document</SelectItem>
            <SelectItem value="link">Lien externe</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>URL ou chemin du média</Label>
        <Input
          value={newMedia.media_url}
          onChange={(e) =>
            setNewMedia((prev) => ({
              ...prev,
              media_url: e.target.value,
            }))
          }
          placeholder="https://..."
          className={!isFormValid && newMedia.media_url ? "border-red-500" : ""}
        />
        {!isFormValid && newMedia.media_url && (
          <p className="text-sm text-red-500 mt-1">
            L'URL doit commencer par http:// ou https://
          </p>
        )}
      </div>
      <div>
        <Label>Nom du fichier/support (optionnel)</Label>
        <Input
          value={newMedia.media_name || ""}
          onChange={(e) =>
            setNewMedia((prev) => ({
              ...prev,
              media_name: e.target.value,
            }))
          }
          placeholder="Nom ou titre du média"
        />
      </div>
      <div>
        <Label>Légende (optionnel)</Label>
        <Input
          value={newMedia.caption || ""}
          onChange={(e) =>
            setNewMedia((prev) => ({
              ...prev,
              caption: e.target.value,
            }))
          }
          placeholder="Légende, description, contexte…"
        />
      </div>
      <div className="md:col-span-2 flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleAddMedia}
          disabled={!isFormValid}
        >
          <span>Ajouter ce support</span>
        </Button>
      </div>
    </div>
  );
};

export type { NewMedia };
export { mediaTypeLabels };
export default NewsMediaForm;
