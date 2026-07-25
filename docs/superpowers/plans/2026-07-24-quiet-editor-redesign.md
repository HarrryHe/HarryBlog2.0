# Quiet Editor Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the existing personal blog as a compact, Vitesse Dark-inspired, editor-oriented reading experience without changing routes, content loading, GitHub activity, Giscus, or the static-export architecture.

**Architecture:** Keep the existing App Router pages and component tree. Concentrate the redesign in semantic CSS tokens, shell and home presentation components, and a small client route-transition wrapper; no API, Markdown, Giscus, calendar, RSS, sitemap, or data-model changes are required. Use the existing `motion` dependency for only the hero reveal, SVG stroke drawing, and route-entry treatment.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, Motion, Vitest, Testing Library, ESLint, Prettier.

## Global Constraints

- Preserve all current routes, static export behavior, Markdown/MDX parsing, GitHub calendar, Giscus settings, RSS, sitemap, metadata, and public assets.
- Do not rebuild or change the project architecture, introduce new runtime dependencies, add 3D, add dashboard/HUD/telemetry visuals, or add browser binaries.
- Use a Vitesse Dark-inspired semantic palette: near-black page surface, warm off-white text, muted gray-green text, restrained green/blue/lavender/warm accents.
- Keep JetBrains Mono Nerd Font for technical labels, metadata, navigation, code, and small controls; keep IBM Plex Sans for prose.
- Use one shared compact content width for pages and articles: `--content-width: 60rem` and `--reading-width: 60rem`; use desktop outer gutters of at least `clamp(2rem, 7vw, 7rem)`.
- Keep identity copy to a name/handle, one short description, and the existing `self.learning()` line. Do not add role stacks or new job-title copy.
- Kito is circular wherever it appears.
- Add one compact, sample-only programming-language strip on About for C, C++, Java, Python, and TypeScript. Its thin bars are visual skill indicators only: no percentages, no proficiency adjectives, no dashboard framing, and no generic loading/progress bar elsewhere.
- Respect `prefers-reduced-motion`, retain visible keyboard focus, and keep mobile navigation usable by keyboard and touch.
- Browser-based verification remains out of scope; do not install Playwright-managed Chromium, Firefox, WebKit, or any other browser binary.
- The workspace has no valid Git repository, so omit commit commands while executing this plan.

---

## File Structure

