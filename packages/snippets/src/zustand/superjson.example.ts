import { create } from "zustand";
import { combine, persist } from "zustand/middleware";
import { createSuperJSONStorage } from "./superjson";

export const useBearStore = create(
  persist(
    combine({ bears: 0 }, (set, get) => ({
      addABear: () => set({ bears: get().bears + 1 }),
    })),
    {
      name: "food-storage", // name of the item in the storage (must be unique)
      storage: createSuperJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
