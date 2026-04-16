import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { GenerateButton } from '@/components/GenerateButton';
import { useTaskPolling } from '@/hooks/useTaskPolling';
import { generateImage } from '@/lib/api';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const LORAS = ['None', 'Realistic V4', 'Anime Style', 'Pixel Art', 'Watercolor', 'Cinematic'];
const ASPECTS = ['1:1', '16:9', '9:16', '4:3', '3:4'];

export default function ImageGeneration() {
  const [prompt, setPrompt] = useState('');
  const [lora, setLora] = useState('None');
  const [loraWeight, setLoraWeight] = useState([0.8]);
  const [aspect, setAspect] = useState('1:1');
  const { isLoading, progress, resultUrl, startPolling } = useTaskPolling();

  const handleGenerate = async () => {
    if (!prompt.trim()) { toast.warning('Please enter a prompt.'); return; }
    toast.info('Starting image generation…');
    try {
      const fd = new FormData();
      fd.append('prompt', prompt);
      fd.append('lora', lora);
      fd.append('lora_weight', String(loraWeight[0]));
      fd.append('aspect_ratio', aspect);
      const { data } = await generateImage(fd);
      startPolling(data.task_id, 'image');
    } catch {
      toast.error('Failed to start generation.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Image Generation</h2>
        <p className="text-muted-foreground text-sm mt-1">Create stunning images from text prompts</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Prompt</Label>
            <Textarea
              placeholder="Describe the image you want to create…"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>
          <GenerateButton onClick={handleGenerate} isLoading={isLoading} progress={progress} />
          {resultUrl && (
            <div className="rounded-lg overflow-hidden border border-border shadow-soft">
              <img src={resultUrl} alt="Generated" className="w-full" />
            </div>
          )}
        </div>

        <div className="space-y-5 rounded-lg border border-border p-4 glass h-fit">
          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Label className="cursor-help">Select LoRA</Label>
              </TooltipTrigger>
              <TooltipContent>Low-Rank Adaptation model for style transfer</TooltipContent>
            </Tooltip>
            <Select value={lora} onValueChange={setLora}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {LORAS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Label className="cursor-help">LoRA Weight: {loraWeight[0]}</Label>
              </TooltipTrigger>
              <TooltipContent>Controls the influence of the LoRA style (0–1)</TooltipContent>
            </Tooltip>
            <Slider value={loraWeight} onValueChange={setLoraWeight} min={0} max={1} step={0.05} />
          </div>

          <div className="space-y-2">
            <Label>Aspect Ratio</Label>
            <ToggleGroup type="single" value={aspect} onValueChange={(v) => v && setAspect(v)} className="flex flex-wrap gap-1">
              {ASPECTS.map((a) => (
                <ToggleGroupItem key={a} value={a} size="sm" className="text-xs">{a}</ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
