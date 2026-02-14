import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme } from "@/types/global.types";

interface AppStore {
  theme: Theme;
  sidebarOpen: boolean;
  activeTool: string | null;
  favorites: string[];
  setTheme: (theme: Theme) => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveTool: (toolId: string | null) => void;
  toggleFavorite: (toolId: string) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      theme: "system",
      sidebarOpen: true,
      activeTool: null,
      favorites: [],

      setTheme: (theme) => set({ theme }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveTool: (toolId) => set({ activeTool: toolId }),
      toggleFavorite: (toolId) => {
        const favorites = get().favorites;
        set({
          favorites: favorites.includes(toolId)
            ? favorites.filter((id) => id !== toolId)
            : [...favorites, toolId],
        });
      },
    }),
    {
      name: "dev-utils-app-store",
      partialize: (state) => ({
        theme: state.theme,
        favorites: state.favorites,
      }),
    },
  ),
);
