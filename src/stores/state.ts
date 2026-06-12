import { createContext, use } from "react";
import { create, useStore, type StoreApi } from "zustand";
import type { UseBoundStore } from "zustand/react";
import feoConfigValidator from "../data/feoConfig";
import keys from "../util/object/keys";
import queryClient from "./queryClient";

const formats = [".json", ".yaml", ".toml"] as const;

export type State = {
  app: string | undefined;
  target: string | undefined;
  source: string | undefined;
  previousApp: () => void;
  nextApp: () => void;
  previousTarget: () => void;
  nextTarget: () => void;
  previousSource: () => void;
  nextSource: () => void;
};

export const createStateStore = (initial: {
  app: string | undefined;
  target: string | undefined;
  source: string | undefined;
}) =>
  create<State>()((set, get) => ({
    ...initial,
    previousApp: () => {
      const config = feoConfigValidator.safeParse(queryClient.getQueryData(["~/.config/feo/config.toml"]));
      if (!config.success) {
        throw config.error;
      }
      const currentApp = get().app;
      const apps = keys(config.data.configs);
      if (currentApp === undefined) {
        const firstApp = apps[0];
        const targets = firstApp === undefined ? undefined : config.data.configs[firstApp]?.targets;
        const firstTarget = targets === undefined ? undefined : keys(targets)[0];
        set({
          app: firstApp,
          target: firstTarget,
          source: firstTarget !== undefined && targets !== undefined ? targets[firstTarget]?.sources[0] : undefined,
        });
        return;
      }
      const i = apps.indexOf(currentApp);
      const prev = apps[i - 1] ?? apps[apps.length - 1];
      if (prev === undefined) {
        set({
          app: undefined,
          target: undefined,
          source: undefined,
        });
        return;
      }
      const targets = config.data.configs[prev]?.targets;
      if (targets === undefined) {
        set({
          app: prev,
          target: undefined,
          source: undefined,
        });
        return;
      }
      const firstTarget = keys(targets)[0];
      set({
        app: prev,
        target: firstTarget,
        source: firstTarget === undefined ? undefined : targets[firstTarget]?.sources[0],
      });
      return;
    },
    nextApp: () => {
      const config = feoConfigValidator.safeParse(queryClient.getQueryData(["~/.config/feo/config.toml"]));
      if (!config.success) {
        throw config.error;
      }
      const currentApp = get().app;
      const apps = keys(config.data.configs);
      if (currentApp === undefined) {
        const firstApp = apps[0];
        const targets = firstApp === undefined ? undefined : config.data.configs[firstApp]?.targets;
        const firstTarget = targets === undefined ? undefined : keys(targets)[0];
        set({
          app: firstApp,
          target: firstTarget,
          source: firstTarget !== undefined && targets !== undefined ? targets[firstTarget]?.sources[0] : undefined,
        });
        return;
      }
      const i = apps.indexOf(currentApp);
      const next = apps[i + 1] ?? apps[0];
      if (next === undefined) {
        set({
          app: undefined,
          target: undefined,
          source: undefined,
        });
        return;
      }
      const targets = config.data.configs[next]?.targets;
      if (targets === undefined) {
        set({
          app: next,
          target: undefined,
          source: undefined,
        });
        return;
      }
      const firstTarget = keys(targets)[0];
      set({
        app: next,
        target: firstTarget,
        source: firstTarget === undefined ? undefined : targets[firstTarget]?.sources[0],
      });
      return;
    },
    previousTarget: () => {
      const config = feoConfigValidator.safeParse(queryClient.getQueryData(["~/.config/feo/config.toml"]));
      if (!config.success) {
        throw config.error;
      }
      const currentApp = get().app;
      if (currentApp === undefined) {
        return;
      }
      const appConfig = config.data.configs[currentApp];
      if (appConfig === undefined) {
        return;
      }
      const targets = keys(appConfig.targets);
      const currentTarget = get().target;
      if (currentTarget === undefined) {
        const firstTarget = targets[0];
        set({
          target: firstTarget,
          source: firstTarget === undefined ? undefined : appConfig.targets[firstTarget]?.sources[0],
        });
        return;
      }
      const i = targets.indexOf(currentTarget);
      const prev = targets[i - 1] ?? targets[targets.length - 1];
      if (prev === undefined) {
        set({
          target: undefined,
          source: undefined,
        });
        return;
      }
      set({
        target: prev,
        source: appConfig.targets[prev]?.sources[0],
      });
    },
    nextTarget: () => {
      const config = feoConfigValidator.safeParse(queryClient.getQueryData(["~/.config/feo/config.toml"]));
      if (!config.success) {
        throw config.error;
      }
      const currentApp = get().app;
      if (currentApp === undefined) {
        return;
      }
      const appConfig = config.data.configs[currentApp];
      if (appConfig === undefined) {
        return;
      }
      const targets = keys(appConfig.targets);
      const currentTarget = get().target;
      if (currentTarget === undefined) {
        const firstTarget = targets[0];
        set({
          target: firstTarget,
          source: firstTarget === undefined ? undefined : appConfig.targets[firstTarget]?.sources[0],
        });
        return;
      }
      const i = targets.indexOf(currentTarget);
      const next = targets[i + 1] ?? targets[0];
      if (next === undefined) {
        set({
          target: undefined,
          source: undefined,
        });
        return;
      }
      set({
        target: next,
        source: appConfig.targets[next]?.sources[0],
      });
    },
    previousSource: () => {
      const config = feoConfigValidator.safeParse(queryClient.getQueryData(["~/.config/feo/config.toml"]));
      if (!config.success) {
        throw config.error;
      }
      const currentApp = get().app;
      if (currentApp === undefined) {
        return;
      }
      const currentTarget = get().target;
      if (currentTarget === undefined) {
        return;
      }
      const appConfig = config.data.configs[currentApp];
      if (appConfig === undefined) {
        return;
      }
      const targetConfig = appConfig.targets[currentTarget];
      if (targetConfig === undefined) {
        return;
      }
      const sources = targetConfig.sources;
      const currentSource = get().source;
      if (currentSource === undefined) {
        set({ source: sources[0] });
        return;
      }
      const i = sources.indexOf(currentSource);
      const prev = sources[i - 1] ?? sources[sources.length - 1];
      set({ source: prev });
    },
    nextSource: () => {
      const config = feoConfigValidator.safeParse(queryClient.getQueryData(["~/.config/feo/config.toml"]));
      if (!config.success) {
        throw config.error;
      }
      const currentApp = get().app;
      if (currentApp === undefined) {
        return;
      }
      const currentTarget = get().target;
      if (currentTarget === undefined) {
        return;
      }
      const appConfig = config.data.configs[currentApp];
      if (appConfig === undefined) {
        return;
      }
      const targetConfig = appConfig.targets[currentTarget];
      if (targetConfig === undefined) {
        return;
      }
      const sources = targetConfig.sources;
      const currentSource = get().source;
      if (currentSource === undefined) {
        set({ source: sources[0] });
        return;
      }
      const i = sources.indexOf(currentSource);
      const next = sources[i + 1] ?? sources[0];
      set({ source: next });
    },
  }));

export const StateStoreContext = createContext<UseBoundStore<StoreApi<State>>>(
  createStateStore({
    app: undefined,
    target: undefined,
    source: undefined,
  }),
);

export function useStateStore(): State;
export function useStateStore<U>(selector: (state: State) => U): U;
export function useStateStore<U>(selector?: (state: State) => U) {
  const store = use(StateStoreContext);
  // `as` is needed here to resolve U when no selector is sent
  return useStore(store, selector ?? ((s) => s as U));
}
