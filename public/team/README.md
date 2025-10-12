# Team Headshots Directory

This directory contains team member headshot images for the About page.

## Image Specifications

- **Format:** JPG or PNG
- **Size:** 512x512px (recommended) or 1:1 aspect ratio
- **Naming:** Use the team member's `id` from `/data/team.ts`
  - Example: `ceo.jpg`, `cto.jpg`, `compliance.jpg`

## Current Team Members

Based on `/data/team.ts`, you should add images for:

- `ceo.jpg` - Sarah Chen, CEO & Co-Founder
- `cto.jpg` - Michael Torres, CTO & Co-Founder
- `compliance.jpg` - David Kim, Head of Compliance
- `product.jpg` - Jessica Martinez, Head of Product
- `growth.jpg` - Alex Patel, Head of Growth
- `operations.jpg` - Emily Watson, VP of Operations & Finance
- `engineering.jpg` - James Li, Senior Engineering Lead
- `community.jpg` - Rachel Green, Community & Support Lead

## Fallback Behavior

If an image is not found, the TeamGrid component will display:
- Initials of the person's name in a colored circle
- Example: "SC" for Sarah Chen

## Adding New Team Members

1. Add the person's entry to `/data/team.ts`
2. Add their headshot image to this directory with the same `id`
3. The About page will automatically display the new member


