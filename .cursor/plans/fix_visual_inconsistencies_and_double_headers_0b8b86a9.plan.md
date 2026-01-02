---
name: Fix Visual Inconsistencies and Double Headers
overview: Fix double headers across the site where H1 markdown headings duplicate frontmatter titles, and standardize visual styling including images, tables, callouts, spacing, and color usage to match best-in-class design standards.
todos:
  - id: update-main-index
    content: "Update using-dr-migrate/_index.md to match sidebar order: Insights → Dashboard → Setup → Inventory → Goals → Planning → TCO → Migrate → Smart Tools"
    status: completed
  - id: reorganize-weights
    content: Update weight values in all section frontmatter to match sidebar navigation order (Insights=5, Dashboard=10, Setup=20, Inventory=30, Goals=40, Planning=50, TCO=60, Migrate=70, Smart Tools=80+)
    status: completed
  - id: clarify-tco-structure
    content: Clarify TCO Settings (in Setup) vs TCO Analysis (separate section) in both setup/_index.md and tco/_index.md
    status: completed
  - id: update-section-landing-pages
    content: Update all section _index.md files to reference correct sidebar order and controller routes
    status: completed
    dependencies:
      - reorganize-weights
  - id: add-smart-tools-section
    content: Add Smart Tools overview to main index and ensure AI Assistant and App Manager are properly positioned
    status: completed
    dependencies:
      - update-main-index
  - id: reorganize-utility-pages
    content: Reorganize utility pages (interface-overview, navigation, data-tables, forms-modals, troubleshooting) with higher weights or move to reference section
    status: completed
    dependencies:
      - reorganize-weights
  - id: update-cross-references
    content: Update all internal links to match new structure and verify controller routes are accurate
    status: completed
    dependencies:
      - update-section-landing-pages
---

# Fix Visual Inconsistencies and Double Headers

## Overview

This plan addresses visual inconsistencies across the documentation site, focusing on:

