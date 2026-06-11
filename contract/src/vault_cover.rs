use odra::prelude::*;

// ---------------------------------------------------------------------------
// Custom types
// ---------------------------------------------------------------------------

#[odra::odra_type]
pub struct Vault {
    pub vault_id: String,
    pub name_hash: String,
    pub category: String,
    pub apy: u64,
    pub tvl: u64,
    pub risk_score: u8,
    pub cover_available: bool,
    pub active: bool,
    pub metadata_hash: String,
}

#[odra::odra_type]
pub struct CoverPolicy {
    pub policy_id: String,
    pub user: Address,
    pub vault_id: String,
    pub cover_amount: u64,
    pub premium: u64,
    pub expiry: u64,
    pub status: String,
    pub created_at: u64,
}

#[odra::odra_type]
pub struct RiskEvent {
    pub risk_event_id: String,
    pub vault_id: String,
    pub trigger_type: String,
    pub risk_score: u8,
    pub evidence_hash: String,
    pub confidence: u8,
    pub submitted_at: u64,
}

#[odra::odra_type]
pub struct Claim {
    pub claim_id: String,
    pub policy_id: String,
    pub risk_event_id: String,
    pub claimant: Address,
    pub status: String,
    pub payout_amount: u64,
    pub created_at: u64,
    pub processed_at: u64,
}

// ---------------------------------------------------------------------------
// Error enum
// ---------------------------------------------------------------------------

#[odra::odra_error]
pub enum Error {
    VaultAlreadyExists = 1,
    VaultNotFound = 2,
    VaultNotActive = 3,
    PolicyAlreadyExists = 4,
    PolicyNotFound = 5,
    PolicyExpired = 6,
    RiskEventAlreadyExists = 7,
    RiskEventNotFound = 8,
    ClaimAlreadyExists = 9,
    ClaimNotFound = 10,
    ClaimAlreadyProcessed = 11,
    AccessDenied = 12,
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

#[odra::event]
pub struct VaultRegistered {
    pub vault_id: String,
    pub category: String,
}

#[odra::event]
pub struct VaultMetricsUpdated {
    pub vault_id: String,
    pub apy: u64,
    pub tvl: u64,
    pub risk_score: u8,
}

#[odra::event]
pub struct CoverPolicyCreated {
    pub policy_id: String,
    pub vault_id: String,
    pub user: Address,
    pub cover_amount: u64,
    pub premium: u64,
}

#[odra::event]
pub struct RiskEventSubmitted {
    pub risk_event_id: String,
    pub vault_id: String,
    pub trigger_type: String,
    pub risk_score: u8,
    pub confidence: u8,
}

#[odra::event]
pub struct ClaimSubmitted {
    pub claim_id: String,
    pub policy_id: String,
    pub claimant: Address,
}

#[odra::event]
pub struct ClaimProcessed {
    pub claim_id: String,
    pub status: String,
    pub payout_amount: u64,
}

// ---------------------------------------------------------------------------
// Module definition
// ---------------------------------------------------------------------------

#[odra::module(
    events = [
        VaultRegistered,
        VaultMetricsUpdated,
        CoverPolicyCreated,
        RiskEventSubmitted,
        ClaimSubmitted,
        ClaimProcessed
    ],
    errors = Error
)]
pub struct VaultCoverContract {
    vaults: Mapping<String, Vault>,
    vault_ids: List<String>,
    policies: Mapping<String, CoverPolicy>,
    policy_ids: List<String>,
    risk_events: Mapping<String, RiskEvent>,
    risk_event_ids: List<String>,
    claims: Mapping<String, Claim>,
    claim_ids: List<String>,
}

// ---------------------------------------------------------------------------
// Entrypoints
// ---------------------------------------------------------------------------

#[odra::module]
impl VaultCoverContract {
    pub fn init(&mut self) {}

    // -- Vault management ---------------------------------------------------

