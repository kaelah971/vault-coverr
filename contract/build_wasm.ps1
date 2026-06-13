# Build Casper-compatible WASM with bulk-memory disabled
# Usage: .\build_wasm.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "[1/5] Building contract WASM..." -ForegroundColor Cyan
Write-Host "       - bulk-memory disabled (via .cargo/config.toml)"
Write-Host "       - ODRA_MODULE set to struct name (not fqn)"
$env:RUSTFLAGS = "-C target-feature=-bulk-memory"
$env:ODRA_MODULE = "VaultCoverContract"
cargo build --release --target wasm32-unknown-unknown --bin vaultcover_build_contract
if ($LASTEXITCODE -ne 0) { throw "cargo build failed" }

$built = "target\wasm32-unknown-unknown\release\vaultcover_build_contract.wasm"
if (-not (Test-Path $built)) { throw "WASM not found at $built" }

Write-Host "[2/5] Lowering bulk memory operations with wasm-opt..." -ForegroundColor Cyan
$wasmOpt = Resolve-Path "..\node_modules\.bin\wasm-opt.cmd" -ErrorAction SilentlyContinue
if (-not $wasmOpt) { $wasmOpt = Resolve-Path "..\node_modules\binaryen\bin\wasm-opt" -ErrorAction SilentlyContinue }
if (-not $wasmOpt) { throw "wasm-opt not found. Run: npm install" }

$output = "wasm\VaultCoverContract.wasm"
& $wasmOpt --disable-bulk-memory --llvm-memory-copy-fill-lowering -Oz $built -o $output
if ($LASTEXITCODE -ne 0) { throw "wasm-opt failed" }

Write-Host "[3/5] Verifying no bulk memory instructions..." -ForegroundColor Cyan
$bulk = wasm-tools print $output 2>&1 | Select-String -Pattern "memory\.(init|copy|fill)|data\.drop|table\.(init|copy)|elem\.drop" -Quiet
if ($bulk) { throw "Bulk memory instructions still present!" }

Write-Host "[4/5] Verifying 'call' export exists..." -ForegroundColor Cyan
$hasCall = wasm-tools print $output 2>&1 | Select-String -Pattern '(export "call")' -Quiet
if (-not $hasCall) { throw "Export 'call' is missing!" }

Write-Host "[5/5] Build complete!" -ForegroundColor Green
$info = Get-Item $output
Write-Host "Output:                    $($info.FullName)" -ForegroundColor Green
Write-Host "Size:                      $($info.Length) bytes" -ForegroundColor Green
Write-Host "Export 'call':             PRESENT" -ForegroundColor Green
Write-Host "Bulk memory instructions:  ABSENT" -ForegroundColor Green
