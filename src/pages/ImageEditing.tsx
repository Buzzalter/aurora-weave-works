import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { GenerateButton } from '@/components/GenerateButton';
import { DropZone } from '@/components/DropZone';
import { AssetPickerModal } from '@/components/AssetPickerModal';
import { useTaskPolling } from '@/hooks/useTaskPolling';
import { editImage } from '@/lib/api';
import { toast } from 'sonner';
import { GalleryAsset } from '@/store/galleryStore';

export default function ImageEditing() {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const { isLoading, progress, resultUrl, startPolling } = useTaskPolling();

  const handleGenerate = async () => {
    if (!file) { toast.warning('Please upload an image.'); return; }
    if (!prompt.trim()) { toast.warning('Please enter an edit prompt.'); return; }
    toast.info('Starting image edit…');
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('prompt', prompt);
      const { data } = await editImage(fd);
      startPolling(data.task_id, 'image');
    } catch {
      toast.error('Failed to start edit.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Image Editing</h2>
        <p className="text-muted-foreground text-sm mt-1">Transform existing images with AI</p>
      </div>

      <DropZone label="Drop your image here" onFile={setFile} onGallerySelect={() => setPickerOpen(true)} />

      <div className="space-y-2">
        <Label>Edit Prompt</Label>
        <Textarea placeholder="Describe the changes…" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} />
      </div>

      <GenerateButton onClick={handleGenerate} isLoading={isLoading} progress={progress} label="Generate Edit" />

      {resultUrl && (
        <div className="rounded-lg overflow-hidden border border-border shadow-soft">
          <img src={resultUrl} alt="Edited" className="w-full" />
        </div>
      )}

      <AssetPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(a: GalleryAsset) => {
          // Create a placeholder — real app would fetch the file
          toast.info(`Selected: ${a.name}`);
        }}
        filterType="image"
      />
    </div>
  );
}