    pub fn register_vault(
        &mut self,
        vault_id: String,
        name_hash: String,
        category: String,
        metadata_hash: String,
    ) {
        if self.vaults.get(&vault_id).is_some() {
            self.env().revert(Error::VaultAlreadyExists);
        }

        let vault = Vault {
            vault_id: vault_id.clone(),
            name_hash,
            category: category.clone(),
            apy: 0,
            tvl: 0,
            risk_score: 0,
            cover_available: true,
            active: true,
            metadata_hash,
        };

        self.vaults.set(&vault_id, vault);
        self.vault_ids.push(vault_id.clone());

        self.env().emit_event(VaultRegistered {
            vault_id,
            category,
        });
    }

    pub fn update_vault_metrics(
        &mut self,
        vault_id: String,
        apy: u64,
        tvl: u64,
        risk_score: u8,
    ) {
        let mut vault = self
            .vaults
            .get(&vault_id)
            .unwrap_or_revert_with(&self.env(), Error::VaultNotFound);

        if !vault.active {
            self.env().revert(Error::VaultNotActive);
        }

        vault.apy = apy;
        vault.tvl = tvl;
        vault.risk_score = risk_score;

        self.vaults.set(&vault_id, vault);

        self.env().emit_event(VaultMetricsUpdated {
            vault_id,
            apy,
            tvl,
            risk_score,
        });
    }

    // -- Cover policies -----------------------------------------------------

    pub fn create_cover_policy(
        &mut self,
        policy_id: String,
        vault_id: String,
        cover_amount: u64,
        premium: u64,
        expiry: u64,
    ) {
        let vault = self
            .vaults
            .get(&vault_id)
            .unwrap_or_revert_with(&self.env(), Error::VaultNotFound);

        if !vault.active {
            self.env().revert(Error::VaultNotActive);
        }

        if self.policies.get(&policy_id).is_some() {
            self.env().revert(Error::PolicyAlreadyExists);
        }

        let policy = CoverPolicy {
            policy_id: policy_id.clone(),
            user: self.env().caller(),
            vault_id: vault_id.clone(),
            cover_amount,
            premium,
            expiry,
            status: String::from("active"),
            created_at: self.env().get_block_time(),
        };

        self.policies.set(&policy_id, policy);
        self.policy_ids.push(policy_id.clone());

        self.env().emit_event(CoverPolicyCreated {
            policy_id,
            vault_id,
            user: self.env().caller(),
            cover_amount,
            premium,
        });
    }

    // -- Risk events --------------------------------------------------------

    pub fn submit_risk_event(
        &mut self,
        risk_event_id: String,
        vault_id: String,
        trigger_type: String,
        risk_score: u8,
        evidence_hash: String,
        confidence: u8,
    ) {
        let vault = self
            .vaults
            .get(&vault_id)
            .unwrap_or_revert_with(&self.env(), Error::VaultNotFound);

        if !vault.active {
            self.env().revert(Error::VaultNotActive);
        }

        if self.risk_events.get(&risk_event_id).is_some() {
            self.env().revert(Error::RiskEventAlreadyExists);
        }

        let event = RiskEvent {
            risk_event_id: risk_event_id.clone(),
            vault_id: vault_id.clone(),
            trigger_type: trigger_type.clone(),
            risk_score,
            evidence_hash: evidence_hash.clone(),
            confidence,
            submitted_at: self.env().get_block_time(),
        };

        self.risk_events.set(&risk_event_id, event);
        self.risk_event_ids.push(risk_event_id.clone());

        self.env().emit_event(RiskEventSubmitted {
            risk_event_id,
            vault_id,
            trigger_type,
            risk_score,
            confidence,
        });
    }

    // -- Claims -------------------------------------------------------------

