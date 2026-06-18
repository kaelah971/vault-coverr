# Design System Inspired by GSAP

## 1. Visual Theme & Atmosphere

The GSAP design system embodies a bold, modern aesthetic rooted in precision and creative expressiveness. Built for professional developers and motion designers, the system employs a dark, sophisticated foundation contrasted with vibrant accent colors that communicate energy and capability. The typography is clean and geometric, emphasizing clarity and hierarchy. Micro-interactions and smooth transitions underscore the brand's core promise of effortless animation, while layered gradients and experimental color combinations (lime green, cyan, magenta, pink) inject personality and approachability into an otherwise technical domain. The overall mood is confident, forward-thinking, and deeply professional—designed to inspire developers while maintaining technical credibility.

**Key Characteristics**
- High-contrast dark backgrounds with luminous foreground elements
- Experimental gradient accents in neon green, cyan, and magenta
- Minimalist, geometric typography with precise proportions
- Clean lines and breathing whitespace
- Vibrant, accent-driven micro-elements that draw attention strategically
- Professional yet playful visual language
- Strong emphasis on readability and typographic hierarchy

## 2. Color Palette & Roles

### Primary
- **Off-White / Primary Text** (`#FFFCE1`): Primary text, headlines, and dominant UI elements; creates high contrast against dark backgrounds
- **Deep Navy / Background** (`#0E100F`): Primary background color for all major sections and page foundation

### Accent Colors
- **Lime Green / Highlight** (`#ABFF84`): Accent highlight for key terms, emphasis, and CTAs; signals energy and action
- **Cyan / Secondary Accent** (`#00BAE2`): Secondary interactive accent for links, decorative elements, and complementary highlights
- **Magenta / Tertiary Accent** (`#F7BDF8`): Tertiary decorative accent in gradient compositions and playful UI moments
- **Light Magenta / Gradient Support** (`#FEC5FB`): Supporting color for gradient transitions and softer accent contexts

### Interactive
- **Success Green** (`#0AE448`): Indicates successful states, confirmations, and positive actions
- **Lime Green Interactive** (`#ABFF84`): Used for interactive highlights and call-to-action accents

### Neutral Scale
- **Dark Gray / Secondary Text** (`#7C7C6F`): Secondary navigation, disabled states, and tertiary text
- **Warm Gray / Tertiary Text** (`#BBBAA6`): Lighter secondary text and muted descriptions
- **Cool Black** (`#000000`): Pure black for high-contrast text and strong dividers
- **Charcoal** (`#42433D`): Dark neutral for subtle backgrounds and borders
- **Very Dark Gray** (`#191919`): Near-black variant for deep shadows and maximum contrast

### Surface & Borders
- **Soft White / Subtle Background** (`#F3FFEE`): Light mint-tinted surface for subtle backgrounds or hover states
- **Pale Cyan / Subtle Background** (`#F0FCFF`): Light cyan-tinted surface for alternative subtle backgrounds
- **Pale Magenta / Subtle Background** (`#FFE9FE`): Light magenta-tinted surface for softer accent backgrounds

## 3. Typography Rules

### Font Family
**Primary Font:** Mori (all weights and sizes)
- Fallback stack: `Mori, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

**Secondary Font:** (Not specified; Mori serves as universal typeface)
- Fallback stack: `Mori, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display / H1 | Mori | 32px | 400 | 36.8px | 0px | Hero headlines and main page titles |
| Heading / H2 | Mori | 24px | 400 | 27.6px | 0px | Section headers and major subheadings |
| Subheading / H3 | Mori | 18.72px | 400 | 21.528px | 0px | Tertiary headings and feature titles |
| Heading Strong / H4 | Mori | 18px | 600 | 21.6px | 0px | Bold subheadings and emphasis headers |
| Body Text | Mori | 14px | 400 | 19.6px | 0px | Standard paragraph and body copy |
| Body Large | Mori | 16px | 400 | 18.4px | 0px | Large body text and emphasis copy |
| Label / Form Text | Mori | 17.38px | 400 | 24.33px | 0px | Form labels and descriptive text |
| Button Text | Mori | 11px | 600 | 11px | 0px | All button labels and interactive text |
| Caption | Mori | 12px | 400 | 14.4px | 0px | Small supplementary text and captions |

