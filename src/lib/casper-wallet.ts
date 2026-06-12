// ── Types ──────────────────────────────────────────────────────────────────────

const REQUESTS_TIMEOUT_MS = 30 * 60 * 1000;

/**
 * The Casper Wallet browser extension injects `window.CasperWalletProvider`
 * as a **factory function**. Call it to get the provider instance.
 *
 *   const provider = window.CasperWalletProvider({ timeout: 30 * 60 * 1000 });
 */
export interface CasperWalletProviderFactory {
  (options: { timeout: number }): CasperWalletProviderInstance;
}

/** The actual wallet provider returned by the factory. */
export interface CasperWalletProviderInstance {
  requestConnection(): Promise<boolean>;
  getActivePublicKey(): Promise<string>;
  disconnectFromSite(): Promise<void>;
  on?(event: string, callback: (...args: unknown[]) => void): void;
  off?(event: string, callback: (...args: unknown[]) => void): void;
  removeListener?: (event: string, callback: (...args: unknown[]) => void) => void;
}

/** Legacy Casper Signer — only used as a last-resort fallback. */
export interface CasperSignerLike {
  getActivePublicKey?: () => Promise<string>;
  isConnected?: () => Promise<boolean>;
  sign?: (...args: unknown[]) => Promise<unknown>;
}

declare global {
  interface Window {
    CasperWalletProvider?: CasperWalletProviderFactory;
    casperlabsHelper?: CasperSignerLike;
  }
}

// ── Constants ───────────────────────────────────────────────────────────────────

const TESTNET_RPC = "https://node.testnet.casper.network/rpc";
const MOTE_RATE = BigInt(1_000_000_000);

// ── Wallet detection ────────────────────────────────────────────────────────────

/**
 * Call the Casper Wallet factory to get the provider instance.
 * Returns `null` when the extension is not installed OR when the browser is SSR.
 *
 * IMPORTANT: `window.CasperWalletProvider` is a **factory function**, not an
 * instance. You must **call** it to get the actual provider that has
 * `.requestConnection()` and `.getActivePublicKey()`.
 */
export function createCasperProvider(): CasperWalletProviderInstance | null {
  if (typeof window === "undefined") return null;

  const factory = window.CasperWalletProvider;
  if (!factory) return null;
  if (typeof factory !== "function") {
    // Not a factory — some other object was injected under this name
    return null;
  }

  try {
    const provider = factory({ timeout: REQUESTS_TIMEOUT_MS });

    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      console.log("Casper provider keys:", Object.keys(provider || {}));
    }

    return provider;
  } catch {
    return null;
  }
}

export function isWalletInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return typeof window.CasperWalletProvider !== "undefined";
}

// ── Helpers ─────────────────────────────────────────────────────────────────────

export function formatAddress(key: string): string {
  if (key.length <= 8) return key;
  return `${key.slice(0, 4)}…${key.slice(-4)}`;
}

/**
 * Returns `true` if the given provider supports the event API.
 */
export function providerSupportsEvents(
  provider: CasperWalletProviderInstance
): boolean {
  return typeof provider.on === "function";
}

// ── Balance (lazy RPC) ─────────────────────────────────────────────────────────

let _fetchBalanceImpl: ((key: string) => Promise<string | null>) | null = null;

async function ensureBalanceImpl(): Promise<
  (key: string) => Promise<string | null>
> {
  if (_fetchBalanceImpl) return _fetchBalanceImpl;

  try {
    const mod = await import("casper-js-sdk");
    const { RpcClient, HttpHandler, PurseIdentifier, PublicKey } = mod;

    const handler = new HttpHandler(TESTNET_RPC);
    const rpc = new RpcClient(handler);

    _fetchBalanceImpl = async (
      publicKeyHex: string
    ): Promise<string | null> => {
      try {
        const publicKey = PublicKey.fromHex(publicKeyHex);
        const identifier = PurseIdentifier.fromPublicKey(publicKey);
        const result = await rpc.queryLatestBalance(identifier);

        const motesStr = result.balance.toString();
        const motes = BigInt(motesStr);

        const cspr = motes / MOTE_RATE;
        const remainder = motes % MOTE_RATE;
        const wholePart = cspr.toLocaleString();
        const fractionalPart = remainder
          .toString()
          .padStart(9, "0")
          .slice(0, 2);

        return `${wholePart}.${fractionalPart} CSPR`;
      } catch {
        return null;
      }
    };

    return _fetchBalanceImpl;
  } catch {
    _fetchBalanceImpl = async () => null;
    return _fetchBalanceImpl;
  }
}

export async function fetchBalance(
  publicKeyHex: string
): Promise<string | null> {
  const impl = await ensureBalanceImpl();
  return impl(publicKeyHex);
}
