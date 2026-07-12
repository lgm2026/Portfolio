// Preview-only stub. The single-file build has no service worker, so this
// stands in for the virtual:pwa-register module and does nothing.
export function registerSW(_options?: unknown): (reload?: boolean) => Promise<void> {
  return async () => undefined;
}