### Principles
- **Single typeface system:** Mori is used exclusively across all text sizes and weights, creating visual cohesion and reducing complexity
- **Weight discipline:** Only 400 (regular) and 600 (semibold) weights are employed; heavier weights are avoided
- **Generous line heights:** All line heights exceed 1.2x the font size, ensuring readability and breathing room in dense content
- **No letter spacing:** Natural spacing is preserved; no artificial letter-spacing is applied
- **Size progression:** Hierarchy follows a clear mathematical progression, with display at 32px descending to button text at 11px
- **Weight economy:** Regular weight dominates; semibold (600) is reserved for buttons and strong emphasis

## 4. Component Stylings

### Buttons

**Primary Button (Outlined)**
- Background: `rgba(0, 0, 0, 0)` (transparent)
- Text Color: `#FFFCE1`
- Font Size: `11px`
- Font Weight: `600`
- Padding: `8px 14px`
- Border Radius: `100px`
- Border: `2px solid #FFFCE1`
- Line Height: `11px`
- Hover State: Increase opacity of border to full `#FFFCE1`, slight background tint `rgba(255, 252, 225, 0.1)`
- Active State: Background `rgba(255, 252, 225, 0.2)`, border `2px solid #FFFCE1`

**Secondary Button (Navigation)**
- Background: `rgba(0, 0, 0, 0)`
- Text Color: `#7C7C6F`
- Font Size: `16px`
- Font Weight: `600`
- Padding: `16px 0px`
- Border Radius: `0px`
- Border: `0px none`
- Line Height: `16.8px`
- Hover State: Text color transitions to `#FFFCE1`
- Active State: Text color `#FFFCE1`, subtle bottom border `2px solid #FFFCE1`

**Ghost Button (Link-style)**
- Background: `rgba(0, 0, 0, 0)`
- Text Color: `#7C7C6F`
- Font Size: `18px`
- Font Weight: `600`
- Padding: `16px 0px`
- Border Radius: `0px`
- Border: `0px none`
- Line Height: `18.9px`
- Hover State: Text color transitions to `#FFFCE1`

### Cards & Containers

**Default Card**
- Background: `rgba(14, 16, 15, 0.5)` (semi-transparent dark)
- Border: `1px solid #42433D`
- Border Radius: `8px`
- Padding: `24px 32px`
- Box Shadow: `0px 4px 16px rgba(0, 0, 0, 0.3)`

**Accent Card**
- Background: `rgba(171, 255, 132, 0.05)` (soft lime tint)
- Border: `1px solid rgba(171, 255, 132, 0.2)`
- Border Radius: `8px`
- Padding: `24px 32px`
- Box Shadow: `0px 4px 16px rgba(0, 0, 0, 0.3)`

### Inputs & Forms

**Text Input (Light Theme)**
- Background: `rgba(0, 0, 0, 0)` (transparent)
- Text Color: `#FFFCE1`
- Font Size: `16px`
- Font Weight: `400`
- Padding: `8px 0px`
- Border: `0px none`
- Border Bottom: `1px solid #FFFCE1`
- Height: `40px`
- Line Height: `16px`
- Focus State: Border-bottom color to `#ABFF84`, text color remains `#FFFCE1`
- Placeholder: `rgba(255, 252, 225, 0.5)`

**Text Input (Dark Theme)**
- Background: `rgba(0, 0, 0, 0)`
- Text Color: `#0E100F`
- Font Size: `16px`
- Font Weight: `400`
- Padding: `16px 0px`
- Border: `0px none`
- Border Bottom: `1px solid #0E100F`
- Line Height: `16px`
- Focus State: Border-bottom color transitions to `#00BAE2`, text color `#0E100F`

**Text Input (Black Theme)**
- Background: `rgba(0, 0, 0, 0)`
- Text Color: `#000000`
- Font Size: `16px`
- Font Weight: `400`
- Padding: `16px 0px`
- Border: `0px none`
- Border Bottom: `1px solid #000000`
- Height: `51.39px`
- Line Height: `18.4px`
- Focus State: Border-bottom color to `#00BAE2`, text remains `#000000`

### Navigation

