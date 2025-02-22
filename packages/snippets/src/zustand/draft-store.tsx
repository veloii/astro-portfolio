import { create, type UseBoundStore, type StoreApi } from "zustand";
import {
	createContext,
	useContext,
	useRef,
	type PropsWithChildren,
} from "react";
import { useStore } from "zustand";

export function createDraftStore<T extends object>(parentStore: StoreApi<T>) {
	const state = parentStore.getState();
	console.log("Initial state:", state); // Let's see what we're starting with

	const store = create<T & { reset: () => void; push: () => void }>(
		(set, get) => {
			const initialState = {
				...state,
				reset: () => set(parentStore.getState()),
				push: () => parentStore.setState(get()),
			};
			console.log("Created store with:", initialState); // Verify store creation
			return initialState;
		},
	);

	// Let's verify the store has what we expect
	console.log("Final store state:", store.getState());
	return store;
}

export type CreateDraftStore<T> = T extends StoreApi<infer A>
	? UseBoundStore<StoreApi<DraftStore<A>>>
	: T extends { useRoot: () => StoreApi<infer A> }
	? UseBoundStore<StoreApi<DraftStore<A>>>
	: never;

export function useCreateDraftStore<T extends object>(
	// TODO: replace useRoot with a Symbol and look into how react determines use or change it to use__internal_root and hide the type
	anyParentStore: StoreApi<T> | { useRoot: () => StoreApi<T> },
) {
	const storeRef = useRef<UseBoundStore<StoreApi<DraftStore<T>>>>(undefined);
	const parentStore =
		"useRoot" in anyParentStore ? anyParentStore.useRoot() : anyParentStore;

	if (!storeRef.current) {
		storeRef.current = createDraftStore(parentStore);
	}

	return storeRef.current;
}

type Write<T, U> = Omit<T, keyof U> & U;
type DraftStore<T> = Write<T, { reset: () => void; push: () => void }>;

type UseStoreContext<TStore> = (<T = TStore>(
	selector?: (state: TStore) => T,
) => T) & { useRoot: () => StoreApi<TStore> };

export function createDraftStoreContext<TStore extends object>(
	parentStore: UseStoreContext<TStore>,
) {
	const StoreContext = createContext<StoreApi<DraftStore<TStore>> | null>(null);

	const Provider = (props: PropsWithChildren) => {
		const storeRef = useRef<StoreApi<DraftStore<TStore>>>(undefined);
		const parentRootStore = parentStore.useRoot();

		if (!storeRef.current) {
			storeRef.current = createDraftStore(parentRootStore);
		}

		return <StoreContext.Provider value={storeRef.current} {...props} />;
	};

	const useRoot = () => {
		const store = useContext(StoreContext);
		if (!store) {
			throw new Error("Store hook must be used within its Provider");
		}
		return store;
	};

	const useStoreContext = <T = DraftStore<TStore>>(
		selector: (state: DraftStore<TStore>) => T = (state) =>
			state as unknown as T,
	): T => useStore(useRoot(), selector);

	return [Provider, Object.assign(useStoreContext, { useRoot })] as const;
}
