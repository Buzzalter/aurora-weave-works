import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGallery } from '@/store/galleryStore';
import { Button } from '@/components/ui/button';
import { Download, Trash2, Play } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function Gallery() {
  const { assets, removeAsset } = useGallery();

  const images = assets.filter((a) => a.type === 'image');
  const videos = assets.filter((a) => a.type === 'video');
  const audios = assets.filter((a) => a.type === 'audio');

  const handleDownload = (url: string, name: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    toast.success('Download started');
  };

  const handleDelete = (id: string) => {
    removeAsset(id);
    toast.info('Asset removed');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Gallery</h2>
        <p className="text-muted-foreground text-sm mt-1">Browse your generated assets</p>
      </div>

      <Tabs defaultValue="images">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="images" className="flex-1">Images ({images.length})</TabsTrigger>
          <TabsTrigger value="videos" className="flex-1">Videos ({videos.length})</TabsTrigger>
          <TabsTrigger value="audio" className="flex-1">Audio ({audios.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="images" className="mt-4">
          {images.length === 0 ? (
            <EmptyState text="No images yet. Start generating!" />
          ) : (
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
              <AnimatePresence>
                {images.map((a) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group relative break-inside-avoid rounded-lg overflow-hidden border border-border"
                  >
                    <img src={a.url} alt={a.name} className="w-full" />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-end justify-center pb-3 gap-2 opacity-0 group-hover:opacity-100">
                      <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleDownload(a.url, a.name)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(a.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>

        <TabsContent value="videos" className="mt-4">
          {videos.length === 0 ? (
            <EmptyState text="No videos yet. Start generating!" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {videos.map((a) => (
                <div key={a.id} className="group relative rounded-lg overflow-hidden border border-border">
                  <video src={a.url} className="w-full" />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <Button size="icon" variant="secondary" className="h-10 w-10" onClick={() => {
                      const v = document.createElement('video');
                      v.src = a.url;
                      v.controls = true;
                      // Simple play approach
                      window.open(a.url, '_blank');
                    }}>
                      <Play className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleDownload(a.url, a.name)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(a.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="audio" className="mt-4">
          {audios.length === 0 ? (
            <EmptyState text="No audio yet. Start generating!" />
          ) : (
            <div className="space-y-3">
              {audios.map((a) => (
                <div key={a.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{a.name}</p>
                    <audio controls src={a.url} className="w-full mt-2" />
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => handleDownload(a.url, a.name)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(a.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <p className="text-sm">{text}</p>
    </div>
  );
}
