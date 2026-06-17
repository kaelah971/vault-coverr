// ── Types ──────────────────────────────────────────────────────────────────────

const REQUESTS_TIMEOUT_MS = 30 * 60 * 1000;

/**
 * The Casper Wallet browser extension injects `window.CasperWalletProvider`
 * as a **factory function**. Call it to get the provider instance.
 */
export interface CasperWalletProviderFactory {
  (options: { timeout: number }): CasperWalletProviderInstance;
}

/** The actual wallet provider returned by the factory. */
export interface CasperWalletProviderInstance {
  requestConnection(): Promise<boolean>;
  getActivePublicKey(): Promise<string>;
  disconnectFromSite(): Promise<void>;
  /**
   * Sign a deploy JSON or message. Casper Wallet expects a deploy JSON
   * string (legacy Deploy format), not just a hash hex string.
   * Returns the signed deploy as a JSON object with a `deploy` property.
   */
  sign?(message: string, signingPublicKeyHex?: string): Promise<{ deploy: Record<string, unknown> } & Record<string, unknown>>;
  on?(event: string, callback: (...args: unknown[]) => void): void;
  off?(event: string, callback: (...args: unknown[]) => void): void;
  removeListener?: (event: string, callback: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    CasperWalletProvider?: CasperWalletProviderFactory;
    casperlabsHelper?: CasperSignerLike;
  }
}

/** Legacy Casper Signer fallback. */
export interface CasperSignerLike {
  getActivePublicKey?: () => Promise<string>;
  isConnected?: () => Promise<boolean>;
  sign?: (...args: unknown[]) => Promise<unknown>;
}

// ── Constants ───────────────────────────────────────────────────────────────────

const TESTNET_RPC = "https://node.testnet.casper.network/rpc";
const MOTE_RATE = BigInt(1_000_000_000);

// ── Wallet detection ────────────────────────────────────────────────────────────

