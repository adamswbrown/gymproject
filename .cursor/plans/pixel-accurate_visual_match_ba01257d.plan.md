---
name: Pixel-Accurate Visual Match
overview: Rebuild the Hitsona Bangor site as a pixel-accurate visual specification by updating CSS variables, typography scale, spacing tokens, and refactoring public pages to match exact measurements from the live site.
todos: []
---

# Pixel-Accurate Visual Match Implementation Plan

## PHASE 1: Visual Audit Summary

Based on comprehensive browser evaluation of https://hitsona.com/bangor/, the following specifications have been documented:

### Typography Scale
- **Body**: 17px, line-height 28.9px, color rgb(102, 102, 102)
- **H1**: 42px, 700 weight, 50.4px line-height, uppercase, white (hero) / black (other)
- **H2**: 22px, 700 weight, 22px line-height, uppercase, green rgb(0, 255, 0)
- **H3**: 17px, 700 weight, 17px line-height
- **H4**: 18px, 700 weight, 18px line-height
- **Font Family**: Effra, Helvetica, Arial, Lucida, sans-serif (we use Helvetica/Arial/Lucida)

### Color Palette
- **Background Primary**: rgb(255, 255, 255)
- **Background Dark**: rgb(25, 25, 25) - navbar
- **Background Dark Section**: rgb(36, 36, 36)
- **Background Light Green**: rgb(195, 255, 195)
- **Background Very Light Green**: rgb(244, 255, 244)
- **Background Light Gray**: rgb(232, 232, 232)
- **Background Light Gray Alt**: rgb(229, 229, 229)
- **Text Primary**: rgb(102, 102, 102)
- **Text Dark**: rgb(10, 10, 10)
- **Text Light**: rgb(255, 255, 255)
- **Accent Primary**: rgb(0, 255, 0) - green
- **Button Primary BG**: rgb(0, 229, 3)
- **Button Primary Text**: rgba(36, 36, 36, 0.86)
- **Button Secondary BG**: rgb(36, 36, 36)
- **Button Secondary Text**: rgb(195, 255, 195)

### Spacing & Layout
- **Container Max Width**: 1180px (already set)
- **Section Padding**: Most sections use 29px top/bottom, 0px left/right
- **Hero Section**: 5px top/bottom, 0px left/right
- **Navbar Height**: 84px
- **Top Header**: Dark background, 17px font size

### Button Specifications
- **Font Size**: 20px
- **Font Weight**: 700
- **Padding**: 6px top/bottom, 20px left/right
- **Border Radius**: 3px
- **Text Transform**: none (not uppercase)

### Section Order (Home Page)
1. Hero (with video) - 5px padding
2. Why Join Us - 29px padding, white bg
3. Results Guarantee - 30px/25px padding, light green bg
4. Testimonials - 22px/29px padding, white bg
5. What We Offer - 29px padding, very light green bg
6. Coaches - 29px padding, white bg
7. Achievements - 0px padding, light gray bg
8. Inside Hitsona - 29px padding, dark section bg
9. Good Fit - 0px padding, light gray bg
10. Get Results Guarantee - 0px padding, dark section bg
11. Find Fun in Exercise - 0px padding, light gray alt bg
12. Unmatched Support - 0px padding, dark section bg
13. No Mirrors - 0px padding, light gray bg
14. What Makes Different - 29px padding, very light green bg

## PHASE 2: Token Lock-In

### Update [ui/app/globals.css](ui/app/globals.css)
- Add typography scale CSS variables:
  - `--font-size-body: 17px`
  - `--line-height-body: 28.9px`
  - `--font-size-h1: 42px`
  - `--line-height-h1: 50.4px`
  - `--font-size-h2: 22px`
  - `--line-height-h2: 22px`
  - `--font-size-h3: 17px`
  - `--line-height-h3: 17px`
  - `--font-size-h4: 18px`
  - `--line-height-h4: 18px`
- Update button color variables:
  - `--color-button-primary-bg: rgb(0, 229, 3)`
  - `--color-button-primary-text: rgba(36, 36, 36, 0.86)`
  - `--color-button-secondary-bg: rgb(36, 36, 36)`
  - `--color-button-secondary-text: rgb(195, 255, 195)`
- Add spacing variables:
  - `--spacing-section-default: 29px` (top/bottom)
  - `--spacing-section-hero: 5px` (top/bottom)
  - `--spacing-container-horizontal: 0px`