**Primary Navigation Bar**
- Background: `#0E100F`
- Text Color: `#FFFCE1`
- Font Size: `16px`
- Font Weight: `400`
- Padding: `0px`
- Height: `50.89px`
- Line Height: `18.4px`
- Border Bottom: `1px solid rgba(255, 252, 225, 0.1)`
- Link Hover: Color transitions to `#ABFF84`
- Active Link: Color `#ABFF84`, with subtle underline in lime green

### Links

**Text Link (Light)**
- Background: `rgba(0, 0, 0, 0)`
- Text Color: `#FFFCE1`
- Font Size: `16px`
- Font Weight: `400`
- Padding: `0px`
- Border: `none`
- Line Height: `18.4px`
- Text Decoration: `underline`
- Hover State: Color transitions to `#ABFF84`
- Focus State: Outline `2px solid #00BAE2`, outline offset `2px`

**Text Link (Dark)**
- Background: `rgba(0, 0, 0, 0)`
- Text Color: `#0E100F`
- Font Size: `14px`
- Font Weight: `400`
- Padding: `0px`
- Border: `none`
- Line Height: `19.6px`
- Text Decoration: `underline`
- Hover State: Color to `#00BAE2`

## 5. Layout Principles

### Spacing System

**Base Unit:** `8px`

**Scale:**
- `4px`: Tight spacing between inline elements
- `8px`: Default gap between adjacent elements
- `12px`: Compact padding for small components
- `16px`: Standard padding for form inputs and buttons
- `20px`: Medium padding for card content
- `24px`: Standard section padding and gaps
- `32px`: Large component padding
- `36px`: Extra-large spacing for visual separation
- `40px`: XL padding for major sections
- `44px`: Large gap between major section groups
- `48px`: Hero section and maximum content padding
- `56px`: Page-level margin and major layout spacing

**Usage Context:**
- Tight spacing (`4px–8px`): Inline elements, icon-text combinations, compact components
- Standard spacing (`16px–24px`): Form fields, navigation, card content, between related elements
- Large spacing (`32px–40px`): Section padding, major component grouping
- Extra-large spacing (`44px–56px`): Page margins, between independent sections, hero elements

### Grid & Container

**Max Width:** `1280px` (inferred as standard container for professional web applications)

**Column Strategy:**
- Desktop: 12-column grid with flexible gutters of `24px`
- Tablet: 8-column grid with gutters of `16px`
- Mobile: Single-column or 4-column flexible grid with gutters of `12px`

**Section Patterns:**
- Full-bleed hero sections with dark background extend edge-to-edge
- Content sections use max-width containers centered with `auto` margins
- Whitespace columns on sides maintain breathing room on large displays
- Nested grid components preserve consistency within cards and modules

### Whitespace Philosophy

GSAP prioritizes generous whitespace to reduce cognitive load and emphasize key content. Spacing is hierarchical: major sections are separated by `56px` vertical margins, subsections by `32px–40px`, and inline elements by `8px–16px`. Horizontal whitespace creates margins of at least `24px` on desktop to all sides of content. Dark backgrounds amplify the visual weight of whitespace, so negative space becomes a design element itself. Content never crowds edges; minimum padding of `24px` is maintained on all sides of major containers.

### Border Radius Scale

- `0px`: Navigation, hero sections, inputs, and large structural elements maintain sharp corners for architectural clarity
- `8px`: Cards, modals, and contained components use subtle rounding for approachability
- `12px`: Larger panels and dialog boxes benefit from more pronounced rounding
- `100px`: Buttons use maximum rounding (pill shape) to communicate clickability and softness
- `50%`: Avatar images and circular badges use full-circle rounding

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Ground (0) | No shadow; flat design | Backgrounds, foundational sections, text |
| Raised (1) | `0px 2px 4px rgba(0, 0, 0, 0.2)` | Form inputs, small buttons, text links |
| Elevated (2) | `0px 4px 12px rgba(0, 0, 0, 0.3)` | Cards, outlined buttons, navigation items |
| Floating (3) | `0px 8px 24px rgba(0, 0, 0, 0.4)` | Modal dialogs, popovers, emphasized cards |
| Prominent (4) | `0px 16px 48px rgba(0, 0, 0, 0.5)` | Hero overlays, stage-level components, focus modals |

**Shadow Philosophy**

