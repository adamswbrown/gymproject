---
name: Complete Design Match - Final Fixes
overview: "Fix all remaining design discrepancies to exactly match the Hitsona Bangor site: correct section padding values, add missing dark sections, fix feature item image sizes, and ensure all spacing matches exactly."
todos:
  - id: "1"
    content: Add missing color variables (dark section, light gray alt) to globals.css
    status: pending
  - id: "2"
    content: Fix all section padding values to match exact measurements (remove py-16, use specific values)
    status: pending
    dependencies:
      - "1"
  - id: "3"
    content: Fix hero feature item image sizes from 60px to 30px
    status: pending
  - id: "4"
    content: Add missing 'Inside Hitsona Bangor' section with dark background
    status: pending
    dependencies:
      - "1"
  - id: "5"
    content: Add missing 'Get Results or 100% Money-Back Guarantee!' section
    status: pending
    dependencies:
      - "1"
  - id: "6"
    content: Add missing 'We promise you will find fun in exercise' section
    status: pending
    dependencies:
      - "1"
  - id: "7"
    content: Verify all section backgrounds and padding match exactly
    status: pending
    dependencies:
      - "2"
      - "3"
      - "4"
      - "5"
      - "6"
---

# Complete De

sign Match - Final Fixes

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

### 4. Section Background Colors

- Need to add dark background color variable: `rgb(36, 36, 36)`

- Need to add another light gray: `rgb(229, 229, 229)`

### 5. Container Padding

- All sections have 0px left/right padding on the section itself

- Padding is applied inside the container div, not the section

## Implementation Steps

### Step 1: Add Missing Color Variables

- Update `ui/app/globals.css`:

- Add `--color-bg-dark-section: rgb(36, 36, 36)`

- Add `--color-bg-light-gray-alt: rgb(229, 229, 229)`

### Step 2: Fix Section Padding

- Update all sections in `ui/app/page.tsx` to use exact padding values:

- Remove `py-16` and `px-4` from sections

- Apply specific padding values inline

- Move padding to container divs where appropriate

### Step 3: Fix Feature Item Image Sizes

- Change hero feature item images from 60px to 30px width/height

### Step 4: Add Missing Sections

- Add "Inside Hitsona Bangor" section with dark background

- Add "Get Results or 100% Money-Back Guarantee!" section

- Add "We promise you will find fun in exercise" section

### Step 5: Verify All Section Backgrounds

- Ensure all section backgrounds match exactly

- Check padding values match exactly

## Files to Modify

1. `ui/app/globals.css` - Add missing color variables

2. `ui/app/page.tsx` - Fix all section padding, image sizes, add missing sections

## Verification Checklist

After implementation:

- [ ] Hero section: 5px top/bottom padding

- [ ] All sections: 0px left/right padding on section element

- [ ] Feature items: 30px x 30px images

- [ ] "Inside Hitsona" section exists with dark background

- [ ] "Get Results" section exists with dark background

- [ ] "We promise" section exists with light gray background