    pub fn submit_claim(
        &mut self,
        claim_id: String,
        policy_id: String,
        risk_event_id: String,
    ) {
        let policy = self
            .policies
            .get(&policy_id)
            .unwrap_or_revert_with(&self.env(), Error::PolicyNotFound);

        if policy.status != "active" {
            self.env().revert(Error::PolicyExpired);
        }

        let _risk_event = self
            .risk_events
            .get(&risk_event_id)
            .unwrap_or_revert_with(&self.env(), Error::RiskEventNotFound);

        if self.claims.get(&claim_id).is_some() {
            self.env().revert(Error::ClaimAlreadyExists);
        }

        let claim = Claim {
            claim_id: claim_id.clone(),
            policy_id: policy_id.clone(),
            risk_event_id,
            claimant: self.env().caller(),
            status: String::from("submitted"),
            payout_amount: 0,
            created_at: self.env().get_block_time(),
            processed_at: 0,
        };

        self.claims.set(&claim_id, claim);
        self.claim_ids.push(claim_id.clone());

        self.env().emit_event(ClaimSubmitted {
            claim_id,
            policy_id,
            claimant: self.env().caller(),
        });
    }

    pub fn process_claim(
        &mut self,
        claim_id: String,
        approved: bool,
        payout_amount: u64,
    ) {
        let mut claim = self
            .claims
            .get(&claim_id)
            .unwrap_or_revert_with(&self.env(), Error::ClaimNotFound);

        if claim.status != "submitted" {
            self.env().revert(Error::ClaimAlreadyProcessed);
        }

        claim.status = if approved {
            String::from("simulated")
        } else {
            String::from("rejected")
        };
        claim.payout_amount = payout_amount;
        claim.processed_at = self.env().get_block_time();

        self.claims.set(&claim_id, claim);

        self.env().emit_event(ClaimProcessed {
            claim_id,
            status: if approved {
                String::from("simulated")
            } else {
                String::from("rejected")
            },
            payout_amount,
        });
    }

    // -- Getters ------------------------------------------------------------

    pub fn get_vault(&self, vault_id: String) -> Vault {
        self.vaults
            .get(&vault_id)
            .unwrap_or_revert_with(&self.env(), Error::VaultNotFound)
    }

    pub fn get_policy(&self, policy_id: String) -> CoverPolicy {
        self.policies
            .get(&policy_id)
            .unwrap_or_revert_with(&self.env(), Error::PolicyNotFound)
    }

    pub fn get_risk_event(&self, risk_event_id: String) -> RiskEvent {
        self.risk_events
            .get(&risk_event_id)
            .unwrap_or_revert_with(&self.env(), Error::RiskEventNotFound)
    }

    pub fn get_claim(&self, claim_id: String) -> Claim {
        self.claims
            .get(&claim_id)
            .unwrap_or_revert_with(&self.env(), Error::ClaimNotFound)
    }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;
    use odra::host::{Deployer, NoArgs};

    fn deploy() -> VaultCoverContractHostRef {
        let env = odra_test::env();
        VaultCoverContract::deploy(&env, NoArgs)
    }

    #[test]
    fn test_register_vault() {
        let mut contract = deploy();

        contract.register_vault(
            String::from("stable-yield-vault"),
            String::from("0xabc001"),
            String::from("Stable DeFi"),
            String::from("0xmeta001"),
        );

        let vault = contract.get_vault(String::from("stable-yield-vault"));
        assert_eq!(vault.vault_id, "stable-yield-vault");
        assert_eq!(vault.name_hash, "0xabc001");
        assert_eq!(vault.category, "Stable DeFi");
        assert!(vault.active);
        assert!(vault.cover_available);
        assert_eq!(vault.apy, 0);
    }

    #[test]
    #[should_panic]
    fn test_register_duplicate_vault() {
        let mut contract = deploy();

        contract.register_vault(
            String::from("stable-yield-vault"),
            String::from("0xabc001"),
            String::from("Stable DeFi"),
            String::from("0xmeta001"),
        );

        contract.register_vault(
            String::from("stable-yield-vault"),
            String::from("0xabc002"),
            String::from("Stable DeFi 2"),
            String::from("0xmeta002"),
        );
    }

