import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * True only after the client has hydrated. Prefer this over `useEffect` +
 * `setState` for mount detection — useSyncExternalStore's snapshots let the
 * client "flip" to true without an effect-triggered re-render cascade.
 */
export function useHasMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
