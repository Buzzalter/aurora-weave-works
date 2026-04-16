import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VoiceGenerationForm } from '@/components/VoiceGenerationForm';

interface Props {
  open: boolean;
  onClose: () => void;
  onGenerated: (url: string) => void;
}

export function VoiceGenerationModal({ open, onClose, onGenerated }: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Generate Voice on the Fly</DialogTitle>
        </DialogHeader>
        <VoiceGenerationForm
          onGenerated={(url) => {
            onGenerated(url);
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
