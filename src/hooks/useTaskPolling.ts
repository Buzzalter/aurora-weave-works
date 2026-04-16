import { useState, useRef, useCallback } from 'react';
import { pollTask, getResultUrl } from '@/lib/api';
import { toast } from 'sonner';
import { useGallery, GalleryAsset } from '@/store/galleryStore';

type AssetType = 'image' | 'video' | 'audio';

export function useTaskPolling() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { addAsset } = useGallery();

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startPolling = useCallback(
    (taskId: string, type: AssetType = 'image') => {
      setIsLoading(true);
      setProgress(0);
      setResultUrl(null);
      let tick = 0;

      intervalRef.current = setInterval(async () => {
        try {
          tick++;
          setProgress(Math.min(90, tick * 8));
          const { data } = await pollTask(taskId);

          if (data.status === 'Complete' && data.result_url) {
            stopPolling();
            const url = getResultUrl(data.result_url);
            setResultUrl(url);
            setProgress(100);
            setIsLoading(false);

            const asset: GalleryAsset = {
              id: crypto.randomUUID(),
              type,
              url,
              name: `${type}-${Date.now()}`,
              createdAt: new Date().toISOString(),
            };
            addAsset(asset);
            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} generated successfully!`);
          } else if (data.status === 'Failed') {
            stopPolling();
            setIsLoading(false);
            setProgress(0);
            toast.error('Generation failed. Please try again.');
          }
        } catch {
          // keep polling on network hiccups
        }
      }, 3000);
    },
    [addAsset, stopPolling]
  );

  const reset = useCallback(() => {
    stopPolling();
    setIsLoading(false);
    setProgress(0);
    setResultUrl(null);
  }, [stopPolling]);

  return { isLoading, progress, resultUrl, startPolling, reset };
}
