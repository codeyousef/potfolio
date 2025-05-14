# Aethelframe Protocol: Emergence - Implementation Plan with Conversion Optimization (Next.js & Directus)

**Objective:** Implement "Aethelframe Protocol" portfolio per updated `docs/Portfolio.md`, focusing on "Emergence" narrative with conversion optimization.
**Guiding Design Document:** `docs/Portfolio.md` (Version 1.2)
**Tech Stack:**
*   Frontend: Next.js (TypeScript), React, Tailwind CSS, Framer Motion, Bun
*   Backend: Directus, Bun
*   Database: PostgreSQL
*   Environment: Docker

---

## Phase 0: Project & Environment Setup

*   **Task 0.1:** Verify Docker setup (`Dockerfile`, `docker-compose.yml`, `start-services.sh`).
*   **Task 0.2:** Configure Tailwind CSS (`frontend/tailwind.config.ts`): theme values (colors, fonts from `Portfolio.md`), custom utility classes for conversion elements.
*   **Task 0.3:** Global styles (`frontend/app/globals.css`): font imports, base body styles, SVG noise/grain effect, conversion element base styles.
*   **Task 0.4:** Main Next.js layout (`frontend/app/layout.tsx`): metadata, fonts, global styles wrapper.
*   **Task 0.5:** Simple analytics setup - add Vercel Analytics, Plausible, or similar lightweight solution to track conversion paths.
*   **Task 0.6 (Optional):** Basic Directus collections (e.g., "Projects") for parallel backend work.

---

## Phase 1: The Overture (Seed/Veil) - Frontend with Skip Option

*   **Task 1.1:** `Overture` React component (`frontend/components/sections/Overture.tsx`): JSX for "Monolith Entry," title, `[ BEGIN ]` prompt.
*   **Task 1.2:** Style `Overture` with Tailwind: colors, typography (Montserrat for title, Roboto Mono for prompt), title animation, prompt hover/focus effects (glow, expansion).
*   **Task 1.3:** `Overture` client-side logic: manage visibility state, handle `[ BEGIN ]` click for site shell transition.
*   **Task 1.4:** **NEW** Add "Skip Overture" option that appears after 3-second delay, styled to match the aesthetic (subtle opacity animation). Implement localStorage to remember returning visitors.
*   **Task 1.5:** **NEW** Enhance `[ BEGIN ]` prompt with subtle pulse animation to improve engagement without compromising aesthetics.

---

## Phase 2: The Unfurling (Transitions & Initial Site Structure) - Frontend with Wayfinding

*   **Task 2.1:** `SiteShell` component (`frontend/components/core/SiteShell.tsx`): manages "Kinetic Canvases" display. Integrate with `Overture` in `frontend/app/page.tsx`.
*   **Task 2.2:** `CuratorLensNav` component (`frontend/components/navigation/CuratorLensNav.tsx`): JSX for navigator icon & menu. Style with Tailwind (bottom-left, icon, menu hidden initially).
*   **Task 2.3:** Overture to Site Shell Transition: Use Framer Motion for "breakthrough" animation with embedded value proposition text that emerges organically.
*   **Task 2.4:** `CuratorLensNav` Logic: Toggle menu (icon animation '+' to 'X'), Framer Motion for staggered menu item appearance. Menu items trigger active canvas change. Icon pulse/shimmer.
*   **Task 2.5:** **NEW** Add `PositionIndicator` component to show current location in the experience, styled as minimal aesthetic element.
*   **Task 2.6:** **NEW** `ContactBeacon` component that persists across the experience, styled to match design language. Implement with useContext to control visibility based on current phase.

---

## Phase 3: Kinetic Canvases & Core Content - Frontend with Conversion Elements

*   **Task 3.1:** Canvas Management: State for active "Kinetic Canvas" (React Context/Zustand/Jotai), updated by `CuratorLensNav`.
*   **Task 3.2 (Optional):** `KineticCanvasWrapper` component for shared canvas transition logic/styling.
*   **Task 3.3:** `HomeCanvas` component (`frontend/components/canvases/HomeCanvas.tsx`):
  * Typographic statement, styled with Tailwind. Calm, spacious atmosphere.
  * **NEW** Add concise value proposition statement that complements the artistic element.
  * **NEW** Add primary CTA that feels like a natural part of the composition.
*   **Task 3.4:** Inter-Canvas Transitions: Framer Motion (`perspective`, `rotateY`, `scale`, `translateZ`). Vary transition styles per "Emergence" theme.
  * **NEW** Add subtle loading indicators styled as artistic elements.
  * **NEW** Optimize transitions for reduced waiting time.
*   **Task 3.5:** `PortfolioCanvas` component (`frontend/components/canvases/PortfolioCanvas.tsx`):
  * Layout for project items (Tailwind grid/flex). Style items (`mix-blend-mode: luminosity`, hover effects).
  * **NEW** Add elegant filtering options for projects (styled to match aesthetic).
  * **NEW** Enhance project cards with clear information and subtle CTAs.
