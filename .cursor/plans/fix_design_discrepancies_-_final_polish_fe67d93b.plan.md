---
name: Fix Design Discrepancies - Final Polish
overview: "Fix remaining design discrepancies to exactly match the Hitsona Bangor site: hero background image, correct colors (green accent, white text on hero), side-by-side hero/video layout, proper container widths, and section background colors."
todos:
  - id: "1"
    content: Download hero background image and save to public/images
    status: completed
  - id: "2"
    content: Update accent color to green (#00FF00) and add hero text color variables
    status: completed
  - id: "3"
    content: "Restructure hero section: combine with video side-by-side, add background image with overlay, white H1, green H2"
    status: completed
    dependencies:
      - "1"
      - "2"
  - id: "4"
    content: Update all container max-widths to 1180px throughout site
    status: completed
  - id: "5"
    content: Apply light green background (rgb(195, 255, 195)) to appropriate sections
    status: completed
  - id: "6"
    content: Fix spacing, padding, and typography to match exact measurements
    status: completed
    dependencies:
      - "3"
      - "4"
---

# Fix Design Discrepancies - Final Polish

## Critical Design Issues Found

### 1. Hero Section Background Image (CRITICAL)

- **Current**: Plain white background

- **Actual Site**: Background image `12-min-scaled.jpg` with dark overlay (rgba(0, 0, 0, 0.25))

- **Action**: Download hero background image and apply to hero section with overlay

### 2. Hero Text Colors (CRITICAL)

- **Current**: Dark text on white

- **Actual Site**: 

- H1 is WHITE (rgb(255, 255, 255)) - on dark background

- H2 is GREEN (rgb(0, 255, 0)) - accent color is green, not what we set

- **Action**: Update hero text colors to white, update accent color to green

### 3. Hero Layout Structure (CRITICAL)

- **Current**: Hero content in one column, video in separate section below

- **Actual Site**: Hero content and video are SIDE BY SIDE in same row (two equal columns ~690px each)

- **Action**: Restructure hero to have content left, video right, in same section

### 4. Container Width

- **Current**: Using max-w-6xl (1280px) or max-w-7xl

- **Actual Site**: Container max-width is 1180px
- **Action**: Update container max-width to 1180px

### 5. Section Background Colors

- **Current**: All sections white or light gray

- **Actual Site**: Some sections have light green background (rgb(195, 255, 195))

- **Action**: Apply correct background colors to appropriate sections

### 6. Accent Color

- **Current**: Set to #00FF00 but may not be applied correctly

- **Actual Site**: Green rgb(0, 255, 0) used for H2 and accents

- **Action**: Ensure green accent color is used throughout

## Implementation Steps

### Step 1: Download Hero Background Image

- Download `https://hitsona.com/wp-content/uploads/2023/07/12-min-scaled.jpg`

- Save to `/ui/public/images/hero-background.jpg`

### Step 2: Update Color Scheme

- Update `ui/app/globals.css`:

- Ensure accent color is green: `#00FF00` or `rgb(0, 255, 0)`

- Add hero text color variable for white text

### Step 3: Restructure Hero Section

- Update `ui/app/page.tsx`:

- Combine hero and video into single section

- Use two-column layout (content left, video right)

- Add background image with dark overlay
- Change H1 to white, H2 to green

- Change feature text to white (on dark background)

### Step 4: Update Container Widths

- Change all `max-w-6xl` and `max-w-7xl` to custom 1180px max-width

- Update in all page files

### Step 5: Apply Section Background Colors

- Identify which sections have light green background

- Apply `rgb(195, 255, 195)` to appropriate sections

### Step 6: Fix Spacing and Typography

- Match exact padding/margins from actual site

- Ensure font sizes match exactly

## Files to Modify

1. `ui/app/globals.css` - Update accent color, add hero text colors

2. `ui/app/page.tsx` - Restructure hero section with background image

3. All page files - Update container widths to 1180px

4. Download and add hero background image

## Verification

After implementation, verify:

- Hero has background image with dark overlay