---
name: uab-joomla-websites
description: Build and style UAB (University of Alabama at Birmingham) web content for Joomla CMS. Use when creating HTML components, page layouts, or styling for UAB websites. Includes UAB brand colors, typography (Aktiv Grotesk, Kulturista), utility classes from uab-tailwind.css, component patterns from main.css, and Font Awesome 5 Pro icons. Outputs semantic HTML with UAB-specific CSS classes compatible with Joomla's content structure.
---

# UAB Joomla Websites Skill

Build web content for UAB Joomla websites. All sites include Font Awesome 5 Pro, uab-tailwind.css, and main.css.

## Delivery Format

When building UAB web content, always provide a structured implementation guide:

1. **Ask for image folder path** (e.g., `images/2024/project/`)
2. **Menu Item** — Title, alias, page class if needed (`layout-wide` for full-width)
3. **Article Content** — Copy-paste ready HTML code snippets
4. **Modules** — Position, title, content for any required modules
5. **WidgetKit** — Widget type, settings, content items needed
6. **Custom CSS** — Minimal `<style>` block if required (prefer `tw-` classes)

### Key Principles
- **Prioritize Tailwind** (`tw-` prefix) over custom CSS
- **Minimal custom styling** — only when necessary
- **No CSS conflicts** — scope custom styles carefully
- **Image paths**: `images/[folder]/[image].jpg`
- **Full-width pages**: Menu Item → Page Display → Page Class → `layout-wide` (no sidebar)

See `references/delivery-patterns.md` for complete examples of banners, grids, and layouts.
See `references/annual-report-patterns.md` for modern full-width page design patterns.

## Brand Colors

| Color | Hex | CSS Variable | Tailwind Class |
|-------|-----|--------------|----------------|
| UAB Green | `#1A5632` | `var(--uab-green)` | `tw-bg-uab-green`, `tw-text-uab-green` |
| Dragon's Lair Green | `#033319` | `var(--dragons-lair-green)` | `tw-bg-dragons-lair-green` |
| Campus Green | `#90D408` | `var(--campus-green)` | `tw-bg-campus-green` |
| UAB Gold/Loyal Yellow | `#FDB913` | `var(--loyal-yellow)` | `tw-bg-loyal-yellow` |
| Smoke Gray | `#808285` | `var(--smoke-gray)` | `tw-bg-smoke-gray` |
| White | `#FFFFFF` | `var(--white)` | `tw-bg-white` |

### Tint Variations
Colors have tints at 7%, 10%, 15%, 33%, 45%, and 50%. Example: `tw-bg-campus-green-15` → `#EEF9DA`

## Typography

- **Primary font**: Aktiv Grotesk (sans-serif) — body text, headings, buttons
- **Accent font**: Kulturista (serif) — decorative headings, emphasis
- Base font size: 18px for body text (`p`, `li`)
- Headings use UAB Green (`#1A5632`)

### Kulturista Font (Safari Fix)
Always use the `font-kulturista` class for Kulturista headings to ensure Safari compatibility:
```html
<h2 class="tw-text-uab-green tw-text-4xl tw-font-bold tw-mb-8 font-kulturista">Section Title</h2>
```

Include this CSS in your page for Safari compatibility:
```css
.font-kulturista {
    font-family: "kulturista-web", Georgia, "Times New Roman", serif !important;
}
```

## Page Section Structure (Recommended)

For full-width pages, use this consistent section structure:

```html
<!-- Section with white background -->
<div class="tw-bg-white tw-py-12">
  <div class="tw-max-w-7xl tw-mx-auto tw-px-6">
    <!-- Content here -->
  </div>
</div>

<!-- Section with gray background -->
<div class="tw-bg-smoke-gray-7 tw-py-12">
  <div class="tw-max-w-7xl tw-mx-auto tw-px-6">
    <!-- Content here -->
  </div>
</div>
```

**Key patterns:**
- Alternate between `tw-bg-white` and `tw-bg-smoke-gray-7` for visual rhythm
- Always use `tw-py-12` for consistent vertical spacing
- Wrap content in `tw-max-w-7xl tw-mx-auto tw-px-6` for proper containment

## Tailwind Utility Classes

All Tailwind classes use `tw-` prefix to avoid conflicts. Key patterns:

