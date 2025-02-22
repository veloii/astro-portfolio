import { create } from "zustand";
import { combine, persist } from "zustand/middleware";
import { createURLStorage } from "./url";
import { z } from "zod";

const BearsSchema = z.object({
  bears: z.number(),
});

export const useBearStore = create(
  persist(
    combine({ bears: 0 } satisfies z.infer<typeof BearsSchema>, (set, get) => ({
      addABear: () => set({ bears: get().bears + 1 }),
    })),
    {
      name: "food-storage", // name of the item in the storage (must be unique)
      storage: createURLStorage(BearsSchema), // zod schema
    },
  ),
);
