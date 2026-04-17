import { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { GenerateButton } from '@/components/GenerateButton';
import { useTaskPolling } from '@/hooks/useTaskPolling';
import { generateImage } from '@/lib/api';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Upload, X } from 'lucide-react';

const ASPECTS = ['1:1', '16:9', '9:16', '4:3', '3:4'];
const PRESETS = ['None', 'Social Media'];

interface RefImage {
  file: File;
  url: string;
}

export default function ImageGeneration() {
  const [prompt, setPrompt] = useState('');
  const [aspect, setAspect] = useState('1:1');
  const [preset, setPreset] = useState('None');
  const [refImages, setRefImages] = useState<RefImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isLoading, progress, resultUrl, startPolling } = useTaskPolling();

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    try {
      const newImages: RefImage[] = [];
      Array.from(files).forEach((file) => {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image.`);
          return;
        }
        newImages.push({ file, url: URL.createObjectURL(file) });
      });
      setRefImages((prev) => [...prev, ...newImages]);
    } catch {
      toast.error('Failed to upload reference images.');
    }
  };

  const removeImage = (index: number) => {
    setRefImages((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].url);
      next.splice(index, 1);
      return next;
    });
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) { toast.warning('Please enter a prompt.'); return; }
    toast.info('Starting image generation…');
    try {
      const fd = new FormData();
      fd.append('prompt', prompt);
      fd.append('aspect_ratio', aspect);
      fd.append('preset', preset);
      refImages.forEach((img) => fd.append('reference_images', img.file));
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
              placeholder="Describe the image you want to create… You can reference uploaded images as 'Image 1', 'Image 2', etc."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label className="cursor-help">Reference Images (Optional)</Label>
                </TooltipTrigger>
                <TooltipContent>Upload images and reference them in your prompt as "Image 1", "Image 2", etc.</TooltipContent>
              </Tooltip>
              {refImages.length > 0 && (
                <span className="text-xs text-muted-foreground">{refImages.length} uploaded</span>
              )}
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFiles(e.dataTransfer.files);
              }}
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-4 transition-colors hover:border-primary/50"
            >
              <Upload className="mb-1 h-5 w-5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Drag & drop or click to add reference images</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  handleFiles(e.target.files);
                  e.target.value = '';
                }}
              />
            </div>

            {refImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                {refImages.map((img, idx) => (
                  <div
                    key={img.url}
                    className="group relative overflow-hidden rounded-md border border-border shadow-soft"
                  >
                    <img src={img.url} alt={`Reference ${idx + 1}`} className="aspect-square w-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1">
                      <span className="text-[10px] font-semibold text-white">Image {idx + 1}</span>
                    </div>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute right-1 top-1 h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
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
                <Label className="cursor-help">Aesthetic Preset</Label>
              </TooltipTrigger>
              <TooltipContent>Apply a curated aesthetic style to your generation</TooltipContent>
            </Tooltip>
            <Select value={preset} onValueChange={setPreset}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PRESETS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
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