```html
<!-- Layout -->
<div class="tw-container">...</div>
<div class="tw-flex tw-items-center tw-justify-between">...</div>
<div class="uab-grid-two-across">...</div>  <!-- 2-column grid -->
<div class="uab-grid-three-across">...</div> <!-- 3-column grid -->
<div class="uab-grid-four-across">...</div>  <!-- 4-column grid -->

<!-- Modern section wrapper -->
<div class="tw-max-w-7xl tw-mx-auto tw-px-6">...</div>

<!-- Spacing: tw-p-{0-96}, tw-m-{0-96}, tw-gap-{size} -->
<div class="tw-p-6 tw-mb-4">...</div>

<!-- Colors -->
<div class="tw-bg-uab-green tw-text-white">...</div>
<div class="tw-bg-campus-green-15 tw-text-uab-green">...</div>

<!-- Responsive: sm:, md:, lg:, xl: prefixes -->
<div class="tw-w-full md:tw-w-1/2 lg:tw-w-1/3">...</div>

<!-- Shadows and transitions -->
<div class="tw-shadow-md hover:tw-shadow-lg tw-transition-shadow">...</div>
```

## CSS Frameworks

UAB sites include **Bootstrap 5** and **UIkit** alongside UAB custom styles. See `references/frameworks.md` for complete documentation.

| Framework | Prefix | Common Uses |
|-----------|--------|-------------|
| UAB Tailwind | `tw-` | Colors, spacing, layout |
| Bootstrap 5 | (none) | Forms, modals, accordions, tables |
| UIkit | `uk-` | Lightbox, animations, WidgetKit |

**Priority**: Use UAB classes first for brand consistency, then Bootstrap/UIkit for interactive components.

## Component Reference

See `references/components.md` for complete component patterns including:
- Buttons (primary, outline, sizes)
- Callouts and focus boxes
- Cards and button grids
- Navigation patterns
- Badges and icons
- Accordions/collapse
- Tables and lists

See `references/annual-report-patterns.md` for modern patterns including:
- Quote cards with colored borders
- Stats grids and highlight boxes
- Card link rows with icons
- Hero sections with two-column layouts

## Template Positions

See `references/template-positions.md` for Joomla module positions. Key positions:

| Position | Use |
|----------|-----|
| `top` | Full-width above content and sidebars |
| `upper` | Above content only |
| `lower` | Below content only |
| `bottom` | Full-width below content and sidebars |
| `leftupper` / `leftlower` | Left sidebar (above/below content on mobile) |
| `rightupper` / `rightlower` | Right rail (above/below content on mobile) |

**Note**: Cannot have both left and right rails on same page. Reserved positions (`banner`, `breadcrumbs`, `ribbon`, `search`, `sidebar`, `footer`) are for specific purposes only.

## WidgetKit

See `references/widgetkit.md` for WidgetKit widget documentation. Most commonly used:

| Widget | Use Case |
|--------|----------|
| **Grid** | Card layouts, filterable content, team directories |
| **Grid Stack** | Alternating image/content rows, feature sections |

Grid supports tag-based filtering. Grid Stack alternates image position (left/right) across items.

## Font Awesome 5 Pro Icons

```html
<!-- Basic usage -->
<i class="fas fa-home"></i>      <!-- solid -->
<i class="far fa-calendar"></i>  <!-- regular -->
<i class="fal fa-arrow-right"></i> <!-- light -->

<!-- Common UAB patterns -->
<a href="#" class="uab-icon-external-link">External Link</a>
<a href="#" class="uab-icon-arrow">Learn More</a>
<a href="file.pdf" class="uab-icon-pdf">Download PDF</a>

<!-- Icon with button -->
<a href="#" class="btn--green btn--md">Read More <i class="fas fa-arrow-right tw-ml-2"></i></a>
```

## Joomla Integration Notes

1. **Image paths**: Always use `images/[folder]/[filename].jpg` format
2. **Full-width pages**: Set Page Class to `layout-wide` (no sidebar allowed)
3. **WidgetKit**: Embed with `[widgetkit id="XX"]` in article content
4. **Modules**: Specify position, title, and content separately
5. **No inline styles**: Prefer `tw-` classes; scope custom CSS with unique class names
6. **Accessibility**: Include alt text, ARIA labels, focus states

## Quick Start Examples

### Modern Page Section
```html
<div class="tw-bg-white tw-py-12">
  <div class="tw-max-w-7xl tw-mx-auto tw-px-6">
    <h2 class="tw-text-uab-green tw-text-4xl tw-font-bold tw-mb-8 font-kulturista">Section Title</h2>
    <p class="tw-text-lg tw-leading-relaxed">Content with proper sizing and line height.</p>
    <a href="#" class="btn--green btn--md">Learn More <i class="fas fa-arrow-right tw-ml-2"></i></a>
  </div>
</div>
```