Shadows in the GSAP system are minimal and purposeful. The dark background naturally creates depth contrast, so shadows are used sparingly to avoid visual clutter. Small, sharp shadows (`0px 2px 4px`) are preferred for subtle elevation, with maximum blur radius capped at `48px` for floating elements. Shadows use black with controlled opacity (ranging from `0.2` to `0.5`) rather than pure black, maintaining the system's sophisticated aesthetic. Hover and active states leverage color shifts (lime green, cyan) before adding shadow depth, prioritizing motion and accent color over elevation changes.

## 7. Do's and Don'ts

### Do

- **Do** use `#FFFCE1` for all primary text and headlines on dark backgrounds; it provides ideal contrast and maintains brand identity
- **Do** apply the `11px` button size with `600` weight for all interactive CTAs; consistency across the interface builds familiarity
- **Do** leverage `#ABFF84` (lime green) and `#00BAE2` (cyan) as accent highlights to draw attention to key interactive elements or feature callouts
- **Do** maintain consistent `16px` or `32px` padding on all major card and section components for visual rhythm
- **Do** use the single Mori typeface exclusively; mixing fonts dilutes the cohesive, modern aesthetic
- **Do** preserve minimum `24px` horizontal margins on all sides of content to avoid crowding and maintain breathing room
- **Do** stack navigation items vertically in mobile contexts with consistent `16px` spacing between menu items
- **Do** use border-bottom underlines (not box-shadow) for link focus states; they are cleaner and more accessible
- **Do** apply transparent button backgrounds with solid borders; this maintains the elegant, minimalist philosophy
- **Do** use `0px` border-radius on inputs and navigation to reinforce structure and architectural clarity

### Don't

- **Don't** apply shadows heavier than `0px 16px 48px rgba(0, 0, 0, 0.5)` (Prominent level); excess shadow depth contradicts the flat, modern aesthetic
- **Don't** use text colors other than `#FFFCE1`, `#0E100F`, `#7C7C6F`, or black; the palette is intentionally limited for cohesion
- **Don't** add accent colors (`#ABFF84`, `#00BAE2`, `#F7BDF8`) to backgrounds unless they are highly transparent (max `0.1` opacity); these are highlight colors, not fills
- **Don't** use fonts other than Mori, and avoid adding extra fonts for special use cases; the single-typeface system ensures visual unity
- **Don't** apply rounded corners to navigation, hero sections, or input fields; `0px` radius is intentional for these structural elements
- **Don't** pad buttons beyond `8px 14px` for small CTAs or `16px 24px` for larger actions; deviation breaks typographic scale
- **Don't** mix navigation link styles; all nav items should maintain `16px` size and `400` weight unless they are active (then `600` weight)
- **Don't** apply box-shadow to inputs or form fields; use subtle bottom borders instead for visual clarity
- **Don't** exceed `48px` maximum padding on any single section; larger values introduce unnecessary whitespace and disrupt flow
- **Don't** use `#0AE448` (success green) outside of confirmed success states, form validation, or semantic positive feedback

## 8. Responsive Behavior

### Breakpoints

| Breakpoint | Width | Key Changes |
|------------|-------|-------------|
| Mobile | 320px–767px | Single-column layout, `12px` gutters, `16px` section padding, stacked navigation, `14px` body text, reduced `24px` display heading |
| Tablet | 768px–1023px | 8-column grid, `16px` gutters, `24px` section padding, horizontal navigation with wrapping, `18px` body text, `28px` display heading |
| Desktop | 1024px–1279px | 12-column grid, `24px` gutters, `32px` section padding, full navigation visible, standard typography sizes (32px display, 14px body) |
| Large Desktop | 1280px+ | Same as desktop with max-width container (`1280px`) centered, additional whitespace margins on sides |

### Touch Targets

- **Minimum Size:** All interactive elements (buttons, links, nav items) must be at least `44px` × `44px` on touch devices
- **Spacing Between Targets:** Interactive elements should be separated by minimum `8px` to prevent accidental activation
- **Buttons:** Primary buttons scale from `44px` height on mobile to `48px` on desktop, maintaining comfortable tap zone
- **Form Inputs:** Minimum height `44px` on mobile, `40px` on desktop; width should span full width minus padding on mobile, flexible on desktop
- **Navigation Links:** Each nav item padded to at least `44px` height on mobile; horizontal spacing increased to `16px` on touch screens

