/**
 * VaultCover contract error codes.
 * Must match contract/src/vault_cover.rs `#[odra::odra_error] pub enum Error`.
 */
export const VAULTCOVER_ERRORS: Record<number, string> = {
  1: "VaultAlreadyExists",
  2: "VaultNotFound",
  3: "VaultNotActive",
  4: "PolicyAlreadyExists",
  5: "PolicyNotFound",
  6: "PolicyExpired",
  7: "RiskEventAlreadyExists",
  8: "RiskEventNotFound",
  9: "ClaimAlreadyExists",
  10: "ClaimNotFound",
  11: "ClaimAlreadyProcessed",
  12: "AccessDenied",
};

export function decodeContractError(errorMessage: string): string | null {
  const match = errorMessage.match(/User error:\s*(\d+)/);
  if (!match) return null;
  const code = parseInt(match[1], 10);
  const name = VAULTCOVER_ERRORS[code];
  return name ? `${name} (code ${code})` : `Unknown error (code ${code})`;
}