*   **Task 3.6:** `ProjectDetailCanvas`:
  * Dynamic route (e.g., `frontend/app/portfolio/[slug]/page.tsx`) or modal. Focused layout for project details.
  * **NEW** Add "Next Steps" section and "Discuss This Project" CTA.
  * **NEW** Add related projects component to encourage continued exploration.
*   **Task 3.7:** `ServicesCanvas`:
  * Content structure and Tailwind styling for "Confident Expression."
  * **NEW** Enhance service descriptions for clarity while maintaining aesthetic.
  * **NEW** Add "Process" insights and service-specific CTAs.
*   **Task 3.8:** `JournalCanvas`:
  * Structure and styling for journal entries.
  * **NEW** Add newsletter signup or content alert option styled to match the aesthetic.
*   **Task 3.9:** `ContactCanvas`:
  * **NEW** Streamlined form with minimal required fields.
  * **NEW** Add subtle "response time" indicator.
  * **NEW** Include alternative contact methods.
*   **Task 3.10:** General Phase 3 Styling: Consistent color palette, typography. Microinteractions (hovers, subtle animations). Optional digital dust/particles.
  * **NEW** Enhanced hover/focus states for conversion elements.
  * **NEW** Subtle cursor changes near interactive elements.

---

## Phase 4: Directus Backend Development with Conversion Tracking

*   **Task 4.1:** Define Directus Collections: "Projects" (title, desc, images, tech, URL, etc.), "Journal Entries" (title, slug, content, date, image, tags), "Services" (title, desc, icon). Optional "General Site Info."
*   **Task 4.2:** **NEW** Add "Conversion Actions" collection to track form submissions and engagement.
*   **Task 4.3:** Configure Directus Roles & Permissions for public access.
*   **Task 4.4:** Populate Directus with initial sample content for frontend development.
*   **Task 4.5:** Implement any custom Directus extensions (hooks, endpoints) if needed for complex data queries or logic.
*   **Task 4.6:** **NEW** Set up Directus Flows for handling form submissions and contact requests.

---

## Phase 5: Frontend-Backend Integration with Conversion Handling

