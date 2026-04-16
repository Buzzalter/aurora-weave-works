import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GenerateButton } from '@/components/GenerateButton';
import { DropZone } from '@/components/DropZone';
import { useTaskPolling } from '@/hooks/useTaskPolling';
import { generateStudio } from '@/lib/api';
import { toast } from 'sonner';

const MOODS = ['Cinematic', 'Energetic', 'Calm', 'Dramatic', 'Whimsical'];
const STYLES = ['Photorealistic', 'Animation', 'Abstract', 'Documentary', 'Retro'];

export default function LTXStudio() {
  const [prompt, setPrompt] = useState('');
  const [mood, setMood] = useState('Cinematic');
  const [style, setStyle] = useState('Photorealistic');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { isLoading, progress, resultUrl, startPolling } = useTaskPolling();

  const handleGenerate = async () => {
    if (!prompt.trim()) { toast.warning('Enter a prompt.'); return; }
    toast.info('Starting studio generation…');
    try {
      const fd = new FormData();
      fd.append('prompt', prompt);
      fd.append('mood', mood);
      fd.append('style', style);
      if (imageFile) fd.append('image', imageFile);
      const { data } = await generateStudio(fd);
      startPolling(data.task_id, 'video');
    } catch {
      toast.error('Failed to start generation.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">LTX A/V Studio</h2>
        <p className="text-muted-foreground text-sm mt-1">All-in-one audio/visual content generator</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Prompt</Label>
            <Textarea placeholder="Describe your creative vision…" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={5} />
          </div>
          <div className="space-y-2">
            <Label>Reference Image (optional)</Label>
            <DropZone label="Drop reference image" onFile={setImageFile} />
          </div>
          <GenerateButton onClick={handleGenerate} isLoading={isLoading} progress={progress} label="Generate" />
          {resultUrl && (
            <div className="rounded-lg overflow-hidden border border-border shadow-soft">
              <video controls src={resultUrl} className="w-full" />
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-lg border border-border p-4 glass h-fit">
          <div className="space-y-2">
            <Label>Mood</Label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {MOODS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Style</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STYLES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
