# CSS Design System

Production-style architecture for scalability and separation of concerns.

## Structure

```
css/
├── tokens/           # Design tokens – single source of truth
│   ├── index.css     # Re-exports all token files
│   ├── colors.css    # Palette, surfaces, borders
│   ├── spacing.css   # Space scale, rhythm, section padding
│   ├── typography.css# Fonts, sizes, line-heights
│   ├── shadows.css   # Shadows, radius, glow
│   ├── motion.css    # Transitions, ease, layout tokens
│   └── semantic.css  # Status colors, semantic mappings
├── base/             # Reset and layout primitives
│   ├── reset.css     # Box-sizing, body, elements
│   └── layout.css    # Container, focus, skip-link
├── layouts/          # Page structure
│   ├── section.css   # .section, .section--centered
│   ├── footer.css    # Site footer
│   └── navbar.css    # Navigation
├── components/       # One file per component (BEM)
│   ├── blueprint.css
│   ├── section-header.css
│   ├── buttons.css
│   ├── inputs.css
│   ├── cards.css
│   ├── status-badges.css
│   ├── hero.css
│   ├── service-card.css
│   ├── how-timeline.css
│   ├── benefit-stat.css
│   ├── contact-form.css
│   ├── form-message.css
│   └── utilities.css
├── pages/            # Page composition and modifiers
│   ├── home.css
│   ├── dashboard.css
│   └── inquiry-detail.css
├── responsive.css    # Breakpoint overrides (dashboard, inquiry, navbar)
└── README.md         # This file
```

## Import Order

1. **Tokens** – no dependencies
2. **Base** – uses tokens
3. **Layouts** – uses tokens
4. **Components** – uses tokens, layouts
5. **Utilities** – utility classes
6. **Pages** – section modifiers, page-specific responsive
7. **Responsive** – cross-cutting breakpoint overrides

## Conventions

- **Tokens**: Use `var(--token-name)`; no raw values in components
- **Components**: One file per BEM block; include own responsive when scoped
- **Pages**: Section modifiers (`.section--services`), overlays, page-level media queries
- **No visual changes** when refactoring; preserve cascade and specificity
