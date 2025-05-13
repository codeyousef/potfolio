# Aethelframe Protocol: Emergence - Implementation Plan (Next.js & Directus)

**Objective:** Implement "Aethelframe Protocol" portfolio per `docs/Portfolio.md`, focusing on "Emergence" narrative.
**Guiding Design Document:** `docs/Portfolio.md`
**Tech Stack:**
*   Frontend: Next.js (TypeScript), React, Tailwind CSS, Framer Motion, Bun
*   Backend: Directus, Bun
*   Database: PostgreSQL
*   Environment: Docker

---

## Phase 0: Project & Environment Setup

*   **Task 0.1:** Verify Docker setup (`Dockerfile`, `docker-compose.yml`, `start-services.sh`).
*   **Task 0.2:** Configure Tailwind CSS (`frontend/tailwind.config.ts`): theme values (colors, fonts from `Portfolio.md`).
*   **Task 0.3:** Global styles (`frontend/app/globals.css`): font imports, base body styles, SVG noise/grain effect.
*   **Task 0.4:** Main Next.js layout (`frontend/app/layout.tsx`): metadata, fonts, global styles wrapper.
*   **Task 0.5 (Optional):** Basic Directus collections (e.g., "Projects") for parallel backend work.

---

## Phase 1: The Overture (Seed/Veil) - Frontend

*   **Task 1.1:** `Overture` React component (`frontend/components/sections/Overture.tsx`): JSX for "Monolith Entry," title, `[ BEGIN ]` prompt.
*   **Task 1.2:** Style `Overture` with Tailwind: colors, typography (Montserrat for title, Roboto Mono for prompt), title animation, prompt hover/focus effects (glow, expansion).
*   **Task 1.3:** `Overture` client-side logic: manage visibility state, handle `[ BEGIN ]` click for site shell transition.

---

## Phase 2: The Unfurling (Transitions & Initial Site Structure) - Frontend

*   **Task 2.1:** `SiteShell` component (`frontend/components/core/SiteShell.tsx`): manages "Kinetic Canvases" display. Integrate with `Overture` in `frontend/app/page.tsx`.
*   **Task 2.2:** `CuratorLensNav` component (`frontend/components/navigation/CuratorLensNav.tsx`): JSX for navigator icon & menu. Style with Tailwind (bottom-left, icon, menu hidden initially).
*   **Task 2.3:** Overture to Site Shell Transition: Use Framer Motion for "breakthrough" animation.
*   **Task 2.4:** `CuratorLensNav` Logic: Toggle menu (icon animation '+' to 'X'), Framer Motion for staggered menu item appearance. Menu items trigger active canvas change. Icon pulse/shimmer.

---

## Phase 3: Kinetic Canvases & Core Content - Frontend

*   **Task 3.1:** Canvas Management: State for active "Kinetic Canvas" (React Context/Zustand/Jotai), updated by `CuratorLensNav`.
*   **Task 3.2 (Optional):** `KineticCanvasWrapper` component for shared canvas transition logic/styling.
*   **Task 3.3:** `HomeCanvas` component (`frontend/components/canvases/HomeCanvas.tsx`): Typographic statement, styled with Tailwind. Calm, spacious atmosphere.
*   **Task 3.4:** Inter-Canvas Transitions: Framer Motion (`perspective`, `rotateY`, `scale`, `translateZ`). Vary transition styles per "Emergence" theme.
*   **Task 3.5:** `PortfolioCanvas` component (`frontend/components/canvases/PortfolioCanvas.tsx`): Layout for project items (Tailwind grid/flex). Style items (`mix-blend-mode: luminosity`, hover effects).
*   **Task 3.6:** `ProjectDetailCanvas`: Dynamic route (e.g., `frontend/app/portfolio/[slug]/page.tsx`) or modal. Focused layout for project details.
*   **Task 3.7:** `ServicesCanvas`, `JournalCanvas`, `ContactCanvas` components: Content structure and Tailwind styling for "Confident Expression."
*   **Task 3.8:** General Phase 3 Styling: Consistent color palette, typography. Microinteractions (hovers, subtle animations). Optional digital dust/particles.

---

## Phase 4: Directus Backend Development

*   **Task 4.1:** Define Directus Collections: "Projects" (title, desc, images, tech, URL, etc.), "Journal Entries" (title, slug, content, date, image, tags), "Services" (title, desc, icon). Optional "General Site Info."
*   **Task 4.2:** Configure Directus Roles & Permissions for public access.
*   **Task 4.3:** Populate Directus with initial sample content for frontend development.
*   **Task 4.4:** Implement any custom Directus extensions (hooks, endpoints) if needed for complex data queries or logic.

---

## Phase 5: Frontend-Backend Integration

*   **Task 5.1:** Fetch data from Directus API in Next.js components/pages (e.g., using `fetch`, SWR, or React Query with Bun's fetch).
    *   Portfolio items for `PortfolioCanvas` and `ProjectDetailCanvas`.
    *   Journal entries for `JournalCanvas`.
    *   Services content for `ServicesCanvas`.
*   **Task 5.2:** Implement dynamic routing in Next.js for detailed project/journal views based on slugs from Directus.
*   **Task 5.3:** Handle image rendering from Directus (using Next.js `<Image>` component if possible, ensuring correct Directus asset URLs).
*   **Task 5.4:** Set up contact form submission (if `ContactCanvas` has a form) to a Directus endpoint/flow or a third-party service.

---

## Phase 6: Refinements & "Emergence" Theme Implementation

*   **Task 6.1:** Implement "Emergence" Narrative Arc details:
    *   **Phase 1 (Seed/Veil):** Ensure Overture embodies introspection, contained potential. Darker tones, slower animations.
    *   **Phase 2 (Growth/Unfurling):** Transitions show breaking through, gradual illumination. Canvas transitions peel back layers, open spaces.
    *   **Phase 3 (Bloom/Horizon):** Main canvases are bright, spacious, confident. Interactions polished.
*   **Task 6.2:** Implement Subtle Accents (Cyberpunk, Old Money) as per `Portfolio.md`, ensuring they support the "Emergence" theme.
*   **Task 6.3:** Animation Control & Variation: Ensure Framer Motion animations dynamically reflect the current "Emergence" phase (e.g., speed, intensity of light/particles).
*   **Task 6.4:** Light as a Metaphor: Systematically use light (simulated via colors, glows, highlights with Tailwind) to convey the journey.

---

## Phase 7: Testing, Optimization & Deployment

*   **Task 7.1:** Accessibility Review (WCAG compliance): Color contrasts, keyboard navigation, ARIA attributes.
*   **Task 7.2:** Performance Optimization: Image optimization (Next.js `<Image>`), code splitting, lazy loading. Bundle size analysis.
*   **Task 7.3:** Cross-browser & Responsiveness Testing: Test on major browsers. Ensure design is responsive or degrades gracefully.
*   **Task 7.4:** Final Review against `Portfolio.md` specifications.
*   **Task 7.5:** Build final Docker images for production.
*   **Task 7.6:** Deploy to chosen hosting platform.
