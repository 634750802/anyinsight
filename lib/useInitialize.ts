import { DependencyList, EffectCallback, useEffect } from 'react';

type InitializeCallback = (browser: boolean) => ReturnType<EffectCallback>

const browser = typeof window !== 'undefined';

// ATTENTION: callback of useInitialize in SSR context will be called instantly. Please make sure there would be no useEffect
// after useInitialize.
export function useInitialize (fn: InitializeCallback, deps?: DependencyList) {
  if (browser) {
    // eslint-disable-next-line react-hooks/rules-of-hooks,react-hooks/exhaustive-deps
    useEffect(() => fn(true), deps ?? []);
  } else {
    fn(false);
  }
}
