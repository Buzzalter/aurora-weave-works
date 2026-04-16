import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Props {
  onClick: () => void;
  isLoading: boolean;
  progress: number;
  label?: string;
}

export function GenerateButton({ onClick, isLoading, progress, label = 'Generate' }: Props) {
  return (
    <div className="space-y-2">
      <Button
        onClick={onClick}
        disabled={isLoading}
        className="w-full h-12 text-base font-semibold"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating…
          </>
        ) : (
          label
        )}
      </Button>
      {isLoading && (
        <Progress value={progress} className="h-2" />
      )}
    </div>
  );
}
