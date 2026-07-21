# Mizan.az frontend design QA

## Comparison target

- Source visual truth: `design-reference/selected-option-2.png`
- Final implementation: `design-qa-v2/login-docker-final.png`
- Full-view comparison: `design-qa-v2/login-docker-comparison-final.png`
- Focused form comparison: `design-qa-v2/login-docker-form-comparison-final.png`
- Viewport: 1440 × 1024
- State: unauthenticated login, light theme, default form state
- Runtime: final Docker image at `http://localhost:3001/login`

## Findings

No actionable P0, P1, or P2 findings remain.

- [P3] Hero asset is a purpose-built sibling of the mockup image rather than a pixel-identical crop.
  - Location: authentication editorial media.
  - Evidence: both show the same artisan still-life, warm paper background, olive branch, wood and dark ceramics; individual object positions differ slightly.
  - Impact: art direction and visual balance are preserved without affecting use.
  - Decision: accepted. The production asset is sharp, correctly cropped and has explicit dimensions.

- [P3] Navigation copy follows real product routes.
  - Location: guest header.
  - Evidence: the source uses generic “Mağazalar / Kateqoriyalar / Haqqımızda / Yardım”; the implementation uses live routes “Məhsullar / Satıcı olun / Kömək”.
  - Impact: slightly different wording, but no dead or invented destinations.
  - Decision: intentional product constraint.

- [P3] Seller approval information is more explicit than the source.
  - Location: login form introduction.
  - Evidence: implementation adds a compact “Satıcı olmaq istəyirsiniz?” row and admin-approval note.
  - Impact: adds one divider and increases form-region height slightly.
  - Decision: intentional because admin approval is a material platform rule.

## Required fidelity surfaces

- Fonts and typography: final Helvetica Neue/system stack is close to the calm sans-serif source. Display weight, body size, line height and form-label hierarchy are consistent. No clipping or unwanted truncation was observed.
- Spacing and layout: full-width 37/63 split, 92 px header, form width, image crop, footer position, dividers, button height and white-space rhythm track the source. Mobile switches to a task-first single column.
- Colors and tokens: Vapor, Sage, Current, Slate, Carbon and Depth map to the supplied palette. No gradients, glass surfaces or decorative glow remain. Small accent text uses `#516B76` for 5.40:1 contrast on Paper.
- Image quality: the still-life is a real raster asset generated for the measured slot, 1052 × 1536 with a 390 KB optimized JPEG. It has no text, logo, watermark or visible generation defect.
- Copy and content: Azerbaijani login/register copy is coherent and reflects one account, buyer/seller workspaces, admin-approved shops and no platform payments.
- Icons: consistent library icons are aligned inside 44–54 px controls. No custom CSS/SVG art or emoji substitutes are used.
- States and interactions: login, registration validation, password reveal, mobile menu, catalog navigation, product detail, inquiry success, seller panel and admin route were exercised.
- Accessibility: persistent labels, semantic headings/regions, visible focus outline, 44 px minimum targets, reduced-motion rules, responsive reflow and no horizontal mobile overflow were confirmed.

## Responsive evidence

- Login mobile: `design-qa-v2/login-mobile.png`
- Register desktop: `design-qa-v2/register-desktop.png`
- Register mobile full flow: `design-qa-v2/register-mobile-full.png`
- Marketplace mobile: `design-qa-v2/marketplace-mobile.png`
- Mobile navigation open: `design-qa-v2/mobile-menu-open.png`
- Product detail mobile: `design-qa-v2/product-detail-mobile.png`
- Seller mobile: `design-qa-v2/seller-mobile.png`

At 390 × 844, document width and viewport width were both 390 px. No horizontal overflow was present.

## Product-flow evidence

- Workspace: `design-qa-v2/workspace-desktop.png`
- Marketplace: `design-qa-v2/marketplace-desktop.png`
- Product detail: `design-qa-v2/product-detail-desktop.png`
- Seller dashboard: `design-qa-v2/seller-desktop.png`
- Seller product form: `design-qa-v2/seller-product-form.png`
- Admin review: `design-qa-v2/admin-desktop.png`

Verified interactions:

1. Admin login completed and opened the workspace chooser.
2. Catalog product opened its detail route.
3. Inquiry form submitted successfully with a WhatsApp preference.
4. QA seller account opened an active seller dashboard and displayed products and inquiries.
5. Mobile menu opened and exposed the available navigation routes.
6. Browser error overlay and page-error logs were empty.

## Performance snapshot

Final Docker login route:

- LCP: 60 ms
- FCP: 44 ms
- TTFB: 0.8 ms
- CLS: 0.00
- INP: unavailable because the short measurement did not contain a representative interaction

## Comparison history

### Pass 1

- Evidence: `design-qa-v2/login-desktop-pass1.png`
- P2: inherited container alignment prevented the header and split layout from using the full viewport.
- P2: login retained an extra media caption absent from the selected target.

Fixes:

- reset the auth layout to full-width stretch alignment;
- expanded the search control to match the reference header;
- removed the login media caption.

### Pass 2

- Evidence: `design-qa-v2/login-comparison-pass2.png`
- P2: Avenir’s heavy optical weight made headings and controls visibly denser than the source.
- P2: Current `#76919B` was used for small text at only 3.19:1 contrast.

Fixes:

- changed the product typography to a calmer Helvetica Neue/system stack and normalized display weights;
- added Current Ink `#516B76` for small accent copy at 5.40:1 contrast;
- added explicit image dimensions and corrected the mobile menu’s dynamic accessible label.

### Final pass

- Evidence: `design-qa-v2/login-docker-comparison-final.png` and `design-qa-v2/login-docker-form-comparison-final.png`
- The selected composition, typography hierarchy, palette, image treatment and form rhythm are materially preserved.
- No actionable P0/P1/P2 differences remain.

## Follow-up polish

- Optional P3: replace the generated still-life only if a future brand photoshoot supplies an approved original image with the same crop and tonal balance.

final result: passed
