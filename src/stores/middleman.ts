import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MiddlemanState {
  profile: {
    id: string | null;
    storeName: string | null;
    storeSlug: string | null;
    templateId: string | null;
    isActive: boolean;
  } | null;
  setProfile: (profile: any) => void;
  updateTemplate: (templateId: string) => void;
  clearProfile: () => void;
}

export const useMiddlemanStore = create<MiddlemanState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      updateTemplate: (templateId) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, templateId } : null,
        })),
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: 'middleman-storage',
    }
  )
);
