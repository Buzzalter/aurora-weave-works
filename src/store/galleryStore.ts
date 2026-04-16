import { create } from 'zustand';

export interface GalleryAsset {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  name: string;
  createdAt: string;
}

interface GalleryState {
  assets: GalleryAsset[];
  addAsset: (asset: GalleryAsset) => void;
  removeAsset: (id: string) => void;
}

export const useGallery = create<GalleryState>((set) => ({
  assets: [],
  addAsset: (asset) => set((s) => ({ assets: [asset, ...s.assets] })),
  removeAsset: (id) => set((s) => ({ assets: s.assets.filter((a) => a.id !== id) })),
}));
