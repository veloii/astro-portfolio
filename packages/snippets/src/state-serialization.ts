import superjson from "superjson";
import type { z } from "zod";

export type URLSerializeOptions<T> = {
  baseURL?: string;
  paramName?: string;
} & SerializeOptions<T>;

export type SerializeOptions<T> = {
  include?: (keyof T)[];
  exclude?: (keyof T)[];
};

export type StateSerializer<State> = {
  createURL(state: State, options?: URLSerializeOptions<State>): string;
  createString(state: State, options?: SerializeOptions<State>): string;
};

export const createStateSerializer = <
  TSchema extends z.ZodType,
  State extends z.infer<TSchema> = z.infer<TSchema>,
>(
  schema: TSchema,
): StateSerializer<State> => {
  const createString: StateSerializer<State>["createString"] = (
    state,
    options,
  ) => {
    let filteredState = { ...state };

    if (options?.include?.length) {
      filteredState = Object.fromEntries(
        Object.entries(filteredState).filter(([key]) =>
          options.include?.includes(key as keyof State),
        ),
      ) as State;
    }

    if (options?.exclude?.length) {
      filteredState = Object.fromEntries(
        Object.entries(filteredState).filter(
          ([key]) => !options.exclude?.includes(key as keyof State),
        ),
      ) as State;
    }

    const validated = schema.parse(filteredState);
    return superjson.stringify(validated);
  };

  return {
    createString,
    createURL: (state, options): string => {
      const paramName = options?.paramName || "state";
      const url = options?.baseURL || window.location.pathname;
      const parameters = new URLSearchParams(url);
      const [pathname] = url.split("?");
      const serialized = createString(state, options);
      parameters.append(paramName, serialized);
      return `${pathname}?${parameters.toString()}`;
    },
  };
};

export const createStateDeserializer = <
  TSchema extends z.ZodType,
  State extends z.infer<TSchema> = TSchema,
>(
  schema: TSchema,
) => ({
  fromString(
    stringifiedState: string | null | undefined,
    defaultValue?: State,
  ):
    | { error: Error; success: false; data?: undefined }
    | { error?: undefined; data: State; success: true } {
    try {
      if (stringifiedState === null) {
        if (defaultValue !== undefined) {
          return { data: defaultValue, error: undefined, success: true };
        }

        throw new Error("state is null");
      }
      if (stringifiedState === undefined) {
        if (defaultValue !== undefined) {
          return { data: defaultValue, error: undefined, success: true };
        }

        throw new Error("state is undefined");
      }

      const decoded = decodeURIComponent(stringifiedState);
      const parsed = superjson.parse(decoded);
      return schema.safeParse(parsed);
    } catch (error) {
      if (!(error instanceof Error)) {
        return { error: new Error(String(error)), success: false };
      }

      return { error, success: false };
    }
  },
});