export function createCasperProvider(): CasperWalletProviderInstance | null {
  if (typeof window === "undefined") return null;
  const factory = window.CasperWalletProvider;
  if (!factory || typeof factory !== "function") return null;
  try {
    const provider = factory({ timeout: REQUESTS_TIMEOUT_MS });
    if (process.env.NODE_ENV === "development") {
      console.log("[casper-wallet] provider keys:", Object.keys(provider || {}));
      if (provider && typeof provider.sign === "function") {
        console.log("[casper-wallet] wallet supports sign()");
      }
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

export function formatAddress(key: string): string {
  if (key.length <= 8) return key;
  return `${key.slice(0, 4)}…${key.slice(-4)}`;
}

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
    const rpc = new RpcClient(new HttpHandler(TESTNET_RPC));
    _fetchBalanceImpl = async (publicKeyHex: string): Promise<string | null> => {
      try {
        const pk = PublicKey.fromHex(publicKeyHex);
        const ident = PurseIdentifier.fromPublicKey(pk);
        const result = await rpc.queryLatestBalance(ident);
        const motes = BigInt(result.balance.toString());
        const cspr = motes / MOTE_RATE;
        const remainder = motes % MOTE_RATE;
        return `${cspr.toLocaleString()}.${remainder.toString().padStart(9, "0").slice(0, 2)} CSPR`;
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

export async function fetchBalance(publicKeyHex: string): Promise<string | null> {
  const impl = await ensureBalanceImpl();
  return impl(publicKeyHex);
}

// ── Wallet-signed deploy ────────────────────────────────────────────────────────

export interface DeployArgs {
  entryPoint: string;
  args: Record<string, unknown>;
  paymentMotes: number;
  chainName: string;
  nodeAddress: string;
  contractHash: string;
}

export interface DeployResult {
  /** The unsigned deploy JSON built before calling wallet. Send to /api/casper/send-signed-deploy. */
  deployJson: unknown;
  /** The raw response from Casper Wallet's sign() call. Expect keys: [cancelled, signatureHex, signature]. */
  walletSignature: unknown;
}

export type DeployStep = "building" | "wallet_sign";

export interface DeployOptions {
  onProgress?: (step: DeployStep) => void;
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms);
    promise.then((v) => { clearTimeout(timer); resolve(v); }).catch((e) => { clearTimeout(timer); reject(e); });
  });
}

function normalizeCasperHash(value: string): string {
  const normalized = value
    .trim()
    .replace(/^hash-/, "")
    .replace(/^contract-/, "")
    .replace(/^contract-package-/, "");
  if (!/^[0-9a-fA-F]{64}$/.test(normalized)) {
    throw new Error(
      `Invalid contract hash. Expected 64 hex characters after removing prefix. Got: ${normalized.length} chars`
    );
  }
  return normalized;
}

/**
 * Build a legacy-format Deploy and get it signed by the connected
 * Casper Wallet extension. Returns the raw wallet response — the
 * frontend sends it to POST /api/casper/send-signed-deploy for
 * broadcast.
 */
export async function signAndSendDeploy(
  provider: CasperWalletProviderInstance,
  publicKeyHex: string,
  params: DeployArgs,
  options: DeployOptions = {}
): Promise<DeployResult> {
  if (typeof provider.sign !== "function") {
    const keys = Object.keys(provider).join(", ");
    throw new Error(
      `Casper Wallet does not support signing. Available: [${keys}]. Update the extension.`
    );
  }

  const sdk = await import("casper-js-sdk");
  const {
    DeployHeader,
    Deploy,
    ExecutableDeployItem,
    StoredContractByHash,
    ContractHash,
    Timestamp,
    Duration,
    PublicKey,
    CLValue,
    CLTypeString,
    CLTypeUInt64,
    CLValueString,
    CLValueUInt64,
    Args,
  } = sdk;

  // ── Build CL values ──────────────────────────────────────────────
  const argMap: Record<string, unknown> = {};
  for (const [key, raw] of Object.entries(params.args)) {
    if (typeof raw === "string") {
      const v = new CLValue(CLTypeString);
      v.stringVal = new CLValueString(raw);
      argMap[key] = v;
    } else if (typeof raw === "number") {
      const v = new CLValue(CLTypeUInt64);
      v.ui64 = new CLValueUInt64(raw);
      argMap[key] = v;
    }
  }
  const runtimeArgs = Args.fromMap(argMap as Record<string, InstanceType<typeof CLValue>>);

  // ── Build legacy Deploy and sign with wallet ────────────────────
  options.onProgress?.("building");
  console.log("[signAndSendDeploy] deploy built");

  const publicKey = PublicKey.fromHex(publicKeyHex);
  const rawHash = normalizeCasperHash(params.contractHash);
  console.log("[signAndSendDeploy] raw contract hash length:", params.contractHash.length);
  console.log("[signAndSendDeploy] normalized hash length:", rawHash.length);
  const contractHash = ContractHash.newContract(rawHash);

  const session = new ExecutableDeployItem();
  session.storedContractByHash = new StoredContractByHash(
    contractHash,
    params.entryPoint,
    runtimeArgs
  );

  const payment = ExecutableDeployItem.standardPayment(
    String(params.paymentMotes)
  );

  const header = new DeployHeader(
    params.chainName,
    [],
    1,
    new Timestamp(new Date()),
    new Duration(30 * 60 * 1000),
    publicKey
  );

  const deploy = Deploy.makeDeploy(header, payment, session);
  const deployJson = Deploy.toJSON(deploy);

  options.onProgress?.("wallet_sign");
  console.log("[signAndSendDeploy] deploy JSON created, calling wallet sign");

  let signedResponse: unknown;
  try {
    const signPromise = provider.sign(
      JSON.stringify(deployJson),
      publicKeyHex
    );
    signedResponse = await withTimeout(signPromise, 60_000, "Wallet signature");
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/timed out/i.test(msg)) {
      throw new Error("Wallet signature timed out. Open Casper Wallet and try again.");
    }
    if (/cancel|reject|denied|user/i.test(msg)) {
      throw new Error("Wallet signature was cancelled.");
    }
    throw err;
  }

  console.log("[signAndSendDeploy] wallet signature returned");
  console.log("[signAndSendDeploy] response type:", typeof signedResponse);
  if (signedResponse && typeof signedResponse === "object") {
    console.log("[signAndSendDeploy] response keys:", Object.keys(signedResponse as Record<string, unknown>));
  }

  // Return deployJson + walletSignature for the backend to assemble
  return { deployJson, walletSignature: signedResponse };
}