| File                                                 | Responsibility                                                                                                           |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `src/app/globals.css`                                | Vitesse-inspired tokens, unified page/article width, compact global spacing, prose rhythm, and reduced-motion fallbacks. |
| `src/app/template.tsx`                               | A client route-entry wrapper that applies a short, reduced-motion-aware transition to route content.                     |
| `src/app/template.test.tsx`                          | Confirms the route-transition wrapper retains route content and exposes its transition container.                        |
| `src/components/shell/SiteHeader.tsx`                | Adds route-aware `aria-current` semantics to internal navigation.                                                        |
| `src/components/shell/SiteHeader.test.tsx`           | Covers the active navigation state alongside existing mobile-menu behavior.                                              |
| `src/components/shell/SiteHeader.module.css`         | Compact header, fine active/hover rule, and less panel-like mobile menu.                                                 |
| `src/components/shell/SiteFooter.module.css`         | Reduces footer density and visual weight without changing footer links.                                                  |
| `src/components/home/Hero.tsx`                       | Collapses identity into a compact avatar/name/description/typewriter composition.                                        |
| `src/components/home/Hero.test.tsx`                  | Verifies one identity heading, circular-avatar class hook, and decorative simplified SVG.                                |
| `src/components/home/Hero.module.css`                | Defines the compact horizontal identity composition and responsive stacking.                                             |
| `src/components/home/StructuralTypefield.tsx`        | Retains the wordmark reveal and two animated trace paths; removes ghosts, arcs, dashed paths, and nodes.                 |
| `src/components/home/StructuralTypefield.module.css` | Removes the grid, uses thicker restrained traces, and provides interaction-only pointer movement.                        |
| `src/components/home/LatestPosts.tsx`                | Replaces decorative numeric label/copy with concise content-oriented labels.                                             |
| `src/components/home/LatestPosts.module.css`         | Makes the latest-notes block dense and editorial.                                                                        |
| `src/components/home/GitHubActivity.module.css`      | Makes the contribution calendar a quiet content section rather than a panel.                                             |
| `src/app/about/page.tsx`                             | Keeps About markup semantic while removing nonessential portrait label copy.                                             |
| `src/app/about/page.module.css`                      | Makes the sticky Kito portrait circular and integrates it with the shared content shell.                                 |
| `src/components/about/TechnicalSkills.tsx`           | Renders the fixed sample programming-language list and accessible text labels.                                           |
| `src/components/about/TechnicalSkills.module.css`    | Styles the language-only pseudo-bars as compact editorial marks.                                                         |
| `src/components/about/TechnicalSkills.test.tsx`      | Confirms every sample language remains available as text, not color-only information.                                    |
| `src/content/about.md`                               | Reduces About to a concise personal introduction and one learning principle.                                             |
| `src/components/blog/ArchiveOverview.tsx`            | Reduces archive label/empty-state copy while retaining legacy `/posts` behavior.                                         |
| `src/components/blog/ArchiveOverview.module.css`     | Compacts archive grouping and spacing.                                                                                   |
| `src/components/blog/PostRow.module.css`             | Densifies post list rows and makes hover feedback a restrained editorial cue.                                            |
| `src/components/blog/PostHeader.module.css`          | Reduces post-header scale and aligns it to the unified shared content width.                                             |
| `src/components/blog/PostNavigation.module.css`      | Compacts adjacent-post navigation.                                                                                       |
| `src/components/blog/TableOfContents.module.css`     | Keeps TOC quiet and secondary to the article.                                                                            |
| `src/components/blog/GiscusComments.module.css`      | Keeps comments visually subordinate and aligned to the shared width.                                                     |

## Tasks

### Task 1: Establish the shared Quiet Editor system and route transition

**Files:**

- Create: `src/app/template.tsx`
- Create: `src/app/template.test.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**

- Consumes: App Router `children: React.ReactNode` and the existing `motion/react` dependency.
- Produces: A route-level transition wrapper with `data-page-transition`, plus shared CSS variables consumed by every page and component stylesheet.

- [ ] **Step 1: Write the failing transition test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Template from "./template";

describe("Template", () => {
  it("keeps route content inside the transition boundary", () => {
    const { container } = render(
      <Template>
        <h1>Archive</h1>
      </Template>
    );

    expect(screen.getByRole("heading", { name: "Archive" })).toBeVisible();
    expect(container.querySelector("[data-page-transition]")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the new test and confirm it fails**

Run: `npm test -- --run src/app/template.test.tsx`

Expected: FAIL because `src/app/template.tsx` does not yet exist.

- [ ] **Step 3: Add the smallest route-entry wrapper**

Create a client template that uses `useReducedMotion()` and `m.div`. Set `data-page-transition`, use `initial={{ opacity: 0, y: 4 }}` and `animate={{ opacity: 1, y: 0 }}` for normal motion, and disable the initial animation when reduced motion is requested. Use a 180ms ease-out transition. Do not animate page exit, scrolling, layout height, or route content independently.

- [ ] **Step 4: Replace global visual tokens and sizing**

In `src/app/globals.css`:

```css
:root {
  --background: #121212;
  --surface: #181818;
  --surface-raised: #202020;
  --text-strong: #dbd7ca;
  --text: #c9c5ba;
  --text-muted: #9ca39a;
  --text-dim: #6d756d;
  --border-subtle: #2b2b2b;
  --border-strong: #3a3a3a;
  --accent-primary: #4d9375;
  --accent-secondary: #6394bf;
  --accent-lavender: #a8b1ff;
  --accent-warm: #e6cc77;
  --content-width: 60rem;
  --reading-width: 60rem;
}

