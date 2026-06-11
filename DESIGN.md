# DESIGN.md — VaultCover Structural Foundation

## 0. Design System Intent

VaultCover is a Casper-native AI risk and parametric cover prototype for DeFi and RWA vaults.

This design system should not behave like a generic AI SaaS landing page.

It should feel like:

- a protected financial control room
- a vault monitoring layer
- a premium risk interface
- an institutional DeFi protection product
- calm technology with serious consequences

The page should make users feel:
"this product understands risk before it talks about yield."

## 1. Brand Positioning

### Product Name

VaultCover

### Product Category

AI-monitored parametric cover for DeFi and RWA vault deposits.

### Core Promise

Do not just chase APY.
Cover the risk.

### Core Product Loop

Browse vaults
→ Compare APY, TVL, risk score, and cover status
→ Buy a cover policy
→ AI Risk Agent monitors vault health
→ Trigger condition occurs
→ Claim signal is generated
→ Claim and payout simulation are recorded
→ Cover Receipt is created

### Legal-Safe Language

Use:
- parametric cover
- AI-monitored protection
- cover policy prototype
- predefined trigger
- claim signal
- payout simulation
- Cover Receipt

Avoid:
- insurance
- guaranteed payout
- underwritten policy
- regulated claim
- guaranteed protection

## 2. Visual Foundation

### Permanent Background

Obsidian Black

Hex:
#080A0C

Usage:
- page background
- hero background
- footer background
- dashboard shell
- modal backdrop

This is the permanent foundation of the brand.

Do not replace it with navy, charcoal, purple, gradient black, or blue-black.

### Primary Accent

Vault Gold

Hex:
#E6C08A

Usage:
- hero headline
- primary CTA
- active navigation
- borders
- icons
- proof markers
- vault highlights
- selected states
- technical emphasis

Vault Gold is the only primary accent color.

Do not introduce purple, cyan, neon blue, or generic AI gradients.

### Supporting Colors

Primary Text:
#F4E7CF

Secondary Text:
#C8B28C

Muted Text:
#8D7A5D

Body Text on Dark:
#EAD7B6

Card Surface:
#0D1013

Raised Surface:
#12161A

Elevated Surface:
#171C21

Deep Surface:
#050607

Success:
#76D99C

Warning:
#E6C08A

Danger:
#D66A5E

Info:
#9FB7C7

### Border Colors

Subtle Gold Border:
rgba(230, 192, 138, 0.10)

Default Gold Border:
rgba(230, 192, 138, 0.24)

Strong Gold Border:
rgba(230, 192, 138, 0.45)

Divider:
rgba(230, 192, 138, 0.12)

## 3. Typography System

### Display / Headline Font

Font:
Agency FB

Role:
Brand-defining display font.

Use for:
- hero headline
- major section headings
- numeric proof
- large status statements
- major landing page declarations

Do not use for:
- body copy
- paragraph text
- long descriptions
- technical JSON
- dense dashboard tables

### UI / Body Font

Font:
Georama

Fallback:
Satoshi

Use for:
- navigation
- body copy
- cards
- labels
- buttons
- form fields
- dashboard UI
- explanatory text

### Mono / Technical Font

Font:
JetBrains Mono

Fallback:
Geist Mono

Use for:
- policy IDs
- vault IDs
- APY values
- TVL values
- risk scores
- transaction hashes
- claim receipts
- JSON snippets
- risk reports
- technical labels

## 4. Type Scale

### Desktop Type Scale

Hero Eyebrow:
- Font: Georama
- Size: 14px–16px
- Weight: 500
- Line height: 1.2
- Letter spacing: 0.04em
- Text transform: uppercase
- Color: #E6C08A

Hero Headline:
- Font: Agency FB
- Size: 76px–96px
- Weight: 600–700
- Line height: 0.92–0.98
- Letter spacing: 0.01em
- Text transform: uppercase
- Color: #E6C08A

Hero Body:
- Font: Georama
- Size: 19px–22px
- Weight: 400
- Line height: 1.55–1.7
- Max width: 620px
- Color: #EAD7B6

Section Eyebrow:
- Font: Georama
- Size: 12px–14px
- Weight: 600
- Letter spacing: 0.08em
- Text transform: uppercase
- Color: #8D7A5D

Section Heading:
- Font: Agency FB
- Size: 48px–64px
- Weight: 600
- Line height: 0.95–1.05
- Text transform: uppercase
- Color: #E6C08A

Subheading:
- Font: Georama
- Size: 22px–28px
- Weight: 500
- Line height: 1.25
- Color: #F4E7CF

Body:
- Font: Georama
- Size: 16px–18px
- Weight: 400
- Line height: 1.6–1.75
- Color: #C8B28C

