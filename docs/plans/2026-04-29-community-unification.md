# Community Unification Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rework the community experience into a unified feed-driven platform page, replace the top-left logo with the provided AAGI mark, and replace Argi's avatar with an AI-generated cartoon cat asset.

**Architecture:** Keep the app as a single-file React prototype, but centralize the new brand assets and replace the `Discovery` view with a cleaner unified community layout. Reuse local mock data arrays for card rendering and direct the publish CTA into the existing `workshop` tab instead of opening a modal.

**Tech Stack:** React 19, TypeScript, Vite 6, Tailwind CSS 4, Motion, local SVG/PNG assets

---

### Task 1: Add stable design and brand assets

**Files:**
- Create: `src/assets/aagi-logo.svg`
- Create: `src/assets/argi-cat.png`

**Step 1: Prepare logo asset**

Create a transparent SVG version of the provided AAGI logo for direct use in the top bar.

**Step 2: Generate cat avatar asset**

Use the image generation workflow to create a square cartoon cat portrait aligned with the platform's blue-green brand palette.

**Step 3: Verify files exist**

Run: `ls -la src/assets`
Expected: logo SVG and cat PNG are present.

### Task 2: Rewrite shared header/avatar surfaces

**Files:**
- Modify: `src/App.tsx`

**Step 1: Replace inline logo**

Remove the current reconstructed SVG block in the global top bar and swap in the local asset import.

**Step 2: Replace shared avatar usage**

Update the top-right account chip and AI secretary panel to use the cat avatar asset.

**Step 3: Verify TypeScript references**

Run: `npm run lint`
Expected: no unresolved imports or type errors.

### Task 3: Replace the community page structure

**Files:**
- Modify: `src/App.tsx`

**Step 1: Reshape community mock data**

Add explicit feed data for AIGC cards, templates, tournament reports, and sect recruitment cards plus banner metadata that reflects the requested platform structure.

**Step 2: Rebuild Discovery layout**

Implement:
- top action bar with `关注 / 推荐 / 热门`
- fixed circular publish button
- carousel-style banner area
- unified mixed feed with the four requested card types

**Step 3: Redirect publish CTA**

Remove the bottom-sheet publish panel logic and route the `+` action to the `workshop` tab.

**Step 4: Verify behavior**

Run the app and manually confirm tab switching, banner rendering, feed rendering, and publish redirection.

### Task 4: Align visual system for the new page

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/index.css`

**Step 1: Tone down inconsistent effects**

Reduce the old hyper-neon treatment where it conflicts with the new unified platform aesthetic.

**Step 2: Add any utility styles required by the new cards**

Keep additions minimal and scoped to the new design.

**Step 3: Verify production build**

Run: `npm run build`
Expected: build completes successfully.
