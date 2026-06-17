# Seed demo vaults on Casper Testnet
# Usage: npm run seed:demo-vaults

$ErrorActionPreference = "Stop"

# ── Load .env.local ──────────────────────────────────────────────────
$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$envFile = Join-Path $projectRoot ".env.local"
if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -match '^\s*#' -or $line -eq '') { return }
    if ($line -match '^([^=]+)=(.*)$') {
      $key = $matches[1].Trim()
      $value = $matches[2].Trim()
      if ($value.StartsWith('"') -and $value.EndsWith('"')) { $value = $value.Substring(1, $value.Length - 2) }
      if ($value.StartsWith("'") -and $value.EndsWith("'")) { $value = $value.Substring(1, $value.Length - 2) }
      [Environment]::SetEnvironmentVariable($key, $value)
    }
  }
}

# ── Config ───────────────────────────────────────────────────────────
$SECRET_KEY = $env:CASPER_RELAYER_SECRET_KEY_PATH
if ([string]::IsNullOrWhiteSpace($SECRET_KEY)) { $SECRET_KEY = "/home/emman/vaultcover-deploy-keys/secret_key.pem" }

$NODE = $env:CASPER_NODE_ADDRESS
if ([string]::IsNullOrWhiteSpace($NODE)) { $NODE = "https://node.testnet.casper.network/rpc" }

$CHAIN = $env:CASPER_CHAIN_NAME
if ([string]::IsNullOrWhiteSpace($CHAIN)) { $CHAIN = "casper-test" }

$CONTRACT_FULL = $env:VAULTCOVER_CONTRACT_HASH
if ([string]::IsNullOrWhiteSpace($CONTRACT_FULL)) { $CONTRACT_FULL = "hash-2f485675833c0abd6faa96803dd3cd02a35e6afc363fc545d2cdb4a05733b68a" }
$CONTRACT = $CONTRACT_FULL -replace "^hash-", ""

Write-Host "CASPER_NODE_ADDRESS:          $NODE"
Write-Host "CASPER_CHAIN_NAME:            $CHAIN"
Write-Host "VAULTCOVER_CONTRACT_HASH:     $CONTRACT_FULL"
Write-Host "Session hash (no prefix):     $CONTRACT"
Write-Host "CASPER_RELAYER_SECRET_KEY_PATH: [REDACTED]"

$VAULTS = @(
  @{ id="stable-yield-vault";     name="0xabc001"; cat="StableDeFi";    meta="0xmeta001" },
  @{ id="rwa-invoice-vault";      name="0xdef001"; cat="RWAInvoice";     meta="0xmeta002" },
  @{ id="high-apy-experimental";  name="0xghi001"; cat="Experimental";  meta="0xmeta003" }
)

# ── Validation ───────────────────────────────────────────────────────
if ([string]::IsNullOrWhiteSpace($NODE))     { throw "CASPER_NODE_ADDRESS is empty" }
if ([string]::IsNullOrWhiteSpace($CHAIN))    { throw "CASPER_CHAIN_NAME is empty" }
if ([string]::IsNullOrWhiteSpace($SECRET_KEY)) { throw "CASPER_RELAYER_SECRET_KEY_PATH is empty" }
if ([string]::IsNullOrWhiteSpace($CONTRACT)) { throw "VAULTCOVER_CONTRACT_HASH is empty" }

foreach ($v in $VAULTS) {
  if ([string]::IsNullOrWhiteSpace($v.id))   { throw "vault id is empty" }
  if ([string]::IsNullOrWhiteSpace($v.name)) { throw "name_hash is empty for $($v.id)" }
  if ([string]::IsNullOrWhiteSpace($v.cat))  { throw "category is empty for $($v.id)" }
  if ([string]::IsNullOrWhiteSpace($v.meta)) { throw "metadata_hash is empty for $($v.id)" }
}

# ── Helpers ──────────────────────────────────────────────────────────
function Print-SafeArgs($args) {
  Write-Host "[casper-client args]" -ForegroundColor Cyan
  for ($i = 0; $i -lt $args.Count; $i++) {
    if ($args[$i] -eq $SECRET_KEY) {
      Write-Host "  $i : [REDACTED]"
    } elseif ($args[$i] -match '^\s*\[{') {
      # Session args JSON — print prettified
      Write-Host "  $i : --session-args-json"
      try {
        $parsed = $args[$i] | ConvertFrom-Json
        $parsed | ForEach-Object { Write-Host "       { name=$($_.name), type=$($_.type), value=$($_.value) }" }
      } catch {
        Write-Host "       $($args[$i])"
      }
    } else {
      Write-Host "  $i : $($args[$i])"
    }
  }
}

