import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { GenerateButton } from '@/components/GenerateButton';
import { DropZone } from '@/components/DropZone';
import { LipSyncSection } from '@/components/LipSyncSection';
import { useTaskPolling } from '@/hooks/useTaskPolling';
import { animateBody } from '@/lib/api';
import { toast } from 'sonner';

export default function FullBodyAnimation() {
  const [charFile, setCharFile] = useState<File | null>(null);
  const [poseFile, setPoseFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { isLoading, progress, resultUrl, startPolling } = useTaskPolling();

  const handleGenerate = async () => {
    if (!charFile) { toast.warning('Upload a character image.'); return; }
    if (!poseFile) { toast.warning('Upload a pose video.'); return; }
    toast.info('Starting animation…');
    try {
      const fd = new FormData();
      fd.append('character', charFile);
      fd.append('pose', poseFile);
      if (audioUrl) fd.append('audio_url', audioUrl);
      const { data } = await animateBody(fd);
      startPolling(data.task_id, 'video');
    } catch {
      toast.error('Failed to start animation.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Full Body Animation</h2>
        <p className="text-muted-foreground text-sm mt-1">Animate characters with pose reference videos</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Source Character Image</Label>
          <DropZone label="Drop character image" onFile={setCharFile} />
        </div>
        <div className="space-y-2">
          <Label>Pose Video</Label>
          <DropZone label="Drop pose video" accept="video/*" onFile={setPoseFile} />
        </div>
      </div>

      <LipSyncSection audioUrl={audioUrl} onAudioSelected={setAudioUrl} />
      <GenerateButton onClick={handleGenerate} isLoading={isLoading} progress={progress} label="Animate" />

      {resultUrl && (
        <div className="rounded-lg overflow-hidden border border-border shadow-soft">
          <video controls src={resultUrl} className="w-full" />
        </div>
      )}
    </div>
  );
}