Small Body:
- Font: Georama
- Size: 14px–15px
- Weight: 400
- Line height: 1.55
- Color: #8D7A5D

Button Text:
- Font: Georama
- Size: 15px–16px
- Weight: 600
- Line height: 1
- Letter spacing: 0

Mono / Technical:
- Font: JetBrains Mono
- Size: 12px–14px
- Weight: 400–500
- Line height: 1.45
- Color: #E6C08A

Dashboard Metric:
- Font: JetBrains Mono
- Size: 24px–36px
- Weight: 600
- Line height: 1
- Color: #F4E7CF

### Tablet Type Scale

Hero Headline:
- Size: 60px–72px

Section Heading:
- Size: 42px–52px

Hero Body:
- Size: 18px–20px

Body:
- Size: 16px

### Mobile Type Scale

Hero Eyebrow:
- Size: 12px–13px

Hero Headline:
- Size: 46px–56px
- Line height: 0.95–1.02

Hero Body:
- Size: 16px–18px
- Line height: 1.6

Section Heading:
- Size: 34px–42px

Body:
- Size: 15px–16px

Button:
- Size: 15px

## 5. Layout Foundation

### Max Width

Page container:
1280px

Wide container:
1440px

Reading container:
680px

Dashboard container:
Fluid, max 1440px

### Page Padding

Desktop:
48px–56px horizontal

Tablet:
32px horizontal

Mobile:
20px horizontal

### Section Spacing

Hero:
160px top minimum
120px bottom minimum

Standard Section:
96px–120px vertical

Dense Dashboard Section:
40px–64px vertical

Proof / Receipt Section:
120px–144px vertical

Final CTA:
140px vertical

### Grid System

Landing:
12-column grid

Hero:
Left content: 5–6 columns
Right visual: 6–7 columns

Dashboard:
Sidebar + content grid
or
12-column content grid

Card grids:
Avoid equal 3-card sameness.

Prefer:
- 1 large card + 2 small cards
- horizontal scroll modules
- staggered cards
- dashboard-style panels
- asymmetric proof blocks

## 6. Radius System

Buttons:
6px

Inputs:
8px

Small cards:
12px

Primary cards:
16px

Large feature modules:
18px

Modals:
20px

Receipts:
12px

Avoid:
- 24px–32px radius everywhere
- playful oversized pills
- glassy rounded AI cards

The system should feel engineered, not soft.

## 7. Button System

### Primary Button

Use for:
- Explore Vaults
- Launch App
- Buy Cover
- Submit Claim
- Generate Cover Receipt

Style:
- Background: #E6C08A
- Text: #080A0C
- Border: 1px solid rgba(255, 255, 255, 0.12)
- Radius: 6px
- Padding: 16px 28px
- Font: Georama
- Weight: 600
- Shadow: subtle gold edge only

Hover:
- Background: #F0CCA0
- Transform: translateY(-1px)
- Box shadow: 0 0 24px rgba(230, 192, 138, 0.16)

Active:
- Transform: translateY(0)
- Shadow reduced

### Secondary Button

Use for:
- View Demo
- Read Docs
- View Policy
- See Risk Report

Style:
- Background: transparent
- Text: #E6C08A
- Border: 1px solid rgba(230, 192, 138, 0.55)
- Radius: 6px
- Padding: 16px 28px

Hover:
- Background: rgba(230, 192, 138, 0.08)
- Border: 1px solid rgba(230, 192, 138, 0.85)

### Ghost Button

Use for:
- table actions
- small dashboard links
- inline technical actions

Style:
- Background: transparent
- Text: #C8B28C
- Border: none

Hover:
- Text: #E6C08A

## 8. Navigation System

### Desktop Nav

Structure:

Left:
VaultCover logo

Center:
Vaults
How It Works
Protection
Docs
About

Right:
Launch App button

Style:
- Transparent over hero
- Background becomes rgba(8, 10, 12, 0.78) on scroll
- Backdrop blur: 16px
- Border bottom: 1px solid rgba(230, 192, 138, 0.08)
- Height: 82px–96px

Nav links:
- Font: Georama
- Size: 15px–16px
- Weight: 500
- Color: #C8B28C

Hover:
- Color: #E6C08A

Active:
- Color: #E6C08A
- Optional small bottom indicator

### Mobile Nav

Structure:
- Logo left
- Menu icon right
- Fullscreen or near-fullscreen overlay
- Obsidian background
- Gold borders
- Large Agency FB links

Avoid:
- tiny dropdown menus
- cluttered mobile header
- generic hamburger panels with white backgrounds

## 9. Hero Section Direction

The hero should feel like the front door to a protected vault system.

### Composition

Left side:
- Eyebrow
- Headline
- Body copy
- CTA row
- Trust line

Right side:
- 3D vault-core object
- risk grid
- protection field
- subtle gold light
- dashboard fragment or vault module

