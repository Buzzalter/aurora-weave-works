import { VoiceGenerationForm } from '@/components/VoiceGenerationForm';

export default function VoiceGeneration() {
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Voice Generation</h2>
        <p className="text-muted-foreground text-sm mt-1">Generate natural speech from text</p>
      </div>
      <VoiceGenerationForm />
    </div>
  );
}