function Extract-DeployHash($stdout) {
  if ($stdout -match '"deploy_hash"\s*:\s*"([a-fA-F0-9]{64})"') {
    return $matches[1]
  }
  return $null
}

function Get-Deploy($deployHash) {
  $out = & wsl.exe "--exec" "/home/emman/.cargo/bin/casper-client" "get-deploy" "--node-address" $NODE $deployHash 2>&1
  return $out
}

# ── Seed each vault ──────────────────────────────────────────────────
$results = @()

foreach ($vault in $VAULTS) {
  Write-Host ""
  Write-Host "===========================================================" -ForegroundColor Cyan
  Write-Host "[register_vault payload]" -ForegroundColor Cyan
  Write-Host "  vault_id:       $($vault.id)"
  Write-Host "  name_hash:      $($vault.name)"
  Write-Host "  category:       $($vault.cat)"
  Write-Host "  metadata_hash:  $($vault.meta)"
  Write-Host "  contract_hash:  $CONTRACT"
  Write-Host "  network:        $CHAIN"
  Write-Host "===========================================================" -ForegroundColor Cyan

  $sessionArgs = @(
    @{ name = "vault_id";      type = "String"; value = $vault.id },
    @{ name = "name_hash";     type = "String"; value = $vault.name },
    @{ name = "category";      type = "String"; value = $vault.cat },
    @{ name = "metadata_hash"; type = "String"; value = $vault.meta }
  )

  $sessionArgsJson = $sessionArgs | ConvertTo-Json -Compress
  if ([string]::IsNullOrWhiteSpace($sessionArgsJson)) {
    throw "sessionArgsJson is empty for $($vault.id)"
  }

  Write-Host "  session_args_json: $sessionArgsJson"

  $casperArgs = @(
    "--exec",
    "/home/emman/.cargo/bin/casper-client",
    "put-deploy",
    "--node-address", $NODE,
    "--chain-name", $CHAIN,
    "--secret-key", $SECRET_KEY,
    "--payment-amount", "10000000000",
    "--session-hash", $CONTRACT,
    "--session-entry-point", "register_vault",
    "--session-args-json", $sessionArgsJson
  )

  Print-SafeArgs $casperArgs

  $output = & wsl.exe @casperArgs 2>&1
  $exitCode = $LASTEXITCODE

  if ($exitCode -ne 0) {
    Write-Host "ERROR: exit code $exitCode" -ForegroundColor Red
    Write-Host $output
    exit 1
  }

  $deployHash = Extract-DeployHash $output
  if (-not $deployHash) {
    Write-Host "ERROR: Could not extract deploy_hash from output" -ForegroundColor Red
    Write-Host $output
    exit 1
  }

  Write-Host "Deploy hash: $deployHash" -ForegroundColor Green

  # Poll for confirmation
  $confirmed = $false
  $pollError = ""
  for ($i = 1; $i -le 15; $i++) {
    Write-Host "  Polling attempt $i/15..."
    Start-Sleep -Seconds 8
    $pollOut = Get-Deploy $deployHash
    if ($pollOut -match '"error_message":null') {
      $confirmed = $true
      break
    }
    if ($pollOut -match '"error_message"\s*:\s*"([^"]+)"') {
      $pollError = $matches[1]
      break
    }
  }

  if ($confirmed) {
    Write-Host "$($vault.id): confirmed" -ForegroundColor Green
    $results += @{ vaultId = $vault.id; status = "confirmed"; deployHash = $deployHash }
  } else {
    $errMsg = if ($pollError) { $pollError } else { "Polling timed out" }
    Write-Host "$($vault.id): FAILED - $errMsg" -ForegroundColor Red
    $results += @{ vaultId = $vault.id; status = "failed"; deployHash = $deployHash; error = $errMsg }
  }
}

# ── Verify on-chain ──────────────────────────────────────────────────
Write-Host ""
Write-Host "Running on-chain verification..." -ForegroundColor Cyan
foreach ($vault in $VAULTS) {
  try {
    $checkUrl = "http://localhost:3000/api/casper/check-vault?vaultId=$($vault.id)"
    $resp = Invoke-RestMethod -Uri $checkUrl -Method GET -ErrorAction Stop
    if ($resp.registered) {
      Write-Host "  $($vault.id): registered" -ForegroundColor Green
    } else {
      Write-Host "  $($vault.id): not registered" -ForegroundColor Yellow
    }
  } catch {
    Write-Host "  $($vault.id): check failed" -ForegroundColor Red
  }
}

Write-Host ""
$failed = ($results | Where-Object { $_.status -ne "confirmed" }).Count
if ($failed -eq 0) {
  Write-Host "All three demo vaults registered on-chain." -ForegroundColor Green
} else {
  Write-Host "$failed vault(s) failed. Check errors above." -ForegroundColor Yellow
}