1. **Double Headers**: Remove H1 markdown headings that duplicate frontmatter titles
2. **Image Styling**: Standardize image display, alignment, and captions
3. **Table Styling**: Ensure consistent table formatting and brand color usage
4. **Typography & Spacing**: Standardize heading hierarchy, spacing, and text styling
5. **Color Consistency**: Apply Dr Migrate brand colors (Violet #7D3AE2, Cyan #00FFFF) consistently
6. **Component Styling**: Standardize callouts, cards, and other UI components

## Brand Colors

- **Primary Violet**: `#7D3AE2` (--dr-migrate-violet)
- **Accent Cyan**: `#00FFFF` (--dr-migrate-cyan)
- **Inline Code**: `#c97c2e` with `rgba(201, 124, 46, 0.1)` background

## Issues Identified

### 1. Double Headers

Pages with H1 headings that duplicate frontmatter titles:

- `content/docs/_index.md` - Has `# Dr Migrate Documentation` (title = "Documentation")
- `content/docs/business/_index.md` - Has `# Business User Guide` (title = "Business User Guide")
- `content/docs/technical/_index.md` - Has `# Technical User Guide` (title = "Technical User Guide")
- `content/docs/partners/_index.md` - Has `# Partner Guide` (title = "Partner Guide")
- `content/docs/training/workshops/workshop1.md` - Has `# Overview` (may need review)

### 2. Image Styling Issues

- Images in `content/docs/overview/hosting-methods/marketplace/architecture.md` use old reference syntax `![Marketplace][0] `instead of Hextra `{{< figure >}}` shortcode
- Inconsistent image paths and caption formatting
- Missing responsive image styling

### 3. Table Styling

- Tables in marketplace architecture page use pipe syntax but may need better formatting
- Need to ensure tables use brand colors (violet headers) consistently
- Some tables may need better spacing and alignment

### 4. Typography & Spacing

- Inconsistent heading hierarchy (some pages start with H2, others with H1)
- Inconsistent spacing between sections
- Need to standardize paragraph spacing and line heights

### 5. Component Styling

- Callouts should use consistent brand colors
- Cards need consistent hover effects and spacing
- Code blocks need consistent styling

## Implementation Tasks

### Task 1: Fix Double Headers

**Files to update:**

- `content/docs/_index.md` - Remove `# Dr Migrate Documentation` H1
- `content/docs/business/_index.md` - Remove `# Business User Guide` H1
- `content/docs/technical/_index.md` - Remove `# Technical User Guide` H1
- `content/docs/partners/_index.md` - Remove `# Partner Guide` H1
- Review `content/docs/training/workshops/workshop1.md` - Check if `# Overview` is appropriate or should be removed

**Action**: Remove H1 markdown headings where frontmatter `title` already provides the page title. Hextra automatically renders the frontmatter title as H1.

### Task 2: Standardize Image Usage

**Files to update:**

- `content/docs/overview/hosting-methods/marketplace/architecture.md` - Convert `![Marketplace][0] `to `{{< figure >}}` shortcode
- Review all image references across content files
- Ensure images use `/images/` path (check if images folder exists in `static/`)

**Action**:

- Convert old image reference syntax to Hextra `{{< figure >}}` shortcode
- Add proper alt text and captions
- Ensure responsive image styling

**Example conversion:**

```markdown
<!-- Old -->
![Marketplace][0]
[0]: /images/architecture/marketplace-architecture.png

<!-- New -->
{{< figure src="/images/architecture/marketplace-architecture.png" alt="Marketplace Architecture Diagram" caption="Dr Migrate Marketplace Architecture" >}}
```

### Task 3: Enhance Table Styling

**Files to review:**

- `content/docs/overview/hosting-methods/marketplace/architecture.md` - Multiple tables
- All other pages with tables

**Action**:

- Ensure tables use proper markdown table syntax
- Verify tables render with violet headers (handled by CSS in `assets/css/custom.css`)
- Add proper spacing around tables
- Consider using Hextra table shortcode if available for complex tables

### Task 4: Standardize Typography & Spacing

**Action**:

- Ensure all pages start content with H2 (since H1 is from frontmatter)
- Add consistent spacing between sections using Hextra utility classes
- Standardize paragraph spacing
- Ensure proper line heights

### Task 5: Enhance CSS for Visual Consistency

**File to update:**

- `assets/css/custom.css` - Already has good styling, but may need enhancements for:
  - Image styling and responsive behavior
  - Better table spacing
  - Consistent callout colors
  - Card hover effects

**Enhancements needed:**

- Add image styling for consistent display
- Ensure callout colors match brand (violet for info, cyan for tip)
- Add spacing utilities
- Ensure dark mode compatibility

### Task 6: Review and Fix Marketplace Architecture Page

**File:**

- `content/docs/overview/hosting-methods/marketplace/architecture.md`

**Issues to fix:**

1. Convert image references to `{{< figure >}}` shortcode
2. Ensure tables are properly formatted
3. Add consistent spacing
4. Ensure callouts use proper styling
5. Fix FAQ section formatting (currently uses bold instead of proper headings)

### Task 7: Verify Images Folder Structure

**Action**:

- Check if `static/images/` directory exists
- Verify image paths in content match actual image locations
- Ensure all referenced images are available

## CSS Enhancements

### Image Styling

Add to `assets/css/custom.css`:

```css
/* Image Styling */
.content img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin: 1.5rem 0;
}

.content figure {
  margin: 2rem 0;
  text-align: center;
}

.content figure img {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.content figure figcaption {
  margin-top: 0.5rem;
  font-size: 0.9em;
  color: var(--tw-prose-captions);
  font-style: italic;
}
```

### Table Enhancements

Ensure tables have proper spacing and hover effects (already in CSS, verify it's working).

### Callout Color Consistency

Verify callouts use:

- `info` - Violet border (`var(--dr-migrate-violet)`)
- `tip` - Cyan border (`var(--dr-migrate-cyan)`)
- `warning` - Orange border
- `danger` - Red border

## Testing Checklist

After implementation:

- [ ] Verify no double headers appear on any page
- [ ] Check all images display correctly with proper styling
- [ ] Verify tables have violet headers and proper spacing
- [ ] Ensure callouts use brand colors consistently
- [ ] Check responsive behavior on mobile devices
- [ ] Verify dark mode compatibility
- [ ] Test all pages mentioned in the plan

## Files to Modify

1. `content/docs/_index.md`
2. `content/docs/business/_index.md`
3. `content/docs/technical/_index.md`
4. `content/docs/partners/_index.md`
5. `content/docs/overview/hosting-methods/marketplace/architecture.md`
6. `content/docs/training/workshops/workshop1.md` (review)
7. `assets/css/custom.css` (enhancements)

## Notes

- Hextra theme automatically renders frontmatter `title` as H1, so markdown H1 headings create duplicates
- Images should use Hextra `{{< figure >}}` shortcode for consistent styling
- Brand colors are defined in CSS variables and should be used consistently
- All styling should work in both light and dark modes