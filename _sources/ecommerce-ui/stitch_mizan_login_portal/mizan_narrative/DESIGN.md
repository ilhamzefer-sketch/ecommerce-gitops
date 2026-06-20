---
name: Mizan Narrative
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
  on-surface-variant: '#554338'
  inverse-surface: '#2e3229'
  inverse-on-surface: '#f0f2e5'
  outline: '#887367'
  outline-variant: '#dbc1b3'
  surface-tint: '#984800'
  primary: '#984800'
  on-primary: '#ffffff'
  primary-container: '#f08a42'
  on-primary-container: '#602b00'
  inverse-primary: '#ffb689'
  secondary: '#58605f'
  on-secondary: '#ffffff'
  secondary-container: '#d9e1df'
  on-secondary-container: '#5c6463'
  tertiary: '#48626c'
  on-tertiary: '#ffffff'
  tertiary-container: '#8da8b2'
  on-tertiary-container: '#233d46'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbc8'
  primary-fixed-dim: '#ffb689'
  on-primary-fixed: '#311300'
  on-primary-fixed-variant: '#733500'
  secondary-fixed: '#dce4e2'
  secondary-fixed-dim: '#c0c8c6'
  on-secondary-fixed: '#151d1c'
  on-secondary-fixed-variant: '#404847'
  tertiary-fixed: '#cbe7f2'
  tertiary-fixed-dim: '#afcbd6'
  on-tertiary-fixed: '#021f27'
  on-tertiary-fixed-variant: '#304b53'
  background: '#f9fbed'
  on-background: '#1a1d15'
  surface-variant: '#e2e4d7'
  carbon: '#434942'
  slate: '#6a7167'
  sage: '#c1c5b6'
  surface-vapor: '#e2e4d7'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
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
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system is anchored in the concept of "Measured Trust." It targets a discerning audience that values clarity, security, and a premium shopping experience over loud, aggressive marketing. The visual style is **Modern/Corporate with a Tonal Minimalist twist**, utilizing a sophisticated "off-white" foundation to reduce eye strain and increase the perceived value of products.

The aesthetic avoids the generic "tech-blue" in favor of an organic, earthy palette that feels stable and grounded. Every interface element is designed to evoke a sense of calm and reliability, ensuring that the user feels in control during the entire commerce journey, from discovery to checkout.

## Colors

The palette is dominated by **Vapor** and **Sage**, creating a soft, tactile canvas that differentiates the product from standard white-background competitors. 

- **Primary (Accent Orange):** Reserved strictly for high-priority actions (Add to Cart, Buy Now) and critical status indicators. It should never be used for decorative elements or secondary backgrounds.
- **Surface Strategy:** Use **Vapor** for the global background and **White (#FFFFFF)** for elevated card surfaces to create a crisp, layered effect.
- **Typography Tiers:** **Depth** is used for primary headings to ensure maximum contrast and authority. **Carbon** and **Slate** provide a natural hierarchy for body text and metadata, maintaining a soft, legible gray-scale that isn't jarring against the off-white background.

## Typography

This design system utilizes **Plus Jakarta Sans** for its modern, open apertures and high legibility. It provides a friendly yet professional tone suitable for e-commerce.

- **Headlines:** Use tighter letter spacing and heavier weights to establish a clear focal point.
- **Body Text:** Standard weights (400) ensure readability for product descriptions.
- **Labels:** Used for category tags, prices, and buttons, often employing a slightly heavier weight (500-600) to stand out against the soft background.
- **Hierarchy:** Maintain a clear vertical rhythm. Always prioritize 1.5x line-height for body copy to enhance the "clean" feeling requested.

## Layout & Spacing

The system follows a **Fixed Grid** approach for desktop to maintain a premium "magazine" feel, while transitioning to a fluid model for mobile.

- **Rhythm:** An 8px base grid governs all padding and margins.
- **Whitespace:** Use generous margins (40px+) between major sections to prevent clutter and allow product imagery to breathe.
- **Grid:** A 12-column system is used for desktop. For product listings, 4-column (Desktop) and 2-column (Mobile) layouts are preferred for maximum image clarity.
- **Mobile Reflow:** In mobile views, horizontal padding is reduced to 16px to maximize screen real estate, while vertical spacing remains generous to ensure a comfortable scrolling experience.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** combined with **Ambient Shadows**.

- **Level 0 (Base):** Vapor (#e2e4d7) surface.
- **Level 1 (Cards/Containers):** White (#FFFFFF) background with a soft, diffused shadow (0px 4px 20px rgba(25, 33, 32, 0.05)). This subtle lift differentiates the interactive content from the canvas.
- **Level 2 (Hover/Active):** Slightly deeper shadow (0px 8px 30px rgba(25, 33, 32, 0.08)) to indicate interactivity.
- **Borders:** Use Sage (#c1c5b6) for 1px solid borders on inputs and structural separators. This creates definition without the harshness of high-contrast lines.

## Shapes

The design system utilizes a **Rounded (Level 2)** philosophy to evoke friendliness and modern elegance.

- **Standard Elements:** Buttons and small containers use 0.5rem (8px) corners.
- **Cards & Primary Sections:** Use `rounded-xl` (1.5rem / 24px) to emphasize the soft, modern aesthetic.
- **Search Inputs:** Should utilize `rounded-lg` (1rem / 16px) to stand out as a primary navigation tool.
- **Image Containers:** Must always match the parent card's roundedness for a cohesive, nested look.

## Components

### Buttons
- **Primary:** Background: Accent Orange; Text: White; Shadow: Soft Orange Glow (low opacity). No gradients.
- **Secondary:** Background: Transparent; Border: 1px Sage; Text: Depth.
- **Ghost:** Text: Slate; used for tertiary actions like "Cancel" or "View More."

### Input Fields
- **Default State:** Background: White; Border: 1px Sage; Corner Radius: 8px.
- **Focused State:** Border: 1.5px Current (#76919b); subtle outer glow.
- **Validation:** Use standard semantic colors (Success: Green, Error: Red) but muted to match the overall palette intensity.

### Cards
- **Product Cards:** Solid White background, `rounded-xl` corners, soft ambient shadow. Product titles in **Depth**, prices in **Accent Orange** (bolded).
- **Category Chips:** Background: Sage (20% opacity); Text: Carbon; `rounded-pill`.

### Navigation
- **Header:** Sticky with a slight backdrop blur (Glassmorphism) over the Vapor background. This maintains the "clean" aesthetic while keeping utility accessible.
- **Cart Badge:** Accent Orange with white text, positioned top-right of the cart icon.