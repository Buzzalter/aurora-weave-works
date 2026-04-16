import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { GenerateButton } from '@/components/GenerateButton';
import { DropZone } from '@/components/DropZone';
import { LipSyncSection } from '@/components/LipSyncSection';
import { useTaskPolling } from '@/hooks/useTaskPolling';
import { generateVideo } from '@/lib/api';
import { toast } from 'sonner';

export default function VideoGeneration() {
  const [tab, setTab] = useState('text');
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { isLoading, progress, resultUrl, startPolling } = useTaskPolling();

  const handleGenerate = async () => {
    if (tab === 'text' && !prompt.trim()) { toast.warning('Enter a prompt.'); return; }
    if (tab === 'image' && !imageFile) { toast.warning('Upload an image.'); return; }
    toast.info('Starting video generation…');
    try {
      const fd = new FormData();
      fd.append('mode', tab);
      if (prompt) fd.append('prompt', prompt);
      if (imageFile) fd.append('image', imageFile);
      if (audioUrl) fd.append('audio_url', audioUrl);
      const { data } = await generateVideo(fd);
      startPolling(data.task_id, 'video');
    } catch {
      toast.error('Failed to start generation.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Video Generation</h2>
        <p className="text-muted-foreground text-sm mt-1">Create videos from text or images</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="text">Text-to-Video</TabsTrigger>
          <TabsTrigger value="image">Image-to-Video</TabsTrigger>
        </TabsList>
        <TabsContent value="text" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Prompt</Label>
            <Textarea placeholder="Describe your video…" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} />
          </div>
        </TabsContent>
        <TabsContent value="image" className="space-y-4 mt-4">
          <DropZone label="Drop source image" onFile={setImageFile} />
          <div className="space-y-2">
            <Label>Prompt (optional)</Label>
            <Textarea placeholder="Describe motion or style…" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} />
          </div>
        </TabsContent>
      </Tabs>

      <LipSyncSection audioUrl={audioUrl} onAudioSelected={setAudioUrl} />
      <GenerateButton onClick={handleGenerate} isLoading={isLoading} progress={progress} label="Generate Video" />

      {resultUrl && (
        <div className="rounded-lg overflow-hidden border border-border shadow-soft">
          <video controls src={resultUrl} className="w-full" />
        </div>
      )}
    </div>
  );
}
