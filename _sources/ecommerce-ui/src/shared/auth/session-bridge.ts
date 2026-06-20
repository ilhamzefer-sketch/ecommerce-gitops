type RefreshSessionResult = {
  accessToken?: string | null;
} | null;

type SessionBridgeCallbacks = {
  refreshSession: () => Promise<RefreshSessionResult>;
  onSessionExpired: () => void;
};

let refreshSessionCallback: SessionBridgeCallbacks["refreshSession"] | null = null;
let sessionExpiredCallback: SessionBridgeCallbacks["onSessionExpired"] | null = null;

export function registerSessionBridge(callbacks: SessionBridgeCallbacks | null) {
  refreshSessionCallback = callbacks?.refreshSession ?? null;
  sessionExpiredCallback = callbacks?.onSessionExpired ?? null;
}

export async function refreshSessionFromBridge() {
  if (!refreshSessionCallback) {
    return null;
  }

  return refreshSessionCallback();
}

export function signalSessionExpired() {
  sessionExpiredCallback?.();
}