*   **Task 5.1:** Fetch data from Directus API in Next.js components/pages (e.g., using `fetch`, SWR, or React Query with Bun's fetch).
  *   Portfolio items for `PortfolioCanvas` and `ProjectDetailCanvas`.
  *   Journal entries for `JournalCanvas`.
  *   Services content for `ServicesCanvas`.
*   **Task 5.2:** Implement dynamic routing in Next.js for detailed project/journal views based on slugs from Directus.
*   **Task 5.3:** Handle image rendering from Directus (using Next.js `<Image>` component if possible, ensuring correct Directus asset URLs).
*   **Task 5.4:** Set up contact form submission (if `ContactCanvas` has a form) to a Directus endpoint/flow or a third-party service.
*   **Task 5.5:** **NEW** Implement form validation with elegant error states that match the design language.
*   **Task 5.6:** **NEW** Create success/confirmation states for all conversion actions with animations that fit the "Emergence" narrative.

---

## Phase 6: Refinements & "Emergence" Theme Implementation with Conversion Path

*   **Task 6.1:** Implement "Emergence" Narrative Arc details with conversion moments:
  *   **Phase 1 (Seed/Veil):** Ensure Overture embodies introspection, contained potential. Darker tones, slower animations. Skip option for returning visitors.
  *   **Phase 2 (Growth/Unfurling):** Transitions show breaking through, gradual illumination. Canvas transitions peel back layers, open spaces. Emerging value proposition during transitions.
  *   **Phase 3 (Bloom/Horizon):** Main canvases are bright, spacious, confident. Interactions polished. Clear conversion pathways integrated.
*   **Task 6.2:** Implement Subtle Accents (Cyberpunk, Old Money) as per `Portfolio.md`, ensuring they support the "Emergence" theme.
*   **Task 6.3:** Animation Control & Variation: Ensure Framer Motion animations dynamically reflect the current "Emergence" phase (e.g., speed, intensity of light/particles).
*   **Task 6.4:** Light as a Metaphor: Systematically use light (simulated via colors, glows, highlights with Tailwind) to convey the journey.
*   **Task 6.5:** **NEW** Implement "Contact Beacon" behavior across all phases, ensuring it feels integrated with the design.
*   **Task 6.6:** **NEW** Add subtle "guided pathways" (thin lines, gentle gradients, or particle concentrations) that intuitively guide users toward conversion elements.

---

## Phase 7: Testing, Optimization & Deployment with Conversion Focus

*   **Task 7.1:** Accessibility Review (WCAG compliance): Color contrasts, keyboard navigation, ARIA attributes. Ensure conversion elements are accessible.
*   **Task 7.2:** Performance Optimization:
  * Image optimization (Next.js `<Image>`), code splitting, lazy loading. Bundle size analysis.
  * **NEW** Implement priority loading for conversion-critical elements.
  * **NEW** Add skeleton loaders styled to match the aesthetic.
*   **Task 7.3:** Cross-browser & Responsiveness Testing:
  * Test on major browsers. Ensure design is responsive or degrades gracefully.
  * **NEW** Test mobile touch targets for conversion elements.
  * **NEW** Verify mobile performance of animations and transitions.
*   **Task 7.4:** **NEW** Conversion Path Testing:
  * Set up heatmaps to analyze user interaction with conversion elements.
  * Test form completion rates and adjust if necessary.
  * Verify analytics tracking of key conversion points.
*   **Task 7.5:** **NEW** A/B Testing Setup for Conversion Elements:
  * Implement lightweight framework for testing subtle variations of conversion elements.
  * Set up tracking for comparison data.
*   **Task 7.6:** Final Review against updated `Portfolio.md` specifications.
*   **Task 7.7:** Build final Docker images for production.
*   **Task 7.8:** Deploy to chosen hosting platform.

---

## Phase 8: Post-Launch Optimization

*   **Task 8.1:** **NEW** Set up monitoring for conversion metrics and user journeys.
*   **Task 8.2:** **NEW** Plan for iterative improvements based on analytics data.
*   **Task 8.3:** **NEW** Develop A/B testing schedule for ongoing conversion optimization.

---

## Appendix A: Current CSS Debugging Focus (As of 2025-05-15)

We are currently facing a persistent and critical issue where specific Tailwind CSS utility classes are not being applied as expected, primarily affecting background colors and flexbox layouts. Text-based Tailwind utilities, however, are working correctly.

**Symptoms:**
*   Tailwind background color utilities (e.g., `bg-red-500`, `bg-primary-accent`, `bg-blue-500`) do not apply to elements, including `div`s in `HomeCanvas.tsx` or even the `<body>` tag in `app/layout.tsx`.
*   Tailwind flexbox utilities (e.g., `flex`, `justify-center`, `items-center`) do not apply to elements within `HomeCanvas.tsx`.
*   These issues persist even when:
    *   `frontend/app/components.css` is commented out.
    *   `frontend/app/globals.css` has had its most broad and potentially conflicting global styles (like direct `body` background images or `div[class*="Canvas"]` styles) removed or commented out.
    *   The target element is a plain `div` (not a `motion.div` from Framer Motion).
    *   Standard, default Tailwind color classes are used.
*   Tailwind's text styling utilities (e.g., `text-white`, `font-heading`) function correctly on the same elements.
*   The Tailwind configuration (`tailwind.config.ts`) appears correct regarding color definitions and content paths. The absence of `postcss.config.js` is normal for Next.js's default setup.
*   The `@tailwind` directives are correctly placed at the top of `globals.css`.

**Next Steps for Debugging:**
1.  **Verify Tailwind CSS Output File**:
    *   Locate and inspect the actual CSS file generated by Tailwind/Next.js (typically found within the `.next/static/css/` directory during development).
    *   Confirm that utility classes like `.bg-red-500 { ... }` or `.flex { display: flex; }` are present in the generated bundle and that their CSS properties are correct. This will determine if the issue is in generation or application.
2.  **Browser Developer Tools Deep Dive**:
    *   Intensively use the browser's element inspector on the affected elements (e.g., the main `div` in `HomeCanvas`, the `body` tag).
    *   Pay close attention to the "Computed" styles tab to see precisely which styles are winning and their origin.
    *   Systematically disable CSS rules in the "Styles" or "Rules" panel to identify any unexpected overrides, even from browser default styles or extensions (though less likely for such fundamental properties).
    *   Look for any inherited styles with unusual specificity or `!important` flags.
3.  **Extreme Simplification Test**:
    *   Create a new, minimal Next.js page (e.g., `app/test-tailwind/page.tsx`) with only the most basic HTML structure (e.g., `<html><body><div>Hello</div></body></html>`).
    *   Apply a single Tailwind background class (e.g., `bg-green-500`) and a flex class to the div.
    *   If this works, incrementally reintroduce elements from the main `app/layout.tsx` and `app/page.tsx` (like the specific `html` and `body` classes, `main` tag, `AnimatePresence`, etc.) to pinpoint when the styling breaks.
4.  **Scrutinize `globals.css` Again**:
    *   Despite previous cleanups, re-examine every rule in `globals.css` for any subtle, overly broad selectors (e.g., attribute selectors, universal selectors `*`) that might be unintentionally resetting or interfering with background or display properties.
5.  **Check for Other Global Style Injections**:
    *   Ensure no third-party libraries or scripts are injecting global CSS that could conflict. Review `useEffect` hooks or component libraries that might have this side effect.
6.  **Project Dependencies and Cache**:
    *   If the above steps yield no solution, consider deleting `node_modules`, `.next` folder, and `package-lock.json`/`yarn.lock`, then running `npm install` (or `yarn`) to ensure a completely fresh build environment.
    *   Check the current Next.js version for any known, relevant bugs filed on its issue tracker.