### Locked Hero Content

Eyebrow:
AI-MONITORED PARAMETRIC COVER FOR DEFI & RWA VAULTS

Headline:
DON'T JUST CHASE APY.
COVER THE RISK.

Body:
Compare vault risk before depositing, purchase protection against predefined danger conditions, and receive AI-generated claim signals when vault health deteriorates.

Primary CTA:
Explore Vaults

Secondary CTA:
View Demo

Trust Line:
Built on Casper Testnet

### Hero Visual Rules

Use:
- protected core
- vault geometry
- square frame language
- soft gold internal light
- risk lines
- monitored cover layers
- subtle spatial depth

Avoid:
- human illustrations
- AI robots
- generic shields
- generic lock graphics
- blue holograms
- purple neon
- cluttered crypto coin visuals

## 10. Card System

Cards should borrow from premium dark interface cards with thin borders and structural geometry.

### Base Card

Background:
#0D1013

Border:
1px solid rgba(230, 192, 138, 0.18)

Radius:
16px

Padding:
24px–32px

Hover:
- Border becomes rgba(230, 192, 138, 0.38)
- Internal glow appears softly
- Transform: translateY(-2px)

### Feature Card

Use for:
- vault preview
- trigger explanation
- AI Risk Agent blocks
- Cover Receipt preview

Must include at least one of:
- metric
- timeline
- status marker
- receipt fragment
- risk graph
- policy state

Do not use empty icon-title-description cards.

### Vault Card

Required content:
- vault name
- category
- APY
- TVL
- risk score
- cover status
- AI Risk Agent status

Visual rules:
- Risk score should be the strongest visual signal
- APY should never visually dominate risk
- Cover availability should be clear

### Technical Card

Use for:
- JSON output
- risk report
- transaction hashes
- contract entrypoints

Style:
- Background: #050607
- Border: 1px solid rgba(230, 192, 138, 0.16)
- Font: JetBrains Mono
- Radius: 12px

## 11. Dashboard Visual Language

Dashboard should feel like a vault operations console.

Not a SaaS admin panel.

### Dashboard Shell

Background:
#080A0C

Sidebar:
#050607 or #0D1013

Main panels:
#0D1013

Raised panels:
#12161A

Borders:
rgba(230, 192, 138, 0.12)

### Dashboard Components

Use:
- metric strips
- vault cards
- risk timelines
- policy tables
- claim-status panels
- transaction receipt cards
- AI agent status modules

### Data Hierarchy

Priority order:
1. Risk score
2. Cover status
3. Trigger state
4. Policy status
5. APY
6. TVL
7. Transaction hashes

This matters.

VaultCover should not make APY the loudest metric.

### Status Colors

Safe:
#76D99C

Watch:
#E6C08A

Critical:
#D66A5E

Neutral:
#9FB7C7

### Tables

Table row height:
56px

Header:
- Font: Georama
- Size: 12px
- Weight: 600
- Uppercase
- Letter spacing: 0.06em
- Color: #8D7A5D

Cell text:
- Font: Georama
- Size: 14px–15px
- Color: #C8B28C

Numeric cells:
- Font: JetBrains Mono
- Size: 13px–14px
- Color: #F4E7CF

### Risk Timeline

Use:
- thin gold line
- status nodes
- timestamp labels
- trigger markers
- receipt checkpoints

Avoid:
- colorful calendar/timeline UI
- playful progress bars

## 12. Three.js / WebGL Direction

### Purpose

Three.js and WebGL should create trust, depth, and atmosphere.

They should not exist just to look "AI."

### Hero 3D Object

Object idea:
A protected vault core.

Shape language:
- square frame
- layered casing
- inner glowing core
- protective cover rings
- subtle panel seams
- faint risk lines connecting outward

Material:
- matte black casing
- brushed dark metal
- warm gold inner light
- low roughness, not glossy chrome
- controlled reflections

Lighting:
- soft gold internal glow
- very subtle rim light
- dark ambient environment
- no rainbow lighting

Animation:
- slow breathing glow
- slight rotation, max 3–5 degrees
- cover layers subtly expand/contract
- small risk-line pulses moving toward the core

Performance:
- Keep geometry lightweight
- Use reduced motion fallback
- Static rendered fallback for mobile or low-power devices

### Background WebGL

Allowed:
- faint particle dust
- subtle grid distortion
- low-opacity gold lines
- slow ambient motion
- spatial depth

Avoid:
- fast particles
- purple/blue blobs
- high-density starfields
- sci-fi HUD clutter
- noisy mesh gradients

### Scroll Interaction

As user scrolls:
- hero object can slightly recede
- gold light can reduce
- dashboard panels can slide/fade in
- risk lines can resolve into product UI modules

Movement should feel like entering deeper into the vault system.

