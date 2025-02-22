import { create } from "zustand";
import { combine } from "zustand/middleware";
import { createStoreContext } from "./provider";

const [BearStoreProvider, useBearStore] = createStoreContext(
  ({ defaultBears: bears = 0 }: { defaultBears?: number }) =>
    create(
      combine({ bears }, (set, get) => ({
        addABear: () => set({ bears: get().bears + 1 }),
      })),
    ),
);

function Component() {
  return (
    <BearStoreProvider defaultBears={5}>
      <ChildComponent />
    </BearStoreProvider>
  );
}

function ChildComponent() {
  const bears = useBearStore((state) => state.bears);
  const addABear = useBearStore((state) => state.addABear);

  return (
    <div>
      <span>{bears}</span>
      <button type="button" onClick={addABear}>
        Add
      </button>
    </div>
  );
}
