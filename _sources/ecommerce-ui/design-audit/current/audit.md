# Mizan.az authentication design audit

## Scope

Current login and registration experience at desktop 1440 × 1024 and mobile 390 × 844. The user goal is to create one account or sign in confidently, then continue to the buyer or seller workspace.

## Evidence

1. `01-login.png` — desktop login: functional but visually split between a large decorative story area and a comparatively quiet task area.
2. `02-register.png` — desktop registration: all required fields are visible, but the two-column form increases scanning effort and the visual panel competes with completion.
3. `03-login-mobile.png` — mobile login: responsive state.
4. `04-register-mobile.png` — mobile registration: responsive state.

## Strengths

- Persistent field labels, semantic form controls, keyboard-focus treatment, password visibility controls, and explicit primary actions are present.
- The palette is coherent and the login/register routes share recognizable brand elements.
- Authentication supports username, email, or telephone without multiplying login screens.

## High-impact risks

1. The form task lacks a strong visible top-level heading on login because the actual `h1` is visually hidden. The large marketing headline dominates instead.
2. The registration form uses two columns although this is a linear identity task. Eye movement is irregular and the field order is harder to understand.
3. Almost every typographic element is heavy. This removes hierarchy and makes the interface feel promotional rather than calm and trustworthy.
4. The large dark panels provide little decision support. They consume space without explaining the one-account, buyer/seller workspace model.
5. The desktop login has excessive unused vertical space while the registration screen feels crowded. The two routes do not feel like one polished system.
6. Supporting links and footer copy are visually weak, while important privacy reassurance is generic and unverified.
7. Registration does not explain password expectations before validation or visually group personal and contact information.

## Accessibility limits and risks

- Screenshots confirm visible labels and target presence, but do not prove screen-reader announcements or full keyboard order.
- Current contrast appears strong for primary text; smaller Sage/Slate copy requires automated contrast verification.
- Mobile screenshots are needed to confirm reflow and minimum 44 px controls; browser interaction testing remains required after implementation.

## Redesign priorities

- Make the authentication task, not decorative branding, the primary hierarchy.
- Use a calm single-column registration journey with clear information groups.
- Build one reusable authentication shell and consistent type scale.
- Use palette colors as hierarchy tokens: Depth for primary actions, Vapor/Paper for surfaces, Current only for focus and selected states.
- Add concise, honest reassurance about account use and the no-platform-payment marketplace model.
