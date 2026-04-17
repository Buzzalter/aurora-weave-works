import { useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { GenerateButton } from '@/components/GenerateButton';
import { useTaskPolling } from '@/hooks/useTaskPolling';
import { generateVoice, cloneVoice } from '@/lib/api';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';

const LANGUAGES = ['English', 'French', 'German', 'Chinese', 'Russian', 'Turkish', 'Ukrainian', 'Algerian Arabic'];
const GENDERS = ['Male', 'Female'];
const AGES = ['Child', 'Teenager', 'Young Adult', 'Middle-Aged', 'Elderly'];
const ACCENTS = [
  'American Accent',
  'Australian Accent',
  'British Accent',
  'Chinese Accent',
  'Canadian Accent',
  'Indian Accent',
  'Korean Accent',
  'Portuguese Accent',
  'Russian Accent',
  'Japanese Accent',
];
const PITCHES = ['Very Low Pitch', 'Low Pitch', 'Moderate Pitch', 'High Pitch', 'Very High Pitch'];

interface Props {
  onGenerated?: (url: string) => void;
}

export function VoiceGenerationForm({ onGenerated }: Props) {
  const [script, setScript] = useState('');
  const [language, setLanguage] = useState('English');
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState('Young Adult');
  const [accent, setAccent] = useState('American Accent');
  const [pitch, setPitch] = useState('Moderate Pitch');
  const [referenceAudio, setReferenceAudio] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isLoading, progress, resultUrl, startPolling } = useTaskPolling();

  const handleCreate = async () => {
    if (!script.trim()) {
      toast.warning('Please enter a script.');
      return;
    }
    toast.info('Starting voice generation…');
    try {
      const fd = new FormData();
      fd.append('text', script);
      fd.append('language', language);
      fd.append('gender', gender);
      fd.append('age', age);
      fd.append('accent', accent);
      fd.append('pitch', pitch);
      const { data } = await generateVoice(fd);
      startPolling(data.task_id, 'audio');
    } catch {
      toast.error('Failed to start generation.');
    }
  };

  const handleClone = async () => {
    if (!script.trim()) {
      toast.warning('Please enter a script.');
      return;
    }
    if (!referenceAudio) {
      toast.warning('Please upload a reference audio file.');
      return;
    }
    toast.info('Starting voice cloning…');
    try {
      const fd = new FormData();
      fd.append('text', script);
      fd.append('reference_audio', referenceAudio);
      const { data } = await cloneVoice(fd);
      startPolling(data.task_id, 'audio');
    } catch {
      toast.error('Failed to start cloning.');
    }
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('audio/')) {
      toast.error('Please upload a valid audio file.');
      return;
    }
    setReferenceAudio(file);
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
          rows={4}
        />
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Voice</TabsTrigger>
          <TabsTrigger value="clone">Clone Voice</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {GENDERS.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Age</Label>
              <Select value={age} onValueChange={setAge}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AGES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Accent</Label>
              <Select value={accent} onValueChange={setAccent}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ACCENTS.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Pitch</Label>
              <Select value={pitch} onValueChange={setPitch}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PITCHES.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <GenerateButton
            onClick={handleCreate}
            isLoading={isLoading}
            progress={progress}
            label="Generate Audio"
          />
        </TabsContent>

        <TabsContent value="clone" className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Reference Audio</Label>
            {!referenceAudio ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFile(e.dataTransfer.files?.[0]);
                }}
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 p-6 text-center transition-colors hover:border-primary hover:bg-muted/50"
              >
                <Upload className="h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click or drag an audio file here
                </p>
                <p className="text-xs text-muted-foreground">.wav, .mp3, etc.</p>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
                <span className="truncate text-sm">{referenceAudio.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setReferenceAudio(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>
          <GenerateButton
            onClick={handleClone}
            isLoading={isLoading}
            progress={progress}
            label="Clone Voice"
          />
        </TabsContent>
      </Tabs>

      {resultUrl && (
        <div className="mt-4 rounded-lg bg-muted p-4">
          <Label className="mb-2 block">Generated Audio</Label>
          <audio controls src={resultUrl} className="w-full" />
        </div>
      )}
    </div>
  );
}
