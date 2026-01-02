---
name: Complete Layout Match - Exact Structure
overview: "Fix all remaining design and layout discrepancies to exactly match the Hitsona Bangor site: correct section padding, add missing sections, fix image sizes, and ensure layout structure (column widths, container usage, grid layouts) matches exactly."
todos:
  - id: "1"
    content: Add missing color variables (dark section, light gray alt) to globals.css
    status: completed
  - id: "2"
    content: Fix all section padding values to match exact measurements (remove py-16/px-4, use specific top/bottom values, 0px left/right)
    status: completed
    dependencies:
      - "1"
  - id: "3"
    content: Fix hero feature item image sizes from 60px to 30px
    status: completed
  - id: "4"
    content: "Fix layout structure: hero two equal columns (~690px), testimonials no container, results guarantee no container"
    status: completed
  - id: "5"
    content: Add missing 'Inside Hitsona Bangor' section with dark background (20px top/bottom padding)
    status: completed
    dependencies:
      - "1"
  - id: "6"
    content: Add missing 'Get Results or 100% Money-Back Guarantee!' section with dark background
    status: completed
    dependencies:
      - "1"
  - id: "7"
    content: Add missing 'We promise you will find fun in exercise' section with light gray background
    status: completed
    dependencies:
      - "1"
  - id: "8"
    content: Verify all section backgrounds, padding, layout structures, and container usage match exactly
    status: completed
    dependencies:
      - "2"
      - "3"
      - "4"
      - "5"
      - "6"
      - "7"
---

# Comp

lete Layout Match - Exact Structure

## Critical Discrepancies Found

### 1. Section Padding Values (CRITICAL)

- **Current**: Using generic `py-16` (64px) for most sections

- **Actual Site**: Each section has specific padding:

- Hero: 5px top/bottom, 0px left/right

- "Why Join": 20px top/bottom, 0px left/right

- "Results Guarantee": 30px top, 25px bottom, 0px left/right

- "What we offer": 20px top/bottom, 0px left/right

- "Achievements": 0px padding all sides

- "Inside Hitsona": 20px top/bottom, 0px left/right (dark background)

- "ARE YOU A GOOD FIT": 0px padding all sides

### 2. Missing Dark Sections (CRITICAL)

- **Missing**: "Inside Hitsona Bangor" section with dark background `rgb(36, 36, 36)`

- **Missing**: "Get Results or 100% Money-Back Guarantee!" section with dark background `rgb(36, 36, 36)`

- **Missing**: "We promise you will find fun in exercise" section with light gray `rgb(229, 229, 229)`

### 3. Feature Item Image Sizes (CRITICAL)

- **Current**: Using 60px x 60px images

- **Actual Site**: Hero feature items use 30px x 30px images (much smaller)

### 4. Layout Structure (CRITICAL)

- **Hero Section**: Uses two equal-width columns (~690px each), needs proper layout structure

- **What we offer**: Has complex column structure (13 columns detected), not simple 3-column grid

- **Testimonials**: No container wrapper - content directly in section (containerDisplay: null)

- **Section structure**: Original uses table-based layouts, but we should match visual appearance with modern CSS

### 5. Container Usage

- Some sections have containers, some don't

- "Results Guarantee" section: hasContainer: false

- "Testimonials" section: containerDisplay: null

- Need to match container usage exactly

### 6. Section Background Colors

- Need to add dark background color variable: `rgb(36, 36, 36)`

- Need to add another light gray: `rgb(229, 229, 229)`

## Implementation Steps

### Step 1: Add Missing Color Variables

- Update `ui/app/globals.css`:

- Add `--color-bg-dark-section: rgb(36, 36, 36)`

- Add `--color-bg-light-gray-alt: rgb(229, 229, 229)`

### Step 2: Fix Section Padding

- Update all sections in `ui/app/page.tsx` to use exact padding values:
- Remove `py-16` and `px-4` from sections

- Apply specific padding values inline (top/bottom only, 0px left/right)

- Move horizontal padding to container divs where appropriate

### Step 3: Fix Feature Item Image Sizes

- Change hero feature item images from 60px to 30px width/height

### Step 4: Fix Layout Structure

- Hero section: Ensure two equal columns using proper layout (match ~690px width each)

- What we offer: Match the actual column/card layout structure

- Testimonials: Remove container wrapper, place content directly in section

- Ensure column widths match exactly

### Step 5: Add Missing Sections

- Add "Inside Hitsona Bangor" section with dark background (20px top/bottom padding)

- Add "Get Results or 100% Money-Back Guarantee!" section with dark background

- Add "We promise you will find fun in exercise" section with light gray background

### Step 6: Fix Container Usage

- Remove container from "Results Guarantee" section

- Remove container from "Testimonials" section

- Ensure container usage matches exactly

## Files to Modify

1. `ui/app/globals.css` - Add missing color variables

2. `ui/app/page.tsx` - Fix all section padding, image sizes, layout structure, add missing sections, fix container usage

## Verification Checklist

After implementation:

- [ ] Hero section: 5px top/bottom padding, two equal columns (~690px each)

- [ ] All sections: 0px left/right padding on section element

- [ ] Feature items: 30px x 30px images

- [ ] "Inside Hitsona" section exists with dark background, 20px top/bottom padding

- [ ] "Get Results" section exists with dark background

- [ ] "We promise" section exists with light gray background

- [ ] All section padding values match exactly