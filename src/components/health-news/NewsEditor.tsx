import React, { useState } from 'react';
import { useHealthNews } from '@/hooks/useHealthNews';
import { CreateHealthNewsData } from '@/types/healthNews';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Upload, X } from 'lucide-react';
import MediaIcon from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NewsEditorProps {
  onClose: () => void;
  onSave: () => void;
  existingNews?: any;
}

type NewMedia = {
  media_type: "image" | "video" | "audio" | "document" | "link";
  media_url: string;
  media_name?: string;
  caption?: string;
};

const initialNewMedia: NewMedia = {
  media_type: "image",
  media_url: "",
  media_name: "",
  caption: "",
};

const mediaTypeLabels = {
  image: "Image",
  video: "Vidéo",
  audio: "Audio",
  document: "Document",
  link: "Lien externe",
};

// Ajout pour l’affichage intelligent de l’icône du média
import { Image as ImageIcon, Video, FileAudio, FileText, Link2 } from "lucide-react";

// Utilitaire pour trouver l’icône selon le type
function getMediaIcon(mediaType: string) {
  switch (mediaType) {
    case "image":
      return <ImageIcon className="h-4 w-4" />;
    case "video":
      return <Video className="h-4 w-4" />;
    case "audio":
      return <FileAudio className="h-4 w-4" />;
    case "document":
      return <FileText className="h-4 w-4" />;
    case "link":
      return <Link2 className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}

const NewsEditor = ({ onClose, onSave, existingNews }: NewsEditorProps) => {
  const { createNews, updateNews, addMedia } = useHealthNews();
  const [formData, setFormData] = useState<CreateHealthNewsData>({
    title: existingNews?.title || "",
    content: existingNews?.content || "",
    excerpt: existingNews?.excerpt || "",
    featured_image_url: existingNews?.featured_image_url || "",
    category: existingNews?.category || "general",
    status: existingNews?.status || "draft",
    publication_date: existingNews?.publication_date || "",
    tags: existingNews?.tags || [],
    is_featured: existingNews?.is_featured || false,
  });

  const [newTag, setNewTag] = useState("");
  const [newMedia, setNewMedia] = useState<NewMedia>(initialNewMedia);
  const [mediaList, setMediaList] = useState<NewMedia[]>(existingNews?.media ?? []);

  const handleAddMedia = () => {
    if (!newMedia.media_url) return;
    setMediaList([...mediaList, newMedia]);
    setNewMedia(initialNewMedia);
  };

  const removeMedia = (idx: number) => {
    setMediaList((medias) => medias.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let newsId = existingNews?.id;
    let createdNews = null;
    let success = true;

    if (existingNews) {
      // updateNews retourne un booléen
      success = await updateNews(existingNews.id, { ...formData });
      newsId = existingNews.id;
    } else {
      // createNews retourne l’objet HealthNews ou null
      createdNews = await createNews(formData);
      newsId = createdNews?.id;
      success = !!createdNews;
    }

    // Envoi des médias
    if (newsId && success && mediaList.length > 0) {
      for (const media of mediaList) {
        await addMedia(newsId, {
          ...media,
          news_id: newsId,
          display_order: 0,
          // S’assurer que media_name est toujours défini (le champ est requis côté Typage)
          media_name: media.media_name || "",
          caption: media.caption,
          media_type: media.media_type,
          media_url: media.media_url,
          // fields optionnels ignorés
        });
      }
    }

    onSave();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {existingNews ? "Modifier l'actualité" : "Nouvelle actualité"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Contenu</TabsTrigger>
              <TabsTrigger value="media">Médias</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Résumé</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                  placeholder="Résumé de l'actualité..."
                />
              </div>

              <div>
                <Label htmlFor="content">Contenu *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={10}
                  required
                  placeholder="Contenu complet de l'actualité..."
                />
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              {/* Section Ajout de média */}
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
                    required
                  />
                </div>
                <div>
                  <Label>Nom du fichier/support (optionnel)</Label>
                  <Input
                    value={newMedia.media_name}
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
                    value={newMedia.caption}
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
                    disabled={!newMedia.media_url}
                  >
                    <span>Ajouter ce support</span>
                  </Button>
                </div>
              </div>

              {/* Liste des médias ajoutés */}
              <div>
                <Label>Médias ajoutés</Label>
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
                        {getMediaIcon(media.media_type)}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Général</SelectItem>
                      <SelectItem value="prevention">Prévention</SelectItem>
                      <SelectItem value="recherche">Recherche</SelectItem>
                      <SelectItem value="nutrition">Nutrition</SelectItem>
                      <SelectItem value="mental">Santé mentale</SelectItem>
                      <SelectItem value="actualite">Actualité</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'draft' | 'published') => 
                      setFormData(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="published">Publié</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="publication_date">Date de publication</Label>
                <Input
                  id="publication_date"
                  type="datetime-local"
                  value={formData.publication_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, publication_date: e.target.value }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                />
                <Label htmlFor="is_featured">Article à la une</Label>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Ajouter un tag..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map((tag, index) => (
                    <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                      <span className="text-sm">{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {existingNews ? "Mettre à jour" : "Créer l'actualité"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewsEditor;
