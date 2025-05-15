## Aethelframe Protocol (Emergence Theme): Detailed Design & Implementation Specification

Version: 1.2 (Optimized for AI Implementation with Framer Motion)

Date: May 15, 2025

Objective: To provide a detailed specification for AI coding agents to implement the "Aethelframe Protocol" interactive portfolio. This document integrates the "Emergence" theme (a narrative of transformation) into a dominant Art/High Fashion aesthetic with subtle Cyberpunk/Old Money influences. The implementation should leverage Next.js, Directus, Tailwind CSS, and Framer Motion within a Dockerized Bun environment.

**Guiding Principles for AI Agent:**

- **Adhere to the "Emergence" Narrative:** The design subtly transitions through three phases:
    
    1. **Seed/Veil (Overture):** Introspective, contained, dark, slow.
        
    2. **Growth/Unfurling (Transitions, Early Canvases):** Gradual illumination, expansion, layers peeling.
        
    3. **Bloom/Horizon (Main Canvases):** Bright, spacious, confident, polished.
        
- **Prioritize Art/High Fashion Aesthetic:** Minimalism, elegance, dramatic space, refined typography, simulated luxury materials.
    
- **Implement Novel Navigation & Layouts:** Move beyond traditional web structures as detailed.
    
- **Leverage Framer Motion:** Explicitly use Framer Motion for all significant animations, transitions, and interactive visual effects.
    
- **Use Tailwind CSS for Base Styling & Layout:** Apply Tailwind for typography, spacing, color theming, and responsive grid/flex structures. Custom CSS will be needed for highly bespoke elements and complex visual effects not easily achievable with Tailwind alone.
    
- **Accessibility (WCAG 2.1 AA):** Crucial. All novel interactions must have accessible alternatives. Respect `prefers-reduced-motion`.
    
- **Performance:** Optimize all animations and asset loading.
    

### 0. Core Technologies & Environment Setup

- [x] **Task 0.1:** Verify Docker setup (`Dockerfile`, `docker-compose.yml`, `start-services.sh`).
    
- [x] **Task 0.2:** Configure Tailwind CSS (`frontend/tailwind.config.ts`): theme values (colors, fonts from this document), custom utility classes for conversion elements.
    
- [x] **Task 0.3:** Global styles (`frontend/app/globals.css`): font imports, base body styles, SVG noise/grain background effect, conversion element base styles.
    
- [x] **Task 0.4:** Main Next.js layout (`frontend/app/layout.tsx`): metadata, fonts, global styles wrapper.
    
- [x] **Task 0.5:** Simple analytics setup - add Vercel Analytics, Plausible, or similar lightweight solution to track conversion paths.
    
- [ ] **Task 0.6 (Optional):** Basic Directus collections (e.g., "Projects") for parallel backend work.
    

### 1. The Overture (Seed/Veil Phase) - Entry Sequence

- [x] **Task 1.1:** `Overture.tsx` React component (`frontend/components/sections/Overture.tsx`): JSX for "Monolith Entry," title, `[ BEGIN ]` prompt.
    
- [x] **Task 1.2:** Style `Overture` with Tailwind: colors, typography (Montserrat for title, Roboto Mono for prompt), title animation, prompt hover/focus effects (glow, expansion).
    
- [x] **Task 1.3:** `Overture` client-side logic: manage visibility state, handle `[ BEGIN ]` click for site shell transition using Framer Motion.
    
- [x] **Task 1.4:** Add "Skip Overture" option: appears after 3-5 second delay, styled subtly, Framer Motion for fade-in. Implement `localStorage` to remember returning visitors for bypass.
    
- [x] **Task 1.5:** Enhance `[ BEGIN ]` prompt: subtle pulse animation using Framer Motion (`animate` prop with `repeat: Infinity, repeatType: "mirror"` on `scale` or `opacity`).
    

### 2. Site Shell & Curator's Lens (Navigation) - Unfurling Phase

