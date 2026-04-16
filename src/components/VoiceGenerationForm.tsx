import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GenerateButton } from '@/components/GenerateButton';
import { useTaskPolling } from '@/hooks/useTaskPolling';
import { generateVoice } from '@/lib/api';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

const VOICE_PRESETS = ['Alloy', 'Echo', 'Fable', 'Nova', 'Onyx', 'Shimmer'];

interface Props {
  onGenerated?: (url: string) => void;
}

export function VoiceGenerationForm({ onGenerated }: Props) {
  const [script, setScript] = useState('');
  const [preset, setPreset] = useState('Alloy');
  const { isLoading, progress, resultUrl, startPolling } = useTaskPolling();

  const handleGenerate = async () => {
    if (!script.trim()) {
      toast.warning('Please enter a script.');
      return;
    }
    toast.info('Starting voice generation…');
    try {
      const fd = new FormData();
      fd.append('script', script);
      fd.append('voice_preset', preset);
      const { data } = await generateVoice(fd);
      startPolling(data.task_id, 'audio');
    } catch {
      toast.error('Failed to start generation.');
    }
  };

  if (resultUrl) {
    onGenerated?.(resultUrl);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Script</Label>
        <Textarea
          placeholder="Enter the text to be spoken…"
          value={script}
          onChange={(e) => setScript(e.target.value)}
          rows={5}
        />
      </div>
      <div className="space-y-2">
        <Label>Voice Preset</Label>
        <Select value={preset} onValueChange={setPreset}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VOICE_PRESETS.map((v) => (
              <SelectItem key={v} value={v}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <GenerateButton onClick={handleGenerate} isLoading={isLoading} progress={progress} label="Generate Audio" />
      {resultUrl && (
        <div className="mt-4 rounded-lg bg-muted p-4">
          <Label className="mb-2 block">Generated Audio</Label>
          <audio controls src={resultUrl} className="w-full" />
        </div>
      )}
    </div>
  );
}
