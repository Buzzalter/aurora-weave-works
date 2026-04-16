import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGallery, GalleryAsset } from '@/store/galleryStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (asset: GalleryAsset) => void;
  filterType?: 'image' | 'video' | 'audio';
}

export function AssetPickerModal({ open, onClose, onSelect, filterType }: Props) {
  const { assets } = useGallery();
  const types = filterType ? [filterType] : (['image', 'video', 'audio'] as const);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select from Gallery</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={types[0]}>
          {!filterType && (
            <TabsList>
              <TabsTrigger value="image">Images</TabsTrigger>
              <TabsTrigger value="video">Videos</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
            </TabsList>
          )}
          {types.map((t) => (
            <TabsContent key={t} value={t}>
              <div className="grid grid-cols-3 gap-3">
                {assets
                  .filter((a) => a.type === t)
                  .map((a) => (
                    <button
                      key={a.id}
                      onClick={() => { onSelect(a); onClose(); }}
                      className="group relative rounded-md overflow-hidden border border-border hover:ring-2 hover:ring-primary transition-all"
                    >
                      {t === 'image' && <img src={a.url} alt={a.name} className="w-full h-24 object-cover" />}
                      {t === 'video' && (
                        <div className="flex items-center justify-center h-24 bg-muted text-muted-foreground text-xs">
                          🎬 {a.name}
                        </div>
                      )}
                      {t === 'audio' && (
                        <div className="flex items-center justify-center h-24 bg-muted text-muted-foreground text-xs">
                          🎵 {a.name}
                        </div>
                      )}
                    </button>
                  ))}
                {assets.filter((a) => a.type === t).length === 0 && (
                  <p className="col-span-3 text-center text-sm text-muted-foreground py-8">
                    No {t}s in gallery yet.
                  </p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
