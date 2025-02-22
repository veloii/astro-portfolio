import superjson from "superjson";
import type { PersistStorage } from "zustand/middleware";

export const createSuperJSONStorage = <T>(
  getStorage: () => Storage = () => localStorage,
): PersistStorage<T> => ({
  getItem: (name) => {
    const str = getStorage().getItem(name);
    if (!str) return null;
    return superjson.parse(str);
  },
  setItem: (name, value) =>
    getStorage().setItem(name, superjson.stringify(value)),
  removeItem: getStorage().removeItem,
});