## 13. Motion System

### Motion Philosophy

Institutional trust over startup hype.

Motion should feel:
- slow
- controlled
- precise
- protective
- expensive

### Timing

Fast interaction:
150ms

Standard hover:
220ms–260ms

Section entrance:
400ms–600ms

Hero ambient loop:
6s–12s

### Easing

Use:
cubic-bezier(0.22, 1, 0.36, 1)

Also acceptable:
ease-out

Avoid:
- bounce
- elastic
- springy cartoon motion
- overactive parallax

### Button Motion

Hover:
- translateY(-1px)
- glow increase
- border brightens

Click:
- returns to flat
- glow reduces

### Card Motion

Hover:
- translateY(-2px)
- border strengthens
- inner glow appears

### Section Entrance

Use:
- opacity 0 to 1
- y 16px to 0
- stagger 80ms–120ms

Avoid:
- large slide-ins
- spinning elements
- random fade directions

### Reduced Motion

If prefers-reduced-motion:
- disable WebGL ambient movement
- disable parallax
- keep opacity transitions only
- preserve visual hierarchy

## 14. Landing Page Structure

### 1. Hero

Goal:
Make the category and promise clear immediately.

Must include:
- locked hero copy
- two CTAs
- Casper Testnet trust line
- right-side 3D vault object or protected core visual

### 2. Vault Explorer Preview

Show the three demo vaults:
- Stable Yield Vault
- RWA Invoice Vault
- High APY Experimental Vault

Each vault card shows:
- APY
- TVL
- risk score
- cover availability
- AI Risk Agent status

### 3. Risk Before Yield

Explain the problem:
APY can look good while risk silently deteriorates.

Use visual:
APY column next to risk signals.

### 4. How Protection Works

Flow:
Browse
→ Buy Cover
→ AI Monitors
→ Trigger Detected
→ Claim Signal
→ Cover Receipt

Use a horizontal or stepped flow, not a generic 3-card grid.

### 5. AI Risk Agent

Show structured output:
- vault_id
- risk_score
- triggered
- trigger_type
- confidence
- summary
- recommended_action
- risk_report_hash

This section should feel technical and trustworthy.

### 6. Parametric Trigger System

Show trigger examples:
- APY collapse
- TVL drop
- withdrawal spike
- depeg event
- risk score breach
- RWA payment delay
- strategy deviation
- admin/key warning

### 7. Cover Policy Preview

Show:
- cover amount
- premium
- expiry
- policy status
- vault covered
- supported triggers

### 8. Cover Receipt

Show final proof object:
- policy ID
- claim status
- payout simulation
- transaction hashes
- risk report hash

### 9. Casper Alignment

Show:
- Casper Testnet
- Agentic AI
- DeFi
- RWA
- x402 optional risk-report access

### 10. Final CTA

Headline:
PROTECT YIELD BEFORE IT BREAKS.

CTA:
Explore Vaults

Secondary:
View Demo

## 15. Responsive Rules

### Desktop

Target:
1440px

Rules:
- 12-column grid
- hero uses two-column layout
- large display headline
- 3D object visible
- nav links visible

### Tablet

Target:
768px–1024px

Rules:
- hero still can use two columns if space allows
- reduce headline size
- cards become 2-column
- nav may collapse earlier if cramped

### Mobile

Target:
360px–430px

Rules:
- hero becomes single column
- 3D visual moves below copy or becomes static image
- CTAs stack
- nav collapses into menu
- cards stack vertically
- dashboard tables become scrollable cards
- preserve premium spacing

Do not over-compress.

A cramped premium brand stops feeling premium.

## 16. Anti-Slop Constraints

Never use:
- purple gradient blobs
- blue AI glow
- random mesh gradients
- stock crypto illustrations
- floating AI heads
- generic robots
- generic shield icons
- generic lock icons
- glassmorphism cards
- 32px rounded cards
- playful bouncy animation
- equal 3-card feature grids
- "Get Started" as main CTA
- APY as the loudest visual metric
- fake investor logos
- vague copy like "AI-powered insights"

Every section should answer:
Why does this make vault deposits safer or clearer?

If it does not answer that, cut it.

## 17. Stitch / Claude / Lovable Guardrails

When generating UI, always follow:

- Use Agency FB for headlines.
- Use Georama for UI and body text.
- Use JetBrains Mono for technical fields.
- Use #080A0C as the permanent background.
- Use #E6C08A as the only accent color.
- Keep buttons at 6px radius.
- Keep cards at 16px radius.
- Use thin gold borders.
- Use asymmetric dashboard-style cards instead of generic feature cards.
- Make risk score visually stronger than APY.
- Show product mechanics, not abstract AI magic.
- Use calm motion and premium spacing.
- Avoid generic Web3 visuals.