.page-shell,
.article-grid,
.header {
  width: min(100% - clamp(2.5rem, 14vw, 14rem), var(--content-width));
}
```

Remove the `body` radial gradient and the obsolete `--grid-line` token. Replace oversized page/title and 8rem-scale paddings with 2.25–4.5rem responsive ranges. Make `.article-grid` a single shared-width column with an optional TOC column only at wide breakpoints; set `.prose` to the same `var(--reading-width)` width rather than a narrow 46rem column. Preserve current code, table, blockquote, focus, forced-colors, and reduced-motion behavior while tightening prose heading and block margins.

- [ ] **Step 5: Run focused and static checks**

Run:

```bash
npm test -- --run src/app/template.test.tsx
npm run typecheck
npm run lint
```

Expected: The template test passes; TypeScript and ESLint return exit code 0.

### Task 2: Compact shell navigation and footer

**Files:**

- Modify: `src/components/shell/SiteHeader.tsx`
- Modify: `src/components/shell/SiteHeader.test.tsx`
- Modify: `src/components/shell/SiteHeader.module.css`
- Modify: `src/components/shell/SiteFooter.module.css`

**Interfaces:**

- Consumes: `siteConfig.navigation` and `next/navigation`’s `usePathname()`.
- Produces: Internal links with `aria-current="page"` on the active route; external GitHub behavior remains unchanged.

- [ ] **Step 1: Extend the header test before implementation**

Mock the pathname at the top of `SiteHeader.test.tsx` and add this assertion:

```tsx
vi.mock("next/navigation", () => ({
  usePathname: () => "/archive"
}));

it("marks the current internal route for assistive technology", () => {
  render(<SiteHeader />);

  expect(screen.getByRole("link", { name: "Archive" })).toHaveAttribute(
    "aria-current",
    "page"
  );
  expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
});
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `npm test -- --run src/components/shell/SiteHeader.test.tsx`

Expected: FAIL because internal links do not yet receive `aria-current`.

- [ ] **Step 3: Make active navigation semantic and compact**

Read `const pathname = usePathname()` in `SiteHeader`. For internal links, pass `aria-current={pathname === item.href ? "page" : undefined}`. Keep the existing external GitHub link unchanged.

In the header CSS, reduce desktop height to 3.75rem, reduce link gap and font size slightly, remove `backdrop-filter`, and use a 2px bottom rule for hover/focus/active state. The rule is a selection indicator, not a progress bar. On mobile, retain the button and Escape behavior but use a simple opaque surface with compact 3rem link rows.

In the footer CSS, reduce the top margin and padding, lower the motto/link density, and retain all social links and external-link semantics.

- [ ] **Step 4: Run the header test and static checks**

Run:

```bash
npm test -- --run src/components/shell/SiteHeader.test.tsx
npm run typecheck
npm run lint
```

Expected: All commands return exit code 0.

### Task 3: Recompose the hero around one compact identity line

**Files:**

- Modify: `src/components/home/Hero.tsx`
- Modify: `src/components/home/Hero.test.tsx`
- Modify: `src/components/home/Hero.module.css`
- Modify: `src/components/home/StructuralTypefield.tsx`
- Modify: `src/components/home/StructuralTypefield.module.css`

**Interfaces:**

- Consumes: Existing Kito asset, `TypewriterLine`, and Motion’s `LazyMotion`, `m`, and `useReducedMotion`.
- Produces: One `h1` named `HARRY//HE`, a circular Kito avatar, two aria-hidden structural paths, and no decorative geometry nodes.

- [ ] **Step 1: Strengthen the hero test**

Add to `Hero.test.tsx`:

```tsx
expect(screen.getAllByText(/Software developer/i)).toHaveLength(0);
expect(container.querySelector(".Hero-module__portrait")).toBeInTheDocument();
expect(container.querySelectorAll("[data-structural-geometry] path")).toHaveLength(2);
expect(container.querySelectorAll("[data-structural-geometry] circle")).toHaveLength(0);
```

