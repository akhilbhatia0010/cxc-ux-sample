## General

- Keep the app static and front-end only. Do not introduce backend assumptions unless explicitly requested.
- Prefer a clean feature-oriented structure: shared primitives, mock data, and types should live outside the main app shell.
- Remove generated or unused files once they are no longer part of the running app.
- Keep files reasonably small. Split large files when shared concerns become reusable.

## EPS Product Direction

- Treat the project as a working web app, not a screen gallery or design presentation.
- The left sidebar is app navigation. The content area should show one meaningful screen state at a time.
- When a module has multiple prompt screens, expose them as clickable in-app states or tabs.
- Preserve the mega prompt module coverage across M2, M3, and M4, even when some modules are lighter than others.

## Theme

- Follow `cxc.org` as the primary visual reference.
- Prefer a deep indigo/purple-blue primary, bright cyan highlights, coral CTA buttons, white surfaces, and restrained neutrals.
- Avoid heavy gradients, generic SaaS visuals, and presentation-style hero banners unless the prompt explicitly calls for them.
- Headings should feel authoritative and editorial rather than playful.

## Layout

- Use responsive flexbox and grid by default.
- Keep cards, tables, forms, and sidebars clean and spacious.
- Avoid showing multiple full prompt screens at once when they should behave like separate app states.
- Right-side detail views can be rendered inline if that keeps the static app simpler, but the interaction should still feel screen-based.

## Interaction

- Important actions should be clickable and update visible state.
- Use clear selected states for navigation, screen tabs, and active records.
- Typed confirmation, disabled actions, and status pills should remain in flows where the mega prompt calls for governance or auditability.
