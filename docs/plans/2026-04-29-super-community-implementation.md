# Super Community Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade the current community page into a four-section super community shell and align the frontend content with the new PRD.

**Architecture:** Keep the app in the existing single-file React prototype, but split the community experience into a page-level section switcher plus section-specific mock datasets. Reuse the existing discovery feed where useful, and add section-specific layouts for market, tournaments, and circles without introducing routing or backend dependencies.

**Tech Stack:** React 19, TypeScript, Vite 6, Tailwind CSS 4, Motion, local static assets

---

### Task 1: Add PRD-aligned community structure

**Files:**
- Modify: `src/App.tsx`

**Step 1: Define community section state**

Add a page-level state for `discover | market | events | circles`.

**Step 2: Add section nav**

Render a community-level tab bar under the hero area.

**Step 3: Verify state compiles**

Run: `npm run lint`
Expected: no type errors.

### Task 2: Expand mock datasets by section

**Files:**
- Modify: `src/App.tsx`

**Step 1: Keep discovery data**

Preserve current discovery feed and banner data where it still matches the PRD.

**Step 2: Add market, event, and circle datasets**

Create separate static arrays for:
- market categories and template cards
- event filters and event cards
- my circles, recommended circles, active ranking, circle categories

**Step 3: Verify imports and shapes**

Run: `npm run lint`
Expected: no unused or invalid references.

### Task 3: Implement section-specific layouts

**Files:**
- Modify: `src/App.tsx`

**Step 1: Discovery layout**

Keep feed switching, banner, mixed feed, and add publish panel overlay.

**Step 2: Market layout**

Add search/filter header, categories, sorting, template grid, and my-trade entry.

**Step 3: Events layout**

Add hero banner, status filters, event cards, and event type explainer area.

**Step 4: Circles layout**

Add my circles row, recommendations, activity ranking, category chips, and circle cards.

**Step 5: Verify in browser**

Run local dev server and confirm all four sections render and switch correctly.

### Task 4: Final polish and verification

**Files:**
- Modify: `src/App.tsx`

**Step 1: Check copy consistency**

Ensure labels, CTA text, and section descriptions match the PRD language.

**Step 2: Run validation**

Run:
- `npm run lint`
- `npm run build`

Expected:
- TypeScript passes
- Production build completes