- [x] **Task 2.1:** `SiteShell.tsx` component (`frontend/components/core/SiteShell.tsx`): manages visibility and Framer Motion transitions of "Kinetic Canvases." Integrate with `Overture` in `frontend/app/page.tsx` (likely using `AnimatePresence` from Framer Motion to handle `Overture`'s exit and `SiteShell`'s entry).
    
- [x] **Task 2.2:** `CuratorLensNav.tsx` component (`frontend/components/navigation/CuratorLensNav.tsx`): JSX for navigator icon & menu. Style with Tailwind (bottom-left, icon, menu hidden initially).
    
- [x] **Task 2.3:** Overture to Site Shell Transition: Use Framer Motion for the `SiteShell`'s `animate` prop (`opacity: 1, scale: 1`) and `transition` prop (syncing with `Overture`'s exit). Embed value proposition text that emerges organically during this transition.
    
- [x] **Task 2.4:** `CuratorLensNav` Logic:
    
    - Toggle menu visibility with `open` state.
        
    - Animate navigator icon (plus to cross) using Framer Motion `animate` prop based on `open` state. Implement orbiting dot effect with `motion.div` elements.
        
    - Framer Motion for staggered menu item appearance using `variants` as specified.
        
    - Menu items trigger active canvas change (update global state).
        
    - Icon pulse/shimmer on hover using `whileHover`.
        
- [x] **Task 2.5:** `PositionIndicator.tsx` component: displays current canvas (e.g., "I/V"). Style minimally. Framer Motion for subtle animation on change.
    
- [x] **Task 2.6:** `ContactBeacon.tsx` component: persistent, subtly styled button/icon. Use React Context/Zustand to control visibility/prominence based on "Emergence" phase. Framer Motion for animated appearance/disappearance.
    

### 3. Kinetic Canvases & Core Content - Bloom/Horizon Phase

- [x] **Task 3.1:** Canvas Management: Global state (React Context/Zustand/Jotai) for `activeCanvasId`. `SiteShell.tsx` uses this to render only the active canvas within `AnimatePresence`.
    
- [x] **Task 3.2:** `KineticCanvasWrapper.tsx` component: `motion.section` that takes `isActive` prop and handles its own `initial`, `animate`, `exit`, `transition` props for shared canvas transition logic (perspective, rotateY, scale, translateZ).
    
- [x] **Task 3.3:** `HomeCanvas.tsx` component (`frontend/components/canvases/HomeCanvas.tsx`):
    
    - Dominant typographic statement, subtitle. Style with Tailwind.
        
    - Integrate concise value proposition.
        
    - Primary CTA (`.canvas-action-link` style): Framer Motion for hover (letter-spacing, underline reveal).
        
- [x] **Task 3.4:** Inter-Canvas Transitions: Ensure `AnimatePresence` wraps the active canvas in `SiteShell.tsx`. Define `initial`, `animate`, `exit` props on each canvas component (or `KineticCanvasWrapper`) as specified (perspective, rotateY, scale, translateZ). Vary transition subtleties (speed, intensity) based on "Emergence" phase using dynamic `transition` props.
    
    - Implement subtle, artistic loading indicators (e.g., pulsing line) using Framer Motion during canvas transitions or data fetching.
        
    - Optimize transitions for perceived speed and smoothness.
        
- [x] **Task 3.5:** `PortfolioCanvas.tsx` component (`frontend/components/canvases/PortfolioCanvas.tsx`):
    
    - Layout: `portfolio-space` div uses flexbox (`flex-grow: 1` within a flex-column `.canvas-content-wrapper` that has `height: 100%`).
        
    - Project Items (`ProjectSculpture.tsx`):
        
        - Each item is `motion.div`.
            
        - Placement & Initial Animation: Implement `arrangePortfolioItems` JS logic. Pass initial transform values as props to `ProjectSculpture.tsx` and use in `initial` prop. Animate to final position using `animate` prop.
            
        - Hover: `whileHover={{ scale: 1.05, zIndex: 10, boxShadow: "..." }}`. Image `mix-blend-mode` change. Project info overlay animates with Framer Motion (`initial={{ y: "100%" }} whileHover={{ y: "0%" }}`).
            
    - Filtering: If implemented, use Framer Motion's `layout` prop on `portfolio-space` and `layoutId` on items for animated reordering. Style filters elegantly.
        
    - Conversion: Clear titles, enticing visuals. "Discover ->" link as micro-CTA.
        
