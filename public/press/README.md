# Press Logo Directory

This directory contains press and media outlet logos for the About page.

## Image Specifications

- **Format:** SVG (preferred) or PNG
- **Size:** Variable, but optimized for web (under 50KB each)
- **Color:** Monochrome or grayscale versions work best with dark theme
- **Naming:** Lowercase, hyphenated
  - Example: `techcrunch.svg`, `forbes.svg`, `wall-street-journal.svg`

## Current Placeholders

The About page currently shows text placeholders for:

- TechCrunch
- Forbes
- WSJ (Wall Street Journal)
- Bloomberg
- VentureBeat

## Adding Press Logos

1. Obtain logo files (ensure you have rights to use them)
2. Convert to SVG or optimize PNG files
3. Add to this directory
4. Update the Testimonials component (`/components/about/Testimonials.tsx`)
5. Replace text with `<Image>` components pointing to logo files

Example:
```tsx
<Image 
  src="/press/techcrunch.svg" 
  alt="TechCrunch logo" 
  width={120} 
  height={30}
  className="opacity-50"
/>
```

## Legal Note

Ensure you have proper rights/permissions to use press outlet logos before adding them to your production website.


