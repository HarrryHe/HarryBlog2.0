# Tailwind and Avatar Frame Design

## Scope

Improve the About-page avatar’s mobile frame alignment and introduce Tailwind CSS as a measured styling layer. The existing Quiet Editor visual direction, routes, Markdown system, motion, tokens, and components remain intact.

## Product and design brief

- **Product and audience:** a compact personal developer blog for readers of Harry’s notes.
- **Primary job:** make the blog’s content readable and navigation reliable across viewport sizes.
- **Existing system:** Next.js, React, TypeScript, CSS Modules, semantic CSS custom properties, IBM Plex Sans for prose, and JetBrains Mono Nerd Font for technical details.
- **Mood and density:** restrained, dark editor-like, compact, and editorial rather than dashboard-like.
- **Visual thesis:** Tailwind should make routine layout rules easier to inspect at the component boundary, while existing semantic variables and deliberately authored CSS preserve the blog’s identity.
- **Conventional elements:** semantic HTML, responsive sizes, visible focus states, and reduced-motion behavior remain conventional and accessible.

## Avatar-frame correction

The reusable `AvatarFrame` will own the image’s square geometry and ring placement. At all breakpoints, its layout box will be square, the image will fill it as a circle, and its ring will align to that box instead of relying on an unbounded negative offset. The ring remains decorative (`aria-hidden`) and keeps reduced-motion support.

## Tailwind integration boundary

Install Tailwind CSS v4 for Next.js and expose the current semantic variables as Tailwind theme values. Do not introduce a component library or duplicate the current token system.

Use Tailwind for:

- component layout (`grid`, `flex`, widths, gaps, alignment);
- spacing, responsive variants, typography sizing, and simple borders;
- uncomplicated hover, focus, and transition states.

Retain custom CSS for:

- global resets, semantic tokens, and Markdown/prose rendering;
- animation keyframes and reduced-motion overrides;
- structural typefield/decode effects and page-transition mechanics;
- complex selectors and externally rendered surfaces such as Giscus.

## Component boundaries

- `AvatarFrame` remains the only reusable owner of avatar image/ring geometry.
- Each presentational component can combine Tailwind utilities for routine static layout with a small CSS Module only when behavior or visual geometry needs a named selector.
- Global classes (`page-shell`, `prose`, `article-grid`) remain stable during this pass to avoid reworking every content route unnecessarily.

## Responsive and accessibility requirements

- The About avatar becomes a compact, centered visual object in the one-column mobile layout and never exceeds its allocated box.
- Existing desktop sticky behavior remains unchanged.
- No layout or motion change may hide content, alter keyboard navigation, or weaken `prefers-reduced-motion` handling.
- Build output should not require browser binaries or a visual-test runner.

## Verification

1. Add a failing unit assertion for the avatar’s explicit geometry contract before the component/CSS change.
2. Run the focused avatar test during red/green development.
3. Run the full unit suite, typecheck, lint, and production build.
4. Inspect the generated classes and CSS boundaries to ensure no duplicate visual system or unused migration scaffolding is introduced.

## Out of scope

- Redesigning the Quiet Editor visual direction.
- Converting all CSS Modules or global prose styles in a single pass.
- Adding Tailwind UI, shadcn, or another component library.
- Browser-based Playwright checks or downloading browser binaries.