- [x] **Task 3.6:** `ProjectDetailCanvas.tsx`:
    
    - Dynamic route (`frontend/app/portfolio/[slug]/page.tsx`) or modal. If modal, use Framer Motion for entry/exit.
        
    - Focused layout, high-quality imagery.
        
    - Conversion: "Next Steps" section, "Discuss This Project" CTA. Related projects component with Framer Motion for item appearance.
        
- [x] **Task 3.7:** `ServicesCanvas.tsx`:
    
    - Content structure and Tailwind styling.
        
    - Framer Motion for subtle entrance animations of content blocks (staggered `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`).
        
    - Conversion: Clear value, process insights, service-specific CTAs.
        
- [x] **Task 3.8:** `JournalCanvas.tsx`:
    
    - Structure and styling. Framer Motion for content block entrances.
        
    - Conversion: Minimalist newsletter signup form or "Follow for insights" CTA.
        
- [x] **Task 3.9:** `ContactCanvas.tsx`:
    
    - Streamlined form. Framer Motion for field/button appearances.
        
    - Conversion: "Response time" indicator. Alternative contact methods.
        
- [x] **Task 3.10:** General Phase 3 Styling & Microinteractions:
    
    - Consistent color palette, typography.
        
    - Implement `ParticleAccent.tsx` component using Framer Motion for individual particle animation.
        
    - Enhanced hover/focus states for conversion elements using `whileHover`, `whileFocus`.
        
    - Subtle cursor changes (CSS `cursor` property, or custom cursor with Framer Motion if ambitious) near interactive elements.
        

### 4. Directus Backend & Integration

- [x] **Task 4.1:** Define Directus Collections: "Projects" (title, slug, description, images, tech_stack array, live_url, repo_url, case_study_content, optional layout fields like `initialX`, `initialY`), "JournalEntries" (title, slug, content_rich_text, publication_date, featured_image_url, tags array), "Services" (title, description_rich_text, icon_url), "ConversionActions" (action_type, submitted_data, timestamp).
    
- [x] **Task 4.2:** Add "Conversion Actions" collection to track form submissions and key engagement points.
    
- [x] **Task 4.3:** Configure Directus Roles & Permissions: Public read-only for published content, admin CUD.
    
- [x] **Task 4.4:** Populate Directus with initial sample content.
    
- [~] **Task 4.5:** Implement custom Directus extensions (hooks, endpoints) if needed (e.g., for complex queries or processing form data before saving). *(Deferred - will re-evaluate if SDK via Next.js API routes is insufficient)*
    
- [~] **Task 4.6:** Set up Directus Flows for handling form submissions (e.g., from ContactCanvas) and sending email notifications. *(Deferred)*

### 5. Frontend-Backend Integration

- [ ] **Task 5.1:** Fetch data from Directus API in Next.js (Server Components for initial data, client-side fetching with SWR/React Query for dynamic updates if needed).
    
    - [x] Portfolio items for `PortfolioCanvas`.
    - [x] Portfolio items for `ProjectDetailCanvas`.
    - [x] Journal entries for `JournalCanvas`.
    - [x] Services content for `ServicesCanvas`.
        
- [x] **Task 5.2:** Implement dynamic routing in Next.js for `ProjectDetailCanvas` (`/portfolio/[slug]`) and individual journal entry pages (`/journal/[slug]`).
    
    - [x] Update `lib/directus.ts` to add `getProjectBySlug(slug: string)`.
    - [x] Create `app/portfolio/[slug]/page.tsx`.
    - [x] Fetch data & pass to `ProjectDetailCanvas`.
    - [x] Handle `notFound`.
    - [x] Update `ProjectDetailCanvas` to use fetched data.
    - [x] Update `lib/directus.ts` to add `getJournalEntryBySlug(slug: string)`.
    - [x] Create `app/journal/[slug]/page.tsx` for individual entries. DONE
    - [x] Ensure `JournalEntryCard.tsx` links to the correct `[slug]` page. DONE
    
