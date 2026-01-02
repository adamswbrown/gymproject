---
name: Exact Hitsona Bangor Site Replication
overview: Fix all layout and design discrepancies to exactly match the Hitsona Bangor website, including color scheme (light theme), typography, section ordering, missing components, and visual styling.
todos:
  - id: "1"
    content: Update color scheme in globals.css to light theme (white background, dark text)
    status: completed
  - id: "2"
    content: Update typography to match Effra/Helvetica font family
    status: completed
  - id: "3"
    content: Create TopHeader component with contact info bar
    status: completed
  - id: "4"
    content: Restructure hero section with left-aligned layout and Are you a good fit button
    status: completed
    dependencies:
      - "1"
      - "2"
  - id: "5"
    content: Add YouTube video embed section after hero
    status: completed
    dependencies:
      - "4"
  - id: "6"
    content: Reorder all sections to match actual site order
    status: completed
    dependencies:
      - "4"
      - "5"
  - id: "7"
    content: Add Achievements section with 5 achievement cards
    status: completed
    dependencies:
      - "6"
  - id: "8"
    content: Add Who You Are section to home page
    status: completed
    dependencies:
      - "6"
  - id: "9"
    content: Create TestimonialsCarousel component
    status: completed
    dependencies:
      - "1"
      - "2"
  - id: "10"
    content: Complete Footer with social links, Studios section, Franchise Guides
    status: completed
    dependencies:
      - "1"
      - "2"
  - id: "11"
    content: Update all page files to use light theme
    status: completed
    dependencies:
      - "1"
      - "2"
  - id: "12"
    content: Update Navbar styling for light theme
    status: completed
    dependencies:
      - "1"
      - "2"
---

#Exact Hitsona Bangor Site Replication Plan

## Critical Issues Identified

### 1. Color Scheme (CRITICAL)

- **Current**: Dark theme (black background #0B0B0B, white text)
- **Actual Site**: Light theme (white background rgb(255,255,255), dark gray text rgb(102,102,102))
- **Action**: Completely overhaul color scheme in `ui/app/globals.css`

### 2. Typography

- **Current**: Oswald (headings) + Inter (body)
- **Actual Site**: Effra, Helvetica, Arial, Lucida, sans-serif
- **Action**: Update font imports and CSS variables

### 3. Missing Top Header Bar

- **Missing**: Contact info bar above navigation (address, phone, email, "Get Directions" link)
- **Action**: Create new `TopHeader` component and add to layout

### 4. Hero Section Layout

- **Current**: Centered grid with cards
- **Actual Site**: Left-aligned feature items with images and text, "Are you a good fit?" button
- **Action**: Restructure hero section in `ui/app/page.tsx`

### 5. Missing Video Section

- **Missing**: YouTube video embed after hero section
- **Action**: Add video iframe section with YouTube embed

### 6. Section Ordering

- **Current Order**: Hero → Why Join → Results → Studio Photos → Testimonials
- **Actual Order**: Hero → Video → Why Join → Results → Testimonials → What We Offer → Coaches → Achievements → Studio Photos → Who You Are → More content → FAQs
- **Action**: Reorder all sections in `ui/app/page.tsx`

### 7. Missing Sections

- **Achievements Section**: "Our Achievements at Hitsona Bangor" with 5 achievement cards
- **Who You Are Section**: Should appear on home page (currently only on separate page)
- **Additional Content Sections**: Multiple sections about community, no mirrors policy, etc.
- **Action**: Add all missing sections to home page

### 8. Testimonials

- **Current**: Static grid
- **Actual Site**: Carousel/slider with navigation
- **Action**: Implement carousel component for testimonials

### 9. Footer

- **Missing**: Social media links (LinkedIn, Facebook, Instagram)
- **Missing**: "Studios" section with links to all locations
- **Missing**: "Franchise Guides" section
- **Missing**: "Own a Hitsona" link
- **Action**: Complete footer in `ui/components/layout/Footer.tsx`

### 10. Navigation

- **Current**: Basic navigation
- **Actual Site**: May have different styling/spacing
- **Action**: Review and match exact navigation styling

## Implementation Steps

### Step 1: Update Color Scheme & Typography

- Update `ui/app/globals.css`:
- Change background to white (#FFFFFF)
- Change text colors to dark gray (#666666)
- Update font family to Effra (or closest match: Helvetica/Arial)
- Update all CSS variables for light theme
- Adjust accent colors if needed

### Step 2: Create Top Header Component

- Create `ui/components/layout/TopHeader.tsx`:
- Dark background bar (rgb(25, 25, 25))
- Address: "Unit 54, 3 Balloo Dr, Bangor BT19 7QY"
- Phone: "07769 859348"
- Email: "g.cunningham@hitsona.com" (mailto link)
- "Get Directions" link to Google Maps

### Step 3: Restructure Home Page

- Update `ui/app/page.tsx`:
- Fix hero section layout (left-aligned features, not centered grid)
- Add "Are you a good fit?" button/link
- Add YouTube video embed section
- Reorder all sections to match actual site
- Add "Achievements" section
- Add "Who You Are" section (from separate page)
- Add all additional content sections
- Convert testimonials to carousel
- Match exact spacing and styling

### Step 4: Complete Footer

- Update `ui/components/layout/Footer.tsx`:
- Add social media icons/links (LinkedIn, Facebook, Instagram)
- Add "Studios" section with all location links
- Add "Franchise Guides" section
- Add "Own a Hitsona" link
- Match exact layout and styling

### Step 5: Create Testimonials Carousel

- Create `ui/components/ui/TestimonialsCarousel.tsx`:
- Implement carousel/slider functionality
- Add navigation arrows
- Add pagination dots
- Match styling from actual site

### Step 6: Update All Pages

- Apply light theme to all pages:
- `ui/app/why-join-us/page.tsx`
- `ui/app/what-we-offer/page.tsx`
- `ui/app/reviews/page.tsx`
- `ui/app/coaches/page.tsx`
- `ui/app/who-you-are/page.tsx`
- `ui/app/blog/page.tsx`
- `ui/app/contact-us/page.tsx`

### Step 7: Update Navigation

- Review `ui/components/layout/Navbar.tsx`:
- Match exact styling
- Ensure proper spacing and colors for light theme

### Step 8: Add Missing Content

- Extract all content from actual site:
- Achievement cards content
- Additional section content
- FAQ content (if not already present)
- All text content to match exactly

## Files to Modify

1. `ui/app/globals.css` - Complete color scheme overhaul
2. `ui/components/layout/TopHeader.tsx` - New component
3. `ui/app/page.tsx` - Major restructuring
4. `ui/components/layout/Footer.tsx` - Complete footer
5. `ui/components/ui/TestimonialsCarousel.tsx` - New component
6. `ui/components/layout/Navbar.tsx` - Style updates
7. All page files in `ui/app/` - Theme updates

## Verification

After implementation, verify:

- Exact color match (white background, dark text)
- Exact section ordering
- All missing sections present
- All images properly placed
- Typography matches