Use the generated CSS-module class selector only if it is stable in the test environment; otherwise add `data-kito-avatar` to the `Image` and assert that attribute instead.

- [ ] **Step 2: Run the hero test and confirm it fails**

Run: `npm test -- --run src/components/home/Hero.test.tsx`

Expected: FAIL because the current hero includes “Software developer” and SVG circles.

- [ ] **Step 3: Simplify hero markup**

Replace the current eyebrow with one concise `Jiacheng He / HarrryHe` identity line. Keep the existing lede as the only descriptive sentence and retain `self.learning()`.

Place the circular avatar, wordmark, and identity copy in the same compact hero composition. Do not add a second job title, role label, metric, skill bar, build bar, or status copy. Add `data-kito-avatar` to the Kito image for the stable test hook.

- [ ] **Step 4: Simplify structural animation and CSS**

Keep only two SVG `m.path` elements. Remove both ghost wordmarks, the `crop::before` grid, arc path, secondary dashed path, all circles, and `node-drift` keyframes. Use 1.5–2px non-scaling strokes with a muted blue main trace and low-contrast green secondary trace.

Retain initial clip reveal and path drawing. Pointer movement on fine pointers may translate the SVG and wordmark by at most 3px; after the entrance completes, idle state is static. On touch and reduced motion, retain the final static composition and do not animate pointer transforms.

Set the desktop hero to a 13–16rem visual field. Make the Kito image circular with a simple border; remove the offset square frame and shadow. Stack the composition on narrow screens, preserving the heading before descriptive copy.

- [ ] **Step 5: Run focused checks**

Run:

```bash
npm test -- --run src/components/home/Hero.test.tsx src/components/home/TypewriterLine.test.tsx
npm run typecheck
npm run lint
```

Expected: Hero and typewriter behavior pass, with no TypeScript or lint errors.

### Task 4: Make Home sections dense, content-led, and quiet

**Files:**

- Modify: `src/components/home/LatestPosts.tsx`
- Modify: `src/components/home/LatestPosts.module.css`
- Modify: `src/components/home/GitHubActivity.module.css`
- Modify: `src/components/blog/PostRow.module.css`
- Modify: `src/components/home/GitHubActivity.test.tsx`

**Interfaces:**

- Consumes: Existing `PostSummary[]`, `PostRow`, and `GitHubActivity` lazy calendar behavior.
- Produces: The same archive/profile links and lazy calendar loading, with no dashboard framing or generic progress decoration.

- [ ] **Step 1: Update the home-component tests before copy changes**

In `GitHubActivity.test.tsx`, retain the direct-profile assertion and add:

```tsx
expect(screen.getByRole("heading", { name: "GitHub activity" })).toBeInTheDocument();
expect(screen.queryByText(/Work, made visible/i)).not.toBeInTheDocument();
```

Create `src/components/home/LatestPosts.test.tsx` with this empty-state test:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LatestPosts } from "./LatestPosts";