### Two-Column Layout with Image
```html
<div class="tw-bg-smoke-gray-7 tw-py-12">
  <div class="tw-max-w-7xl tw-mx-auto tw-px-6">
    <h2 class="tw-text-uab-green tw-text-4xl tw-font-bold tw-mb-8 font-kulturista">Section Title</h2>
    <div class="uab-grid-two-across tw-gap-12 tw-items-center">
      <div>
        <p class="tw-text-lg tw-leading-relaxed tw-mb-6">Content paragraph here...</p>
        <a href="#" class="btn--green btn--md">Read More <i class="fas fa-arrow-right tw-ml-2"></i></a>
      </div>
      <div>
        <img src="images/folder/image.jpg" alt="Description" class="tw-w-full tw-rounded-lg tw-shadow-xl tw-object-cover">
      </div>
    </div>
  </div>
</div>
```

### Feature Cards with Colored Borders
```html
<div class="uab-grid-three-across tw-gap-8">
  <div class="tw-bg-white tw-p-6 tw-rounded tw-shadow-md tw-border-l-4 tw-border-campus-green">
    <h3 class="tw-text-uab-green tw-font-bold tw-text-xl tw-mb-4">Card Title</h3>
    <p class="tw-text-base tw-leading-relaxed tw-mb-4">Card content here...</p>
    <a href="#" class="btn btn-link tw-px-0">Learn more <i class="far fa-arrow-right tw-ml-1 tw-text-sm"></i></a>
  </div>
  <div class="tw-bg-white tw-p-6 tw-rounded tw-shadow-md tw-border-l-4 tw-border-loyal-yellow">
    <!-- Second card -->
  </div>
  <div class="tw-bg-white tw-p-6 tw-rounded tw-shadow-md tw-border-l-4 tw-border-uab-green">
    <!-- Third card -->
  </div>
</div>
```

### Quote Card
```html
<div class="tw-bg-white tw-p-6 tw-rounded tw-shadow-md tw-border-l-4 tw-border-campus-green">
  <i class="fas fa-quote-left tw-text-campus-green tw-text-2xl tw-mb-4 tw-opacity-50"></i>
  <p class="tw-text-base tw-leading-relaxed tw-mb-6">Quote text goes here...</p>
  <div class="tw-border-t tw-border-smoke-gray-15 tw-pt-4">
    <p class="tw-font-bold tw-text-uab-green tw-mb-1">Person Name</p>
    <p class="tw-text-sm tw-text-smoke-gray">Title or Department</p>
  </div>
</div>
```

### Stats Highlight Box
```html
<div class="tw-bg-campus-green-15 tw-p-8 tw-rounded-lg tw-border-l-4 tw-border-campus-green">
  <div class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-3 tw-gap-8 tw-text-center">
    <div>
      <div class="tw-text-5xl tw-font-bold tw-text-uab-green tw-mb-2">88%</div>
      <div class="tw-text-smoke-gray tw-text-sm">Stat Label</div>
    </div>
    <div>
      <div class="tw-text-5xl tw-font-bold tw-text-uab-green tw-mb-2">26</div>
      <div class="tw-text-smoke-gray tw-text-sm">Stat Label</div>
    </div>
    <div>
      <div class="tw-text-5xl tw-font-bold tw-text-uab-green tw-mb-2">3 min</div>
      <div class="tw-text-smoke-gray tw-text-sm">Stat Label</div>
    </div>
  </div>
</div>
```

### Card Link with Icon
```html
<a href="#" class="tw-no-underline hover:tw-no-underline tw-block tw-bg-white tw-p-5 tw-rounded-lg hover:tw-shadow-lg tw-transition-shadow tw-border tw-border-gray-200 tw-flex tw-items-center">
  <i class="fas fa-server tw-text-campus-green tw-text-xl tw-mr-4" aria-hidden="true"></i>
  <span class="tw-font-semibold tw-text-gray-900">Link Text Here</span>
  <i class="fas fa-chevron-right tw-ml-auto tw-text-smoke-gray" aria-hidden="true"></i>
</a>
```

## Best Practices

1. **Color contrast**: Always ensure sufficient contrast (UAB Green on white, white on UAB Green)
2. **Consistent spacing**: Use Tailwind spacing scale (4, 6, 8, 12, 16, etc.)
3. **Responsive images**: Use `tw-w-full tw-rounded-lg tw-shadow-xl tw-object-cover` for hero images
4. **Link styling**: Links inherit Evergreen color; use button classes for CTAs
5. **Heading hierarchy**: Maintain proper h1→h6 order for accessibility
6. **Section rhythm**: Alternate `tw-bg-white` and `tw-bg-smoke-gray-7` backgrounds
7. **Card variety**: Use different colored left borders (`tw-border-campus-green`, `tw-border-loyal-yellow`, `tw-border-uab-green`) for visual interest
8. **Safari fonts**: Always use `font-kulturista` class for Kulturista headings
