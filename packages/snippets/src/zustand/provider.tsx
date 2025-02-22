"use client";

import {
  createContext,
  useContext,
  useRef,
  type PropsWithChildren,
} from "react";
import { useStore, type StoreApi } from "zustand";

type ProviderProps<TParams> = PropsWithChildren<TParams>;

export function createStoreContext<
  TStore extends object,
  TParams = { store: StoreApi<TStore> },
>(
  createStore: (params: TParams) => StoreApi<TStore> = (({
    store,
  }: { store: StoreApi<TStore> }) => store) as unknown as (
    params: TParams,
  ) => StoreApi<TStore>,
) {
  const StoreContext = createContext<StoreApi<TStore> | null>(null);

  const Provider = ({ children, ...params }: ProviderProps<TParams>) => {
    const storeRef = useRef<StoreApi<TStore>>(createStore(params as TParams));

    return (
      <StoreContext.Provider value={storeRef.current}>
        {children}
      </StoreContext.Provider>
    );
  };

  const useRoot = () => {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error("Store hook must be used within its Provider");
    }
    return store;
  };

  const useStoreContext = <T = TStore>(
    selector: (state: TStore) => T = (state) => state as unknown as T,
  ): T => useStore(useRoot(), selector);

  return [Provider, Object.assign(useStoreContext, { useRoot })] as const;
}