- [x] **Task 5.3:** Handle image rendering from Directus using Next.js `<Image>` component. Construct asset URLs: `DIRECTUS_URL/assets/IMAGE_ID`.
    
- [ ] **Task 5.4:** Contact form submission: Next.js API Route sends data to Directus (custom endpoint or SDK to create item in "ConversionActions" / trigger Flow).
    
- [x] **Task 5.5:** Implement form validation (e.g., using React Hook Form) with elegant error states styled with Tailwind and animated with Framer Motion (e.g., gentle shake).
    
- [ ] **Task 5.6:** Create success/confirmation states for form submissions: animated messages using Framer Motion that fit the "Emergence" narrative (e.g., a gentle unfolding confirmation).
    

### 6. "Emergence" Theme Implementation with Framer Motion

- [x] **Task 6.1:** Implement "Emergence" Narrative Arc details with conversion moments:
    
    - **Phase 1 (Seed/Veil - Overture):** Darker tones, slower Framer Motion animations. Skip option for returning visitors.
        
    - **Phase 2 (Growth/Unfurling - Transitions & Early Canvases):** Framer Motion transitions show layers peeling, spaces opening. Gradual illumination (can be managed by passing phase prop to components and adjusting styles/variants). Emerging value proposition text animated during transitions.
        
    - **Phase 3 (Bloom/Horizon - Main Canvases):** Brighter, spacious, confident. Framer Motion interactions are polished. Clear conversion pathways integrated.
        
- [x] **Task 6.2:** Implement Subtle Accents (Cyberpunk, Old Money) as per this document, ensuring they support the "Emergence" theme.
    
- [x] **Task 6.3:** Animation Control & Variation: Use a global state (React Context/Zustand) for `currentEmergencePhase` ("seed", "growth", "bloom"). Framer Motion `variants` for elements (particles, glows, text styles, animation speeds) change based on this `currentEmergencePhase`.
    
- [x] **Task 6.4:** Light as a Metaphor: Control `text-shadow`, `box-shadow`, background subtleties via CSS variables updated by JS based on phase, or directly in Framer Motion `animate` props.
    
- [x] **Task 6.5:** `ContactBeacon` behavior: Framer Motion to animate changes in visibility/prominence based on `currentEmergencePhase`.
    
- [x] **Task 6.6:** Guided Pathways: Subtle animated lines (`motion.svg` paths) or particle flows (Framer Motion `motion.div` arrays) appearing in Phase 3 to guide towards CTAs.
    

### 7. Refinements, Testing, Optimization & Conversion Focus

- [ ] **Task 7.1:** Accessibility Review (WCAG 2.1 AA): Test all Framer Motion interactions for keyboard accessibility. Ensure focus management with canvas system. Check color contrasts. Use ARIA attributes.
    
- [ ] **Task 7.2:** Performance Optimization:
    
    - Use `motion.custom` with dynamic `variants` where appropriate for Framer Motion.
        
    - Utilize Framer Motion's `LazyMotion` and feature imports (e.g., `domAnimation`, `domMax`) to reduce bundle size.
        
    - Optimize `layout` prop usage. Ensure hardware acceleration (`transform`, `opacity`).
        
    - Next.js `<Image>` for image optimization. Code splitting. Bundle analysis (`@next/bundle-analyzer`).
        
    - Implement priority loading for conversion-critical elements (e.g., ensure CTAs are interactive quickly).
        
    - Add skeleton loaders (styled artistically, can be animated with Framer Motion) for data-heavy sections.
        
