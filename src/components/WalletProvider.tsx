"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  createCasperProvider,
  isWalletInstalled,
  providerSupportsEvents,
  fetchBalance,
} from "@/lib/casper-wallet";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface WalletContextValue {
  address: string | null;
  balance: string | null;
  isConnected: boolean;
  isInstalled: boolean;
  network: string;
  connectedAt: number | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  error: string | null;
}

// ── Persistence ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "vaultcover_wallet_connected";

interface PersistedState {
  address: string;
  connectedAt: number;
}

function loadPersisted(): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    if (parsed.address && typeof parsed.connectedAt === "number") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function savePersisted(state: PersistedState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clearPersisted(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

// ── Context ────────────────────────────────────────────────────────────────────

const WalletContext = createContext<WalletContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────────

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isInstalled] = useState(() => isWalletInstalled());
  const [connectedAt, setConnectedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addressRef = useRef<string | null>(null);

  const refreshBalance = useCallback(async (pubKey: string) => {
    const bal = await fetchBalance(pubKey);
    setBalance(bal);
  }, []);

  // ── Auto-connect from persisted state ────────────────────────────────────
  useEffect(() => {
    if (!isInstalled) return;

    const persisted = loadPersisted();
    if (!persisted) return;

    // If we have persisted state, we were connected before.
    // The wallet extension remembers the connection — just call
    // getActivePublicKey() to retrieve the current key.
    const provider = createCasperProvider();
    if (!provider) return;
    if (typeof provider.getActivePublicKey !== "function") return;

    let cancelled = false;

    (async () => {
      try {
        const activeKey = await provider.getActivePublicKey();
        if (cancelled) return;

        if (activeKey === persisted.address) {
          setAddress(activeKey);
          addressRef.current = activeKey;
          setConnectedAt(persisted.connectedAt);
          refreshBalance(activeKey);
        } else {
          clearPersisted();
        }
      } catch {
        clearPersisted();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isInstalled, refreshBalance]);

  // ── Event listeners (optional — only if provider supports .on) ───────────
  useEffect(() => {
    if (!isInstalled) return;

    const provider = createCasperProvider();
    if (!provider) return;
    if (!providerSupportsEvents(provider)) return;

    const onActiveKeyChanged = (...args: unknown[]) => {
      const newKey = args[0] as string | undefined;
      if (!newKey) {
        setAddress(null);
        addressRef.current = null;
        setConnectedAt(null);
        setBalance(null);
        clearPersisted();
      } else if (newKey !== addressRef.current) {
        setAddress(newKey);
        addressRef.current = newKey;
        setConnectedAt(Date.now());
        savePersisted({ address: newKey, connectedAt: Date.now() });
        refreshBalance(newKey);
      }
    };

    const onDisconnected = () => {
      setAddress(null);
      addressRef.current = null;
      setConnectedAt(null);
      setBalance(null);
      clearPersisted();
    };

    provider.on!("activeKeyChanged", onActiveKeyChanged);
    provider.on!("disconnected", onDisconnected);

    return () => {
      const off = provider.off ?? provider.removeListener;
      if (typeof off === "function") {
        off.call(provider, "activeKeyChanged", onActiveKeyChanged);
        off.call(provider, "disconnected", onDisconnected);
      }
    };
  }, [isInstalled, refreshBalance]);

  // ── Connect ──────────────────────────────────────────────────────────────
  const connect = useCallback(async () => {
    setError(null);

    const provider = createCasperProvider();
    if (!provider) {
      setError("Casper Wallet is not installed. Please install it from casperwallet.io.");
      return;
    }

    // Step 1: requestConnection — must be called before getActivePublicKey
    if (typeof provider.requestConnection !== "function") {
      setError("Wallet provider does not support requestConnection.");
      return;
    }

    try {
      const connected = await provider.requestConnection();
      if (!connected) {
        setError("User declined wallet connection.");
        return;
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Wallet connection request failed.";
      setError(message);
      return;
    }

    // Step 2: getActivePublicKey — only after successful connection
    if (typeof provider.getActivePublicKey !== "function") {
      setError("Wallet provider does not support getActivePublicKey.");
      return;
    }

    try {
      const activeKey = await provider.getActivePublicKey();

      if (!activeKey) {
        setError("No active key returned from wallet.");
        return;
      }

      const now = Date.now();
      setAddress(activeKey);
      addressRef.current = activeKey;
      setConnectedAt(now);
      savePersisted({ address: activeKey, connectedAt: now });
      refreshBalance(activeKey);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to retrieve public key.";
      setError(message);
    }
  }, [refreshBalance]);

  // ── Disconnect ───────────────────────────────────────────────────────────
  const disconnect = useCallback(async () => {
    setError(null);

    const provider = createCasperProvider();
    if (provider) {
      // Try disconnectFromSite first, then disconnect as fallback
      const disconnectFn =
        provider.disconnectFromSite ??
        (provider as unknown as Record<string, unknown>).disconnect;
      if (typeof disconnectFn === "function") {
        try {
          await (disconnectFn as () => Promise<void>).call(provider);
        } catch {
          // Best-effort — clear state regardless
        }
      }
    }

    setAddress(null);
    addressRef.current = null;
    setConnectedAt(null);
    setBalance(null);
    clearPersisted();
  }, []);

  const value: WalletContextValue = {
    address,
    balance,
    isConnected: address !== null,
    isInstalled,
    network: "Casper Testnet",
    connectedAt,
    connect,
    disconnect,
    error,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within a <WalletProvider>.");
  }
  return ctx;
}