    #[test]
    fn test_update_vault_metrics() {
        let mut contract = deploy();

        contract.register_vault(
            String::from("stable-yield-vault"),
            String::from("0xabc001"),
            String::from("Stable DeFi"),
            String::from("0xmeta001"),
        );

        contract.update_vault_metrics(
            String::from("stable-yield-vault"),
            520,   // APY = 5.20% (basis points)
            4_700_000, // TVL
            18,    // risk score
        );

        let vault = contract.get_vault(String::from("stable-yield-vault"));
        assert_eq!(vault.apy, 520);
        assert_eq!(vault.tvl, 4_700_000);
        assert_eq!(vault.risk_score, 18);
    }

    #[test]
    fn test_create_cover_policy() {
        let mut contract = deploy();

        contract.register_vault(
            String::from("rwa-invoice-vault"),
            String::from("0xdef001"),
            String::from("RWA · Featured"),
            String::from("0xmeta003"),
        );

        contract.create_cover_policy(
            String::from("POL-a1b2c3d4e5f6a7b8"),
            String::from("rwa-invoice-vault"),
            10_000, // cover amount
            150,    // premium
            172800000, // expiry (48h in ms)
        );

        let policy = contract.get_policy(String::from("POL-a1b2c3d4e5f6a7b8"));
        assert_eq!(policy.policy_id, "POL-a1b2c3d4e5f6a7b8");
        assert_eq!(policy.vault_id, "rwa-invoice-vault");
        assert_eq!(policy.cover_amount, 10_000);
        assert_eq!(policy.premium, 150);
        assert_eq!(policy.status, "active");
    }

    #[test]
    fn test_submit_risk_event() {
        let mut contract = deploy();

        contract.register_vault(
            String::from("rwa-invoice-vault"),
            String::from("0xdef001"),
            String::from("RWA · Featured"),
            String::from("0xmeta003"),
        );

        contract.submit_risk_event(
            String::from("REV-d4f8a2b9"),
            String::from("rwa-invoice-vault"),
            String::from("TVL_DROP"),
            84,
            String::from("0xd4f8a2b9c1e36547f09d82ab716ce93584f7a2b1093c6e58d1f472ba36e93a91"),
            91,
        );

        let event = contract.get_risk_event(String::from("REV-d4f8a2b9"));
        assert_eq!(event.risk_event_id, "REV-d4f8a2b9");
        assert_eq!(event.vault_id, "rwa-invoice-vault");
        assert_eq!(event.trigger_type, "TVL_DROP");
        assert_eq!(event.risk_score, 84);
        assert_eq!(event.confidence, 91);
    }

    #[test]
    fn test_submit_and_process_claim() {
        let test_env = odra_test::env();
        test_env.advance_block_time(1_000);
        let mut contract = VaultCoverContract::deploy(&test_env, NoArgs);

        // 1. Register vault
        contract.register_vault(
            String::from("rwa-invoice-vault"),
            String::from("0xdef001"),
            String::from("RWA · Featured"),
            String::from("0xmeta003"),
        );

        // 2. Create cover policy
        contract.create_cover_policy(
            String::from("POL-a1b2c3d4e5f6a7b8"),
            String::from("rwa-invoice-vault"),
            10_000,
            150,
            172800000,
        );

        // 3. Submit risk event
        contract.submit_risk_event(
            String::from("REV-d4f8a2b9"),
            String::from("rwa-invoice-vault"),
            String::from("TVL_DROP"),
            84,
            String::from("0xd4f8a2b9c1e36547f09d82ab716ce93584f7a2b1093c6e58d1f472ba36e93a91"),
            91,
        );

        // 4. Submit claim
        contract.submit_claim(
            String::from("CLM-ff1e2d3c4b5a6978"),
            String::from("POL-a1b2c3d4e5f6a7b8"),
            String::from("REV-d4f8a2b9"),
        );

        let claim = contract.get_claim(String::from("CLM-ff1e2d3c4b5a6978"));
        assert_eq!(claim.status, "submitted");
        assert_eq!(claim.policy_id, "POL-a1b2c3d4e5f6a7b8");
        assert_eq!(claim.risk_event_id, "REV-d4f8a2b9");

        // 5. Process claim (payout simulation)
        contract.process_claim(
            String::from("CLM-ff1e2d3c4b5a6978"),
            true,       // approved
            8_500,       // payout (85% of $10K)
        );

        let processed = contract.get_claim(String::from("CLM-ff1e2d3c4b5a6978"));
        assert_eq!(processed.status, "simulated");
        assert_eq!(processed.payout_amount, 8_500);
        assert_eq!(processed.processed_at, 1_000);
    }