- [ ] **Task 7.3:** Cross-browser & Responsiveness Testing:
    
    - Test on major browsers. Ensure design adapts gracefully (e.g., "Sculpted Gallery" may simplify to a stacked/single-column layout on mobile, animated with Framer Motion).
        
    - Test mobile touch targets for conversion elements.
        
    - Verify mobile performance of Framer Motion animations.
        
- [ ] **Task 7.4:** Conversion Path Testing:
    
    - Set up heatmaps (e.g., Hotjar, Clarity) if possible.
        
    - Test form completion rates.
        
    - Verify analytics tracking of key conversion points (CTA clicks, form submissions).
        
- [ ] **Task 7.5:** A/B Testing Setup for Conversion Elements:
    
    - Implement lightweight framework (e.g., conditional rendering based on a flag/segment) for testing variations of CTAs or value propositions.
        
    - Track comparison data in analytics or Directus "Conversion Actions".
        
- [ ] **Task 7.6:** Final Review against this specification document.
    
- [ ] **Task 7.7:** Build final Docker images for production.
    
- [ ] **Task 7.8:** Deploy to chosen hosting platform.
    

### 8. Post-Launch Optimization

- [ ] **Task 8.1:** Set up monitoring for conversion metrics and user journeys using analytics.
    
- [ ] **Task 8.2:** Plan for iterative improvements based on analytics data and A/B test results.
    
- [ ] **Task 8.3:** Develop A/B testing schedule for ongoing conversion optimization.
    

### Appendix A: Current CSS Debugging Focus (As of 2025-05-15)

_This section was part of the original `plan.md` and is retained for context if the AI agent needs to be aware of past debugging efforts. It should be reviewed to ensure these specific issues are resolved or no longer relevant._

- [x] **Verify Tailwind CSS Output File**:
    
    - Locate and inspect the actual CSS file generated by Tailwind/Next.js (typically found within the `.next/static/css/` directory during development).
        
    - Confirm that utility classes like `.bg-red-500 { ... }` or `.flex { display: flex; }` are present in the generated bundle and that their CSS properties are correct. This will determine if the issue is in generation or application.
        
- [x] **Browser Developer Tools Deep Dive**:
    
    - Intensively use the browser's element inspector on the affected elements (e.g., the main `div` in `HomeCanvas`, the `body` tag).
        
    - Pay close attention to the "Computed" styles tab to see precisely which styles are winning and their origin.
        
    - Systematically disable CSS rules in the "Styles" or "Rules" panel to identify any unexpected overrides, even from browser default styles or extensions (though less likely for such fundamental properties).
        
    - Look for any inherited styles with unusual specificity or `!important` flags.
        
- [x] **Extreme Simplification Test**:
    
    - Create a new, minimal Next.js page (e.g., `app/test-tailwind/page.tsx`) with only the most basic HTML structure (e.g., `<html><body><div>Hello</div></body></html>`).
        
    - Apply a single Tailwind background class (e.g., `bg-green-500`) and a flex class to the div.
        
    - If this works, incrementally reintroduce elements from the main `app/layout.tsx` and `app/page.tsx` (like the specific `html` and `body` classes, `main` tag, `AnimatePresence`, etc.) to pinpoint when the styling breaks.
        
- [x] **Scrutinize `globals.css` Again**:
    
    - Despite previous cleanups, re-examine every rule in `globals.css` for any subtle, overly broad selectors (e.g., attribute selectors, universal selectors `*`) that might be unintentionally resetting or interfering with background or display properties.
        
- [x] **Check for Other Global Style Injections**:
    
    - Ensure no third-party libraries or scripts are injecting global CSS that could conflict. Review `useEffect` hooks or component libraries that might have this side effect.
        
- [x] **Project Dependencies and Cache**:
    
    - If the above steps yield no solution, consider deleting `node_modules`, `.next` folder, and `package-lock.json`/`yarn.lock`, then running `npm install` (or `yarn`) to ensure a completely fresh build environment.
        
    - Check the current Next.js version for any known, relevant bugs filed on its issue tracker.