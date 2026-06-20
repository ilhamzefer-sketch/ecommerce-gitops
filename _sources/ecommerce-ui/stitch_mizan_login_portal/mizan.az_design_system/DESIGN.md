---
name: Mizan.az Design System
colors:
  surface: '#f9fbed'
  surface-dim: '#d9dbce'
  surface-bright: '#f9fbed'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f5e7'
  surface-container: '#edefe2'
  surface-container-high: '#e7e9dc'
  surface-container-highest: '#e2e4d7'
  on-surface: '#1a1d15'
  on-surface-variant: '#434847'
  inverse-surface: '#2e3229'
  inverse-on-surface: '#f0f2e5'
  outline: '#737877'
  outline-variant: '#c3c7c6'
  surface-tint: '#58605f'
  primary: '#030808'
  on-primary: '#ffffff'
  primary-container: '#192120'
  on-primary-container: '#808987'
  inverse-primary: '#c0c8c6'
  secondary: '#984800'
  on-secondary: '#ffffff'
  secondary-container: '#ff964d'
  on-secondary-container: '#6e3200'
  tertiary: '#00090d'
  on-tertiary: '#ffffff'
  tertiary-container: '#06232b'
  on-tertiary-container: '#708b95'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce4e2'
  primary-fixed-dim: '#c0c8c6'
  on-primary-fixed: '#151d1c'
  on-primary-fixed-variant: '#404847'
  secondary-fixed: '#ffdbc8'
  secondary-fixed-dim: '#ffb689'
  on-secondary-fixed: '#311300'
  on-secondary-fixed-variant: '#733500'
  tertiary-fixed: '#cbe7f2'
  tertiary-fixed-dim: '#afcbd6'
  on-tertiary-fixed: '#021f27'
  on-tertiary-fixed-variant: '#304b53'
  background: '#f9fbed'
  on-background: '#1a1d15'
  surface-variant: '#e2e4d7'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style
The design system is engineered to evoke a sense of curated precision and effortless sophistication. It targets a discerning audience that values clarity over clutter, positioning the product as a premium, trustworthy authority in its space. 

The visual direction is rooted in **Minimalism** but elevated through **Soft Glassmorphism**. This combination uses expansive whitespace and a restrained palette to create a "gallery-like" environment where content is the protagonist. The professional tone is maintained through rigorous alignment and intentional hierarchy, while the soft glass effects add a layer of modern tactility and depth that feels high-end and digital-native.

## Colors
The palette is inspired by natural, earthy tones that suggest stability and organic growth. 

- **Surface (Vapor):** The primary canvas. It is a warm, desaturated off-white that reduces eye strain compared to pure white, providing a premium "paper" feel.
- **Primary (Depth):** Used for maximum contrast in typography and brand-critical elements. It provides the "anchor" for the visual weight.
- **Secondary / Accent (Orange):** A vibrant, energetic hue reserved strictly for Primary Calls to Action (CTAs), notification badges, and critical interactive feedback.
- **Support (Current):** A muted teal used for secondary interactions, informational states, or background accents to provide visual variety without breaking the minimalist harmony.
- **Text (Slate):** Used for secondary information, metadata, and placeholder text to maintain a clear visual hierarchy.

## Typography
**Plus Jakarta Sans** is the sole typeface for this design system, chosen for its modern geometric construction and excellent legibility. 

Hierarchy is established through significant weight shifts rather than just size. Display styles utilize tighter letter-spacing and bold weights to feel impactful and "branded." Body text is optimized for readability with generous line heights. Labels utilize uppercase styling with increased letter-spacing to differentiate functional UI text from narrative content.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop to ensure a curated, high-end feel that doesn't feel overly stretched on wide monitors.

- **Desktop (1440px+):** 12-column grid, 1120px max-width container, 24px gutters, 64px side margins.
- **Tablet (768px - 1439px):** 8-column fluid grid, 24px gutters, 40px margins.
- **Mobile (Up to 767px):** 4-column fluid grid, 16px gutters, 20px margins.

Spacing follows an 8px rhythmic scale. Use `lg` (48px) and `xl` (80px) for section vertical spacing to maintain the minimalist breathability of the design.

## Elevation & Depth
Depth is communicated through **Glassmorphism** and **Tonal Layering** rather than traditional heavy shadows.

- **Level 1 (Base):** Surface (Vapor) flat background.
- **Level 2 (Cards/Containers):** Secondary Surface (Sage) at 40-60% opacity with a `backdrop-filter: blur(12px)`. This creates a soft, translucent "frosted glass" effect.
- **Level 3 (Overlays/Modals):** High-opacity Sage background with a very soft, diffused shadow (`0 20px 40px rgba(25, 33, 32, 0.08)`).
- **Outlines:** Use a subtle 1px border in a slightly darker shade of Sage (#b4b9a8) to define boundaries on glass elements without adding visual weight.

## Shapes
The shape language is "Rounded," utilizing a 0.5rem (8px) base radius. This softens the professional tone of the typography, making the UI feel approachable and modern. 

- **Buttons & Inputs:** 0.5rem (8px).
- **Standard Cards:** 1rem (16px).
- **Modals & Large Containers:** 1.5rem (24px).
- **Icons:** Encased in 8px rounded squares or left as "raw" paths with rounded terminals to match the logo’s stroke style.

## Components

### Buttons
- **Primary:** Background: Orange (#f08a42); Text: White; Shape: Rounded-lg. High-impact, no shadow.
- **Secondary:** Background: Glassy Sage (40% opacity); Text: Depth (#192120); Border: 1px Solid Sage.
- **Ghost:** Text: Depth (#192120); No background; Bold weight.

### Input Fields
- **Default State:** Background: Sage (#c1c5b6) at 20% opacity; Border: Bottom-only 2px in Slate (#6a7167); Label: Floating Plus Jakarta Sans.
- **Focus State:** Border: Bottom-only 2px in Orange (#f08a42).

### Cards
- **Product/Content Cards:** Borderless. Background uses the glassmorphism treatment (blurred Sage). 16px internal padding. Images should have a subtle 8px corner radius.

### Chips & Tags
- **Style:** Small, pill-shaped. Background: Current (#76919b) at 15% opacity; Text: Current (#76919b) at 100% opacity. Use for categories or status indicators.

### Selection Controls
- **Checkbox/Radio:** When active, fill with Orange (#f08a42). Use the 8px roundedness for checkboxes (not fully square) to maintain the soft aesthetic.

### Lists
- Separated by subtle 1px Sage (#c1c5b6) dividers. Generous vertical padding (16px+) to ensure a premium, uncrowded feel.