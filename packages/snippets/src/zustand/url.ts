import type { z } from "zod";
import type { PersistStorage } from "zustand/middleware";
import {
  createStateDeserializer,
  createStateSerializer,
  type SerializeOptions,
} from "../state-serialization";

export const createURLStorage = <T>(
  schema: z.ZodType<T>,
  options?: Omit<SerializeOptions<T>, "paramName">,
): PersistStorage<T> => {
  const { createString } = createStateSerializer(schema);
  const { fromString } = createStateDeserializer(schema);

  return {
    getItem(name) {
      if (typeof window === "undefined") return null;

      const params = new URLSearchParams(window.location.search);
      const param = params.get(name);

      if (!param) return null;

      const result = fromString(param);
      if (!result.success) return null;

      return { state: result.data };
    },

    setItem(name, value) {
      if (typeof window === "undefined") return;

      const url = new URL(window.location.href);
      const stringified = createString(value.state, options);
      url.searchParams.set(name, stringified);
      window.history.replaceState(null, "", url);
    },

    removeItem(name) {
      if (typeof window === "undefined") return;

      const url = new URL(window.location.href);
      url.searchParams.delete(name);
      window.history.replaceState(null, "", url.toString());
    },
  };
};