    #[test]
    fn test_full_demo_flow() {
        let mut contract = deploy();

        // Register three demo vaults
        contract.register_vault(
            String::from("stable-yield-vault"),
            String::from("0xsyv001"),
            String::from("Stable DeFi"),
            String::from("0xmeta001"),
        );
        contract.register_vault(
            String::from("rwa-invoice-vault"),
            String::from("0xriv001"),
            String::from("RWA · Featured"),
            String::from("0xmeta002"),
        );
        contract.register_vault(
            String::from("high-apy-experimental"),
            String::from("0xhae001"),
            String::from("Experimental"),
            String::from("0xmeta003"),
        );

        // Update metrics for all three
        contract.update_vault_metrics(
            String::from("stable-yield-vault"), 520, 4_700_000, 18,
        );
        contract.update_vault_metrics(
            String::from("rwa-invoice-vault"), 840, 2_100_000, 47,
        );
        contract.update_vault_metrics(
            String::from("high-apy-experimental"), 3870, 800_000, 83,
        );

        // Verify all vaults
        let v1 = contract.get_vault(String::from("stable-yield-vault"));
        assert_eq!(v1.apy, 520);
        assert_eq!(v1.risk_score, 18);

        let v2 = contract.get_vault(String::from("rwa-invoice-vault"));
        assert_eq!(v2.tvl, 2_100_000);
        assert_eq!(v2.risk_score, 47);

        let v3 = contract.get_vault(String::from("high-apy-experimental"));
        assert_eq!(v3.apy, 3870);
        assert_eq!(v3.risk_score, 83);

        // Create cover policy
        contract.create_cover_policy(
            String::from("POL-demo001"),
            String::from("rwa-invoice-vault"),
            10_000, 150, 172800000,
        );

        // Submit risk event
        contract.submit_risk_event(
            String::from("REV-demo001"),
            String::from("rwa-invoice-vault"),
            String::from("TVL_DROP"),
            84,
            String::from("0xhash_demo_001"),
            91,
        );

        // Submit claim
        contract.submit_claim(
            String::from("CLM-demo001"),
            String::from("POL-demo001"),
            String::from("REV-demo001"),
        );

        // Process claim (payout simulation)
        contract.process_claim(
            String::from("CLM-demo001"),
            true, 8_500,
        );

        let receipt = contract.get_claim(String::from("CLM-demo001"));
        assert_eq!(receipt.status, "simulated");
        assert_eq!(receipt.payout_amount, 8_500);
    }

    #[test]
    fn test_events_emitted() {
        let test_env = odra_test::env();
        let mut contract = VaultCoverContract::deploy(&test_env, NoArgs);

        contract.register_vault(
            String::from("stable-yield-vault"),
            String::from("0xabc001"),
            String::from("Stable DeFi"),
            String::from("0xmeta001"),
        );

        // VaultRegistered event
        assert!(test_env.emitted(&contract, "VaultRegistered"));
    }
}
