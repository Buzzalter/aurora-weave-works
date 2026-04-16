import { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  label: string;
  accept?: string;
  onFile: (file: File | null) => void;
  onGallerySelect?: () => void;
}

export function DropZone({ label, accept = 'image/*', onFile, onGallerySelect }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      onFile(file);
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        setPreview(URL.createObjectURL(file));
      } else {
        setPreview(null);
      }
    },
    [onFile]
  );

  const clear = () => {
    setPreview(null);
    onFile(null);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
      }}
      className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
        dragOver ? 'border-primary bg-accent/50' : 'border-border hover:border-primary/50'
      }`}
    >
      {preview ? (
        <div className="relative">
          <img src={preview} alt="Preview" className="max-h-48 rounded-md object-contain" />
          <Button
            size="icon"
            variant="destructive"
            className="absolute -right-2 -top-2 h-6 w-6"
            onClick={clear}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <>
          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-xs text-muted-foreground mt-1">Drag & drop or click to browse</p>
        </>
      )}
      <input
        type="file"
        accept={accept}
        className="absolute inset-0 cursor-pointer opacity-0"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      {onGallerySelect && !preview && (
        <Button variant="outline" size="sm" className="mt-3 relative z-10" onClick={(e) => { e.stopPropagation(); onGallerySelect(); }}>
          Select from Gallery
        </Button>
      )}
    </div>
  );
}
