import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StoredMedia } from '../types';

interface MediaState {
  savedMedia: Record<string, StoredMedia>;
  addToWatchlist: (media: Omit<StoredMedia, 'isWatchlist' | 'isFavorite' | 'watchProgress' | 'lastWatchedTimestamp' | 'addedTimestamp'>) => void;
  removeFromWatchlist: (tmdbId: number, mediaType: 'movie' | 'tv') => void;
  toggleFavorite: (media: Omit<StoredMedia, 'isWatchlist' | 'isFavorite' | 'watchProgress' | 'lastWatchedTimestamp' | 'addedTimestamp'>) => void;
  recordWatchProgress: (media: Omit<StoredMedia, 'isWatchlist' | 'isFavorite' | 'watchProgress' | 'lastWatchedTimestamp' | 'addedTimestamp'>, progress: number) => void;
  getMedia: (tmdbId: number, mediaType: 'movie' | 'tv') => StoredMedia | undefined;
}

const getMediaKey = (id: number, type: string) => `${type}_${id}`;

export const useMediaStore = create<MediaState>()(
  persist(
    (set, get) => ({
      savedMedia: {},
      
      addToWatchlist: (media) => set((state) => {
        const key = getMediaKey(media.tmdbId, media.mediaType);
        const existing = state.savedMedia[key];
        return {
          savedMedia: {
            ...state.savedMedia,
            [key]: existing ? { ...existing, isWatchlist: true } : {
              ...media,
              isWatchlist: true,
              isFavorite: false,
              watchProgress: 0,
              lastWatchedTimestamp: 0,
              addedTimestamp: Date.now()
            }
          }
        };
      }),
      
      removeFromWatchlist: (tmdbId, mediaType) => set((state) => {
        const key = getMediaKey(tmdbId, mediaType);
        const existing = state.savedMedia[key];
        if (!existing) return state;
        
        return {
          savedMedia: {
            ...state.savedMedia,
            [key]: { ...existing, isWatchlist: false }
          }
        };
      }),
      
      toggleFavorite: (media) => set((state) => {
        const key = getMediaKey(media.tmdbId, media.mediaType);
        const existing = state.savedMedia[key];
        const newIsFavorite = existing ? !existing.isFavorite : true;
        
        return {
          savedMedia: {
            ...state.savedMedia,
            [key]: existing ? { ...existing, isFavorite: newIsFavorite } : {
              ...media,
              isWatchlist: false,
              isFavorite: true,
              watchProgress: 0,
              lastWatchedTimestamp: 0,
              addedTimestamp: Date.now()
            }
          }
        };
      }),
      
      recordWatchProgress: (media, progress) => set((state) => {
        const key = getMediaKey(media.tmdbId, media.mediaType);
        const existing = state.savedMedia[key];
        
        return {
          savedMedia: {
            ...state.savedMedia,
            [key]: existing ? { 
              ...existing, 
              watchProgress: progress,
              lastWatchedTimestamp: Date.now() 
            } : {
              ...media,
              isWatchlist: false,
              isFavorite: false,
              watchProgress: progress,
              lastWatchedTimestamp: Date.now(),
              addedTimestamp: Date.now()
            }
          }
        };
      }),
      
      getMedia: (tmdbId, mediaType) => get().savedMedia[getMediaKey(tmdbId, mediaType)],
    }),
    {
      name: 'hmdbd-media-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