- Update navbar height variable:
  - `--navbar-height: 84px`

## PHASE 3: Component Updates

### Update [ui/components/ui/ActionButton.tsx](ui/components/ui/ActionButton.tsx)
- Change font size to 20px
- Change padding to 6px top/bottom, 20px left/right
- Change border radius to 3px
- Remove uppercase text transform
- Update colors to use new button color variables
- Ensure font weight is 700

### Update [ui/components/layout/Navbar.tsx](ui/components/layout/Navbar.tsx)
- Set navbar height to 84px
- Update background color to rgb(25, 25, 25)
- Update nav link colors to green rgb(0, 255, 0)
- Set nav link font size to 17px
- Set nav link font weight to 500
- Ensure logo sizing matches (approximately 245px width, 71px height)

### Update [ui/components/layout/TopHeader.tsx](ui/components/layout/TopHeader.tsx)
- Verify font size is 17px
- Ensure background is dark rgb(25, 25, 25)
- Ensure text color is white

## PHASE 4: Page Rebuilds

### Update [ui/app/page.tsx](ui/app/page.tsx)
- **Hero Section**: 
  - Update H1 to 42px, 50.4px line-height (currently 38px, 45.6px)
  - Ensure padding is exactly 5px top/bottom, 0px left/right
- **All Sections**: 
  - Apply exact padding values from audit (29px for most, 0px for some)
  - Ensure background colors match exactly
  - Verify section order matches specification
  - Update H2 to 22px, 22px line-height, uppercase, green
  - Update body text to 17px, 28.9px line-height
- **Typography**: 
  - Replace all inline font sizes with CSS variable references
  - Ensure all headings use correct weights and line heights

### Update [ui/app/schedule/page.tsx](ui/app/schedule/page.tsx)
- Apply same typography scale
- Ensure spacing matches design system
- Update button styling to match ActionButton specs
- Verify container max-width and padding

### Update [ui/app/(auth)/login/page.tsx](ui/app/(auth)/login/page.tsx)
- Apply same typography scale
- Ensure spacing matches design system
- Update button styling to match ActionButton specs
- Verify container max-width and padding

### Update [ui/app/why-join-us/page.tsx](ui/app/why-join-us/page.tsx)
- Apply exact section padding (20px top/bottom based on current implementation)
- Update typography to match scale
- Ensure button styling matches

## PHASE 5: Responsive Verification

- Test at mobile breakpoint (< 768px)
- Test at tablet breakpoint (768px - 1024px)
- Test at desktop breakpoint (> 1024px)
- Verify hero section switches from 2-column to 1-column on mobile
- Ensure all spacing compresses appropriately
- Verify buttons remain tappable on mobile
- Check typography scales correctly

## Implementation Notes

- **Font Family**: We're using Helvetica/Arial/Lucida as fallbacks since Effra is a premium font. This is acceptable.
- **H1 Size Discrepancy**: Current implementation uses 38px, specification requires 42px. Must update.
- **Button Text Transform**: Current buttons use uppercase, specification shows none. Must remove.
- **Section Padding**: Many sections currently use generic Tailwind classes. Must replace with exact pixel values.
- **Navbar Colors**: Navbar links should be green, not dark text color.
- **Button Colors**: Primary button should be rgb(0, 229, 3) with dark text, not green with white text.

## Files to Change

1. `ui/app/globals.css` - Add typography and spacing variables
2. `ui/components/ui/ActionButton.tsx` - Update to exact button specs
3. `ui/components/layout/Navbar.tsx` - Update height, colors, typography
4. `ui/components/layout/TopHeader.tsx` - Verify styling matches
5. `ui/app/page.tsx` - Rebuild with exact spacing and typography
6. `ui/app/schedule/page.tsx` - Apply design system
7. `ui/app/(auth)/login/page.tsx` - Apply design system
8. `ui/app/why-join-us/page.tsx` - Verify and update if needed

## Ambiguities Flagged

- **Top Header Height**: Browser evaluation returned 14073.8px which is clearly wrong (likely measured entire page). Need to manually verify actual top header bar height.
- **Responsive Breakpoints**: Media queries found but specific breakpoint values need verification through responsive testing.
- **Logo Exact Dimensions**: Logo width/height may need adjustment based on visual comparison.
- **Section Padding Variations**: Some sections use 0px padding while others use 29px. Need to verify each section individually matches specification.