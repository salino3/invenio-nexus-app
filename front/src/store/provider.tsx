import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { immer } from "zustand/middleware/immer";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  Theme,
  type PropsProvider,
  type PropsCurrentAccount,
} from "./interface";

export const useProvider = create<PropsProvider>()(
  persist(
    immer((set, get) => ({
      currentUser: null,
      myCompanies: [],
      setDataUser(data: PropsCurrentAccount | null) {
        set((state) => {
          state.currentUser = data;
        });
      },
      theme: Theme.dark,
      configuration: false,
      setConfiguration() {
        const currentConfiguration: boolean = get().configuration;

        set((state) => {
          state.configuration = !currentConfiguration;
        });
      },
      changeGlobalColors() {
        set((state) => {
          state.theme = state.theme === Theme.dark ? Theme.light : Theme.dark;
        });
      },
    })),
    {
      name: "app-invenio-nexus-storage",
      //* Storage in localStorage for default, also without include the parameter.
      storage: createJSONStorage(() => sessionStorage),
      //* For default 'persist' saves all object and arrays
      partialize: (state) => ({
        theme: state.theme,
        currentUser: state.currentUser,
      }),
    },
  ),
);

// Selector for avoid rerender
export function useProviderSelector<T extends keyof PropsProvider>(
  ...keys: T[]
):
  | { [K in keyof PropsProvider]: PropsProvider[K] }
  | { [K in T]?: PropsProvider[K] } {
  if (keys.length === 0) {
    return useProvider(useShallow((state) => state));
  }

  const selectors: { [K in T]?: PropsProvider[K] } = {};

  keys.forEach((key) => {
    selectors[key] = useProvider(useShallow((state) => state[key]));
  });

  return selectors;
}