### Collapsing Strategy

- **Navigation:** Desktop horizontal navigation collapses to hamburger menu on mobile (below `768px`); menu items stack vertically with `12px` gaps inside drawer
- **Grid Columns:** Desktop 12-column grid reduces to 8 columns on tablet, then to single column on mobile; margin adjustments maintain consistent `16px` inner gutters
- **Padding:** Section padding reduces from `48px` (desktop) to `32px` (tablet) to `16px` (mobile) to accommodate smaller viewports
- **Font Sizes:** Display heading reduces from `32px` to `28px` on tablet and `24px` on mobile; body text remains `14px` across all breakpoints for readability
- **Whitespace:** Margin-bottom between sections reduces from `56px` (desktop) to `40px` (tablet) to `24px` (mobile) to prevent excessive scrolling
- **Hero Sections:** Full-bleed on all breakpoints; content padding adjusts as noted above; accent gradient elements reposition for smaller screens

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA:** Lime Green (`#ABFF84`) — Use for interactive highlights, key feature callouts, and primary action accents on dark backgrounds
- **Secondary CTA / Link:** Cyan (`#00BAE2`) — Use for secondary interactive elements, complementary accents, and alternative link states
- **Primary Text:** Off-White (`#FFFCE1`) — Use for all headlines, navigation, and primary body text on dark backgrounds
- **Background:** Deep Navy (`#0E100F`) — Use as the base background for all major sections and page foundation
- **Secondary Text:** Dark Gray (`#7C7C6F`) — Use for navigation, disabled states, and tertiary text
- **Success / Positive:** Success Green (`#0AE448`) — Use exclusively for confirmation states, validated form inputs, and positive feedback
- **Accent Gradient / Playful Elements:** Magenta (`#F7BDF8`) and Light Magenta (`#FEC5FB`) — Use in gradient compositions, decorative accents, and experimental visual moments

### Iteration Guide

1. **Typeface Consistency:** All text across the entire interface uses Mori only. Do not introduce alternative fonts. Weights limited to 400 (regular) and 600 (semibold).

2. **Color Discipline:** Primary text is `#FFFCE1` on dark backgrounds. Accents (`#ABFF84`, `#00BAE2`) are highlights only, never full backgrounds. Avoid colors outside the defined 15-color palette.

3. **Button Styling:** Primary CTAs use `11px` weight `600`, `8px 14px` padding, `100px` border-radius, transparent background, `2px solid #FFFCE1` border. Navigation buttons use `16px` weight `600`, `16px 0px` padding, `0px` border-radius, no border, transparent background.

4. **Spacing Scale:** All spacing derives from the `8px` base unit. Standard padding is `16px`, `24px`, or `32px`. Section margins are `32px–56px`. Never deviate from the scale; avoid arbitrary spacing values.

5. **Border Radius:** Structural elements (nav, inputs, hero) use `0px`. Cards and contained components use `8px`. Buttons use `100px`. Avatars use `50%`. No other radius values are permitted.

6. **Input Styling:** All inputs use `0px` border-radius, transparent background, no top/left/right borders, and a bottom border only in the text color. Font size is `16px`, weight `400`. Focus state changes border color to an accent (cyan or lime).

7. **Shadows:** Maximum shadow depth is `0px 16px 48px rgba(0, 0, 0, 0.5)`. Most components use no shadow or `0px 4px 12px rgba(0, 0, 0, 0.3)`. Never apply heavy shadows; the dark background already provides depth.

8. **Responsive Breakpoints:** Mobile below `768px` uses single-column layout, `16px` padding, stacked navigation. Tablet `768px–1023px` uses 8-column grid, `24px` padding. Desktop above `1024px` uses 12-column grid, full navigation, `32px–48px` padding.

9. **Whitespace Philosophy:** Minimum `24px` margins on all sides of content. Section separation is `32px–56px` depending on hierarchy. Never crowd edges. Dark backgrounds amplify whitespace value; prioritize breathing room.

10. **Interactive States:** Hover on links/buttons shifts color to `#ABFF84` or `#00BAE2`. Active states add slight color intensification or background tint (max `0.2` opacity). Focus states use clear outline or underline, never rely on color alone for accessibility.