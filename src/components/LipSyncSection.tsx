import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mic, FolderOpen } from 'lucide-react';
import { AssetPickerModal } from './AssetPickerModal';
import { VoiceGenerationModal } from './VoiceGenerationModal';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { GalleryAsset } from '@/store/galleryStore';

interface Props {
  onAudioSelected: (url: string) => void;
  audioUrl: string | null;
}

export function LipSyncSection({ onAudioSelected, audioUrl }: Props) {
  const [enabled, setEnabled] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <div className="flex items-center gap-3">
        <Switch checked={enabled} onCheckedChange={setEnabled} />
        <Tooltip>
          <TooltipTrigger asChild>
            <Label className="cursor-pointer">Enable Lip Syncing</Label>
          </TooltipTrigger>
          <TooltipContent>Synchronize character lip movements with an audio track</TooltipContent>
        </Tooltip>
      </div>
      {enabled && (
        <div className="space-y-3 pl-1">
          <p className="text-sm text-muted-foreground">Select Audio Source</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
              <FolderOpen className="mr-2 h-4 w-4" /> Choose from Gallery
            </Button>
            <Button variant="outline" size="sm" onClick={() => setVoiceModalOpen(true)}>
              <Mic className="mr-2 h-4 w-4" /> Generate Voice on the Fly
            </Button>
          </div>
          {audioUrl && (
            <audio controls src={audioUrl} className="w-full mt-2" />
          )}
        </div>
      )}
      <AssetPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(a: GalleryAsset) => onAudioSelected(a.url)}
        filterType="audio"
      />
      <VoiceGenerationModal
        open={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onGenerated={onAudioSelected}
      />
    </div>
  );
}