describe("LatestPosts", () => {
  it("uses a compact empty state without decorative counters", () => {
    render(<LatestPosts posts={[]} />);

    expect(screen.getByRole("heading", { name: "Latest notes" })).toBeVisible();
    expect(screen.queryByText("[000]")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the focused home tests and confirm they fail**

Run: `npm test -- --run src/components/home/GitHubActivity.test.tsx src/components/home/LatestPosts.test.tsx`

Expected: FAIL because the current headings/counters are still present.

- [ ] **Step 3: Change only decorative copy and presentation**

Change the latest section heading to `Latest notes`; remove `01 / WRITING` and `[000]`; retain the archive link and its destination. Replace empty-state prose with `No published notes yet.`

Change the GitHub heading to `GitHub activity`; remove `02 / ACTIVITY` and `Work, made visible.`; retain the direct profile link and lazy-loading fallback.

Set both sections to the shared content width, 3–4rem maximum section spacing, one hairline top rule, and no filled card background. Make the calendar frame a simple overflow container with a border-top/bottom rule only. Tighten `PostRow` vertical padding, title size, and metadata while keeping its date, reading-time, tag, and link semantics intact.

- [ ] **Step 4: Run focused checks**

Run:

```bash
npm test -- --run src/components/home/GitHubActivity.test.tsx src/components/home/LatestPosts.test.tsx
npm run typecheck
npm run lint
```

Expected: Both home tests and static checks pass.

### Task 5: Align About, Archive, posts, TOC, navigation, and Giscus to one reading shell

**Files:**

- Modify: `src/app/about/page.tsx`
- Modify: `src/app/about/page.module.css`
- Create: `src/components/about/TechnicalSkills.tsx`
- Create: `src/components/about/TechnicalSkills.module.css`
- Create: `src/components/about/TechnicalSkills.test.tsx`
- Modify: `src/content/about.md`
- Modify: `src/components/blog/ArchiveOverview.tsx`
- Modify: `src/components/blog/ArchiveOverview.module.css`
- Modify: `src/components/blog/PostHeader.module.css`
- Modify: `src/components/blog/PostNavigation.module.css`
- Modify: `src/components/blog/TableOfContents.module.css`
- Modify: `src/components/blog/GiscusComments.module.css`
- Modify: `src/components/blog/GiscusComments.test.tsx`

**Interfaces:**

- Consumes: Existing About Markdown source, `ArchiveYear[]`, `PostDocument`, TOC headings, and Giscus repository configuration.
- Produces: Identical page semantics and integrations in a compact shared-width reading composition, plus a small sample language list on About.

- [ ] **Step 1: Write the sample-language component test**

Create `src/components/about/TechnicalSkills.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TechnicalSkills } from "./TechnicalSkills";

describe("TechnicalSkills", () => {
  it("exposes every sample programming language as text", () => {
    render(<TechnicalSkills />);

    expect(screen.getByRole("heading", { name: "Programming languages" })).toBeVisible();
    for (const language of ["C", "C++", "Java", "Python", "TypeScript"]) {
      expect(screen.getByText(language)).toBeVisible();
    }
  });
});
```

- [ ] **Step 2: Run the new test and confirm it fails**

Run: `npm test -- --run src/components/about/TechnicalSkills.test.tsx`

Expected: FAIL because the component does not yet exist.

- [ ] **Step 3: Add the contained About skills strip and shorten About copy**

Create `TechnicalSkills` with a fixed internal data array:

```ts
const skills = [
  { label: "C", fill: "82%" },
  { label: "C++", fill: "76%" },
  { label: "Java", fill: "72%" },
  { label: "Python", fill: "86%" },
  { label: "TypeScript", fill: "79%" }
] as const;
```

Render a semantic `section` with an `h2` of `Programming languages` and a list. Every list item must contain visible language text plus a decorative `aria-hidden="true"` fill span; do not expose percentages, proficiency labels, status labels, gauges, or animation. CSS should use thin 2px rules, restrained Vitesse green/blue/lavender fills, and no rounded card or panel container.

Render `<TechnicalSkills />` after the About Markdown article. Shorten `src/content/about.md` to exactly these three paragraphs:

```md
I am Jiacheng—usually Harry—a software developer who enjoys turning ideas into working systems and learning through the details along the way.

This blog is where I write down technical notes, project lessons, experiments, and ideas that are still becoming clear.

`self.learning()` is a working principle: each project should leave behind a sharper tool, a clearer explanation, or a better question.
```

In About presentation CSS, remove the `JIA.CHENG / HARRY / HE` portrait caption; retain the Kito `alt` text. Use a circular portrait with a quiet border and no square shadow. On desktop, keep the portrait adjacent to prose only while it fits within the 60rem shared shell; on smaller widths, flow it above prose. Give the skills strip the same shared reading width and a modest top rule.

- [ ] **Step 4: Preserve Giscus regression coverage**

Keep the preserved repository and direct Discussions fallback assertions. Add this assertion to ensure the visible heading remains content-oriented:

```tsx
expect(screen.getByRole("heading", { name: "Comments" })).toBeVisible();
expect(screen.getByRole("link", { name: /open discussions/i })).toBeVisible();
```

- [ ] **Step 5: Run focused component tests**

Run:

```bash
npm test -- --run src/components/about/TechnicalSkills.test.tsx src/components/blog/GiscusComments.test.tsx
```

Expected: The skills component test and Giscus integration test pass.

- [ ] **Step 6: Apply shared-width, compact editorial styling to archive and posts**

In Archive, reduce `ARCHIVE / ALL NOTES` to `Archive`, reduce the title to `All notes`, and use a short empty state: `No published notes yet.` Preserve legacy `/posts` copy and canonical link behavior.

For post CSS, set the post header, article grid, article body, previous/next navigation, TOC, and Giscus section to `var(--reading-width)` inside the same outer gutter. Do not retain a separate narrow 46rem prose column. Reduce post header title sizing to a 2.2–3.75rem range and tighten header/article spacing. Keep the desktop TOC as a slim, unobtrusive left offset only when there is enough horizontal room; otherwise preserve the existing details/summary fallback. Do not add cards, visual meters, or page-specific decoration.

- [ ] **Step 7: Run integration-preservation checks**

Run:

```bash
npm test -- --run src/components/blog/GiscusComments.test.tsx src/lib/content/posts.test.ts src/lib/content/headings.test.ts
npm run typecheck
npm run lint
```

Expected: Markdown parsing, heading extraction, and Giscus configuration continue to pass.

### Task 6: Format and statically verify the finished redesign

**Files:**

- Modify: Files changed by Tasks 1–5 only.
- Verify: `out/` generated by `next build`; do not manually edit generated files.

**Interfaces:**

- Consumes: The completed visual redesign.
- Produces: A formatted static export that retains all expected routes and integrations.

- [ ] **Step 1: Format changed source files**

Run: `npm run format`

Expected: Prettier formats only project files according to `prettier.config.mjs`.

- [ ] **Step 2: Run the full static verification suite**

Run:

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

Expected: format, lint, typecheck, and unit tests exit 0; `next build` exports `/`, `/about`, `/archive`, `/posts`, `/_not-found`, `/robots.txt`, `/rss.xml`, `/sitemap.xml`, and `/manifest.webmanifest`.

- [ ] **Step 3: Inspect static-export invariants without browser tooling**

Run:

```bash
rg -o 'rel="canonical" href="[^"]+"' out/about.html out/archive.html out/posts.html
rg -o '<main id="main-content"[^>]*>' out/index.html
rg -n 'HarrryHe/HarryBlog2.0|HarrryHe' src/config/site.ts src/components/blog/GiscusComments.tsx src/components/home/GitHubActivity.tsx
```

Expected: About and Archive point to their own canonicals, `/posts` canonicals to `/archive`, `main` remains programmatically focusable with `tabindex="-1"`, and preserved GitHub/Giscus identifiers remain present.

## Plan Self-Review

- **Coverage:** Tasks 1–5 implement the approved compact layout, Vitesse-inspired semantic palette, smaller hero, circular Kito, simplified structural motion, reduced decorative copy, unified article/page reading shell, restrained interactions, and preserved integrations. Task 6 validates the completed static site.
- **Progress-bar constraint:** Only Task 5 adds pseudo-bars, and only for the approved sample programming-language list. It adds no visible percentages, proficiency language, loading state, metric, or dashboard UI.
- **Architecture:** No task changes content parsing, data contracts, routes, static export, public URLs, Giscus identifiers, GitHub username, or dependencies.
- **Accessibility/performance:** The plan preserves semantic landmarks, `aria-current`, direct fallbacks, keyboard menu behavior, forced-colors styles, and reduced-motion equivalents. It uses existing Motion and CSS transforms only.
- **Verification scope:** Browser and Playwright verification are intentionally excluded; no managed browser binary will be installed.
