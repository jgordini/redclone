# UAB Annual Report Design Patterns

Modern, full-width page design patterns based on the UAB IT Annual Report. Use these patterns for landing pages, feature pages, and marketing-style content.

## Table of Contents
1. [Page Structure](#page-structure)
2. [Section Containers](#section-containers)
3. [Typography](#typography)
4. [Hero Sections](#hero-sections)
5. [Two-Column Layouts](#two-column-layouts)
6. [Quote Cards](#quote-cards)
7. [Stats and Metrics](#stats-and-metrics)
8. [Card Links](#card-links)
9. [Feature Card Grids](#feature-card-grids)
10. [Win/Highlight Grids](#winhighlight-grids)
11. [Safari Font Fix](#safari-font-fix)

---

## Page Structure

Full-width pages should use `layout-wide` page class and follow this structure:

```html
<!-- Section 1: White background -->
<div class="tw-bg-white tw-py-12">
  <div class="tw-max-w-7xl tw-mx-auto tw-px-6">
    <!-- Content -->
  </div>
</div>

<!-- Section 2: Gray background -->
<div class="tw-bg-smoke-gray-7 tw-py-12">
  <div class="tw-max-w-7xl tw-mx-auto tw-px-6">
    <!-- Content -->
  </div>
</div>

<!-- Continue alternating... -->
```

**Key principles:**
- Alternate `tw-bg-white` and `tw-bg-smoke-gray-7` for visual rhythm
- Consistent `tw-py-12` vertical padding on all sections
- Content wrapped in `tw-max-w-7xl tw-mx-auto tw-px-6`

---

## Section Containers

### Standard Content Section
```html
<div class="tw-bg-white tw-py-12">
  <div class="tw-max-w-7xl tw-mx-auto tw-px-6">
    <h2 class="tw-text-uab-green tw-text-4xl tw-font-bold tw-mb-8 font-kulturista">Section Title</h2>
    <p class="tw-text-lg tw-leading-relaxed">Content paragraph...</p>
  </div>
</div>
```

### Gray Background Section
```html
<div class="tw-bg-smoke-gray-7 tw-py-12">
  <div class="tw-max-w-7xl tw-mx-auto tw-px-6">
    <h2 class="tw-text-uab-green tw-text-4xl tw-font-bold tw-mb-8 font-kulturista">Section Title</h2>
    <!-- Content -->
  </div>
</div>
```

---

## Typography

### Section Headings (Kulturista)
```html
<h2 class="tw-text-uab-green tw-text-4xl tw-font-bold tw-mb-8 font-kulturista">Main Section Title</h2>
<h3 class="tw-text-uab-green tw-text-xl tw-font-bold tw-mb-4">Subsection Title</h3>
```

### Body Text
```html
<p class="tw-text-lg tw-leading-relaxed tw-mb-6">Paragraph text with good readability...</p>
<p class="tw-text-base tw-leading-relaxed tw-mb-4">Standard paragraph text...</p>
```

### Centered Heading
```html
<h2 class="tw-text-uab-green tw-text-4xl tw-font-bold tw-mb-8 tw-text-center font-kulturista">Centered Title</h2>
```

---

## Hero Sections

### Two-Column Hero with Image
```html
<div class="tw-bg-white tw-py-12">
  <div class="tw-max-w-7xl tw-mx-auto tw-px-6">
    <div class="uab-grid-two-across tw-items-center tw-gap-12">
      <div class="lg:tw-order-1 tw-order-2">
        <h1 class="tw-text-uab-green tw-text-5xl tw-font-bold tw-mb-6 font-kulturista">Page Title</h1>
        <p class="tw-text-lg tw-leading-relaxed">Introduction paragraph with key messaging...</p>
      </div>
      <div class="lg:tw-order-2 tw-order-1 tw-flex tw-justify-center tw-mb-10 lg:tw-mb-0">
        <img src="images/folder/hero-image.jpg" alt="Description" class="tw-w-full tw-max-w-md">
      </div>
    </div>
  </div>
</div>
```

### Full-Width Hero Image with Text Below
```html
<div class="tw-bg-white tw-py-12">
  <div class="tw-max-w-7xl tw-mx-auto tw-px-6">
    <h2 class="tw-text-uab-green tw-text-4xl tw-font-bold tw-mb-10 font-kulturista">Section Title</h2>
    <div class="tw-mb-12">
      <img src="images/folder/wide-image.jpg" alt="Description" class="tw-w-full tw-rounded-lg tw-shadow-xl tw-object-cover">
    </div>
    <div class="uab-grid-two-across tw-gap-12 tw-items-start">
      <div class="tw-space-y-6">
        <p class="tw-text-lg tw-leading-relaxed">Content text...</p>
        <a href="#" class="btn--green btn--md inline-block">Call to Action <i class="fas fa-arrow-right tw-ml-2"></i></a>
      </div>
      <div>
        <!-- Stats box or additional content -->
      </div>
    </div>
  </div>
</div>
```

---

## Two-Column Layouts

### Text Left, Image Right
```html
<div class="uab-grid-two-across tw-gap-12 tw-items-center">
  <div>
    <p class="tw-text-lg tw-leading-relaxed tw-mb-6">Content paragraph...</p>
    <a href="#" class="btn--green btn--md">Read More <i class="fas fa-arrow-right tw-ml-2"></i></a>
  </div>
  <div>
    <img src="images/folder/image.jpg" alt="Description" class="tw-w-full tw-rounded-lg tw-shadow-xl tw-object-cover">
  </div>
</div>
```

### Image Left, Text Right
```html
<div class="uab-grid-two-across tw-gap-12 tw-items-center">
  <div class="tw-order-2 lg:tw-order-1">
    <img src="images/folder/image.jpg" alt="Description" class="tw-w-full tw-rounded-lg tw-shadow-xl tw-object-cover">
  </div>
  <div class="tw-order-1 lg:tw-order-2">
    <p class="tw-text-lg tw-leading-relaxed tw-mb-8">Content paragraph...</p>
    <a href="#" class="btn--green btn--md">Read More <i class="fas fa-arrow-right tw-ml-2"></i></a>
  </div>
</div>
```

### Text with Link List
```html
<div class="uab-grid-two-across tw-gap-8 tw-mb-8">
  <div>
    <p class="tw-mb-6 tw-text-lg">Intro paragraph...</p>
    <p class="tw-font-bold tw-text-uab-green tw-text-xl tw-mb-2">List Heading:</p>
    <div class="list-group list-group-flush">
      <a href="#" class="list-group-item list-group-item-action list-group-item-icon-external-link">Link text here</a>
      <a href="#" class="list-group-item list-group-item-action list-group-item-icon-external-link">Another link</a>
    </div>
  </div>
  <div>
    <img src="images/folder/image.jpg" alt="Description" class="tw-w-full tw-max-w-sm tw-mx-auto">
  </div>
</div>
```

---

## Quote Cards

### Single Quote Card
```html
<div class="tw-bg-white tw-p-6 tw-rounded tw-shadow-md tw-border-l-4 tw-border-campus-green">
  <i class="fas fa-quote-left tw-text-campus-green tw-text-2xl tw-mb-4 tw-opacity-50"></i>
  <p class="tw-text-base tw-leading-relaxed tw-mb-6">Quote text goes here. Keep it meaningful and concise.</p>
  <div class="tw-border-t tw-border-smoke-gray-15 tw-pt-4">
    <p class="tw-font-bold tw-text-uab-green tw-mb-1">Person Name</p>
    <p class="tw-text-sm tw-text-smoke-gray">Title or Department</p>
  </div>
</div>
```

### Three-Column Quote Grid
```html
<div class="uab-grid-three-across tw-gap-8">
  <!-- Quote 1: Campus Green border -->
  <div class="tw-bg-white tw-p-6 tw-rounded tw-shadow-md tw-border-l-4 tw-border-campus-green">
    <i class="fas fa-quote-left tw-text-campus-green tw-text-2xl tw-mb-4 tw-opacity-50"></i>
    <p class="tw-text-base tw-leading-relaxed tw-mb-6">Quote text...</p>
    <div class="tw-border-t tw-border-smoke-gray-15 tw-pt-4">
      <p class="tw-font-bold tw-text-uab-green tw-mb-1">Name</p>
      <p class="tw-text-sm tw-text-smoke-gray">Title</p>
    </div>
  </div>
  
  <!-- Quote 2: Loyal Yellow border -->
  <div class="tw-bg-white tw-p-6 tw-rounded tw-shadow-md tw-border-l-4 tw-border-loyal-yellow">
    <i class="fas fa-quote-left tw-text-loyal-yellow tw-text-2xl tw-mb-4 tw-opacity-50"></i>
    <p class="tw-text-base tw-leading-relaxed tw-mb-6">Quote text...</p>
    <div class="tw-border-t tw-border-smoke-gray-15 tw-pt-4">
      <p class="tw-font-bold tw-text-uab-green tw-mb-1">Name</p>
      <p class="tw-text-sm tw-text-smoke-gray">Title</p>
    </div>
  </div>
  
  <!-- Quote 3: UAB Green border -->
  <div class="tw-bg-white tw-p-6 tw-rounded tw-shadow-md tw-border-l-4 tw-border-uab-green">
    <i class="fas fa-quote-left tw-text-uab-green tw-text-2xl tw-mb-4 tw-opacity-50"></i>
    <p class="tw-text-base tw-leading-relaxed tw-mb-6">Quote text...</p>
    <div class="tw-border-t tw-border-smoke-gray-15 tw-pt-4">
      <p class="tw-font-bold tw-text-uab-green tw-mb-1">Name</p>
      <p class="tw-text-sm tw-text-smoke-gray">Title</p>
    </div>
  </div>
</div>
```

---

## Stats and Metrics

### Stats Highlight Box
```html
<div class="tw-bg-campus-green-15 tw-p-8 tw-rounded-lg tw-border-l-4 tw-border-campus-green tw-h-fit">
  <div class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-3 tw-gap-8 tw-text-center">
    <div>
      <div class="tw-text-5xl tw-font-bold tw-text-uab-green tw-mb-2">88%</div>
      <div class="tw-text-smoke-gray tw-text-sm">Faster Response</div>
    </div>
    <div>
      <div class="tw-text-5xl tw-font-bold tw-text-uab-green tw-mb-2">26 min</div>
      <div class="tw-text-smoke-gray tw-text-sm">Previous Time</div>
    </div>
    <div>
      <div class="tw-text-5xl tw-font-bold tw-text-uab-green tw-mb-2">3 min</div>
      <div class="tw-text-smoke-gray tw-text-sm">Current Time</div>
    </div>
  </div>
</div>
```

### Stats Masonry Grid
```html
<div class="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-4">
  <!-- Featured stat: 2x2 -->
  <div class="tw-row-span-2 tw-col-span-2 tw-bg-uab-green tw-text-white tw-p-6 tw-rounded tw-shadow-md hover:tw-shadow-lg tw-transition-shadow tw-flex tw-flex-col tw-justify-center tw-text-center">
    <i class="fas fa-trophy tw-text-4xl tw-text-loyal-yellow tw-mb-3 tw-opacity-90"></i>
    <div class="tw-text-5xl tw-font-bold tw-mb-2">1,177</div>
    <div class="tw-text-sm tw-leading-tight tw-opacity-90">Wins from 2015-2025</div>
  </div>
  
  <!-- Regular stat -->
  <div class="tw-bg-campus-green tw-text-dragons-lair-green tw-p-4 tw-rounded tw-shadow-md hover:tw-shadow-lg tw-transition-shadow tw-text-center tw-flex tw-flex-col tw-justify-center">
    <i class="fas fa-ticket-alt tw-text-2xl tw-mb-2"></i>
    <div class="tw-text-3xl tw-font-bold tw-mb-1">61,417</div>
    <div class="tw-text-xs tw-leading-tight">Tickets Resolved</div>
  </div>
  
  <!-- Tall stat: 1x2 -->
  <div class="tw-row-span-2 tw-bg-loyal-yellow tw-text-dragons-lair-green tw-p-4 tw-rounded tw-shadow-md hover:tw-shadow-lg tw-transition-shadow tw-text-center tw-flex tw-flex-col tw-justify-center">
    <i class="fas fa-envelope tw-text-3xl tw-mb-3"></i>
    <div class="tw-text-4xl tw-font-bold tw-mb-2">20M</div>
    <div class="tw-text-sm tw-leading-tight">Emails Sent</div>
  </div>
  
  <!-- Regular stat with icon -->
  <div class="tw-bg-dragons-lair-green tw-text-white tw-p-4 tw-rounded tw-shadow-md hover:tw-shadow-lg tw-transition-shadow tw-text-center tw-flex tw-flex-col tw-justify-center">
    <i class="fas fa-shield-alt tw-text-2xl tw-text-campus-green tw-mb-2"></i>
    <div class="tw-text-3xl tw-font-bold tw-mb-1">14,399</div>
    <div class="tw-text-xs tw-leading-tight">Reported Phish</div>
  </div>
  
  <!-- Stat with left border -->
  <div class="tw-bg-campus-green-15 tw-text-uab-green tw-p-4 tw-rounded tw-shadow-md hover:tw-shadow-lg tw-transition-shadow tw-text-center tw-border-l-4 tw-border-campus-green tw-flex tw-flex-col tw-justify-center">
    <i class="fas fa-building tw-text-2xl tw-text-campus-green tw-mb-2"></i>
    <div class="tw-text-3xl tw-font-bold tw-mb-1">14</div>
    <div class="tw-text-xs tw-leading-tight">Buildings Added</div>
  </div>
</div>
```

---

## Card Links

### Card Link with Icon and Chevron
```html
<a href="#" class="tw-no-underline hover:tw-no-underline tw-block tw-bg-white tw-p-5 tw-rounded-lg hover:tw-shadow-lg tw-transition-shadow tw-border tw-border-gray-200 tw-flex tw-items-center">
  <i class="fas fa-server tw-text-campus-green tw-text-xl tw-mr-4" aria-hidden="true"></i>
  <span class="tw-font-semibold tw-text-gray-900">Link text here</span>
  <i class="fas fa-chevron-right tw-ml-auto tw-text-smoke-gray" aria-hidden="true"></i>
</a>
```

### Stacked Card Links
```html
<div class="tw-grid tw-gap-6">
  <a href="#" class="tw-no-underline hover:tw-no-underline tw-block tw-bg-white tw-p-5 tw-rounded-lg hover:tw-shadow-lg tw-transition-shadow tw-border tw-border-gray-200 tw-flex tw-items-center">
    <i class="fas fa-server tw-text-campus-green tw-text-xl tw-mr-4" aria-hidden="true"></i>
    <span class="tw-font-semibold tw-text-gray-900">First link text</span>
    <i class="fas fa-chevron-right tw-ml-auto tw-text-smoke-gray" aria-hidden="true"></i>
  </a>
  <a href="#" class="tw-no-underline hover:tw-no-underline tw-block tw-bg-white tw-p-5 tw-rounded-lg hover:tw-shadow-lg tw-transition-shadow tw-border tw-border-gray-200 tw-flex tw-items-center">
    <i class="fas fa-database tw-text-uab-green tw-text-xl tw-mr-4" aria-hidden="true"></i>
    <span class="tw-font-semibold tw-text-gray-900">Second link text</span>
    <i class="fas fa-chevron-right tw-ml-auto tw-text-smoke-gray" aria-hidden="true"></i>
  </a>
</div>
```

---

## Feature Card Grids

### Three Feature Cards with Colored Borders
```html
<div class="uab-grid-three-across tw-gap-8">
  <div class="tw-bg-white tw-p-6 tw-rounded tw-shadow-md tw-border-l-4 tw-border-campus-green">
    <h3 class="tw-text-uab-green tw-font-bold tw-text-xl tw-mb-4">Feature Title</h3>
    <p class="tw-text-base tw-leading-relaxed tw-mb-4">Feature description text...</p>
    <a href="#" class="btn btn-link tw-px-0">Learn more <i class="far fa-arrow-right tw-ml-1 tw-text-sm"></i></a>
  </div>
  <div class="tw-bg-white tw-p-6 tw-rounded tw-shadow-md tw-border-l-4 tw-border-loyal-yellow">
    <h3 class="tw-text-uab-green tw-font-bold tw-text-xl tw-mb-4">Feature Title</h3>
    <p class="tw-text-base tw-leading-relaxed tw-mb-4">Feature description text...</p>
    <a href="#" class="btn btn-link tw-px-0">Learn more <i class="far fa-arrow-right tw-ml-1 tw-text-sm"></i></a>
  </div>
  <div class="tw-bg-white tw-p-6 tw-rounded tw-shadow-md tw-border-l-4 tw-border-uab-green">
    <h3 class="tw-text-uab-green tw-font-bold tw-text-xl tw-mb-4">Feature Title</h3>
    <p class="tw-text-base tw-leading-relaxed tw-mb-4">Feature description text...</p>
    <a href="#" class="btn btn-link tw-px-0">Learn more <i class="far fa-arrow-right tw-ml-1 tw-text-sm"></i></a>
  </div>
</div>
```

---

## Win/Highlight Grids

### Four-Column Image Card Grid
```html
<div class="uab-grid-four-across tw-gap-6">
  <div class="tw-bg-smoke-gray-7 tw-p-6 tw-rounded hover:tw-shadow-lg tw-transition-shadow">
    <div class="tw-rounded tw-mb-4 tw-h-48 tw-overflow-hidden">
      <img src="images/folder/image.jpg" alt="Description" class="tw-w-full tw-h-full tw-object-cover">
    </div>
    <h3 class="tw-text-uab-green tw-font-bold tw-mb-2">Card Title</h3>
  </div>
  <!-- Repeat for additional cards -->
</div>
```

### Grid with CTA Button
```html
<div class="tw-bg-white tw-py-12">
  <div class="tw-max-w-7xl tw-mx-auto tw-px-6">
    <h2 class="tw-text-uab-green tw-text-4xl tw-font-bold tw-mb-8 font-kulturista">Section Title</h2>
    <p class="tw-mb-12">Introduction paragraph with link to <a href="#" class="tw-text-uab-green tw-underline">full content</a>.</p>
    
    <div class="uab-grid-four-across tw-gap-6">
      <!-- Cards here -->
    </div>
    
    <div class="tw-text-center tw-mt-12">
      <a href="#" class="btn--green btn--lg">View All <i class="fas fa-arrow-right tw-ml-2"></i></a>
    </div>
  </div>
</div>
```

---

## Safari Font Fix

Include this CSS at the top of pages using Kulturista headings:

```html
<style>
/* Kulturista Font Fix for Safari */
.font-kulturista {
    font-family: "kulturista-web", Georgia, "Times New Roman", serif !important;
}

[style*="Kulturista"] {
    font-family: "kulturista-web", Georgia, "Times New Roman", serif !important;
}

@supports (-webkit-touch-callout: none) {
    .font-kulturista,
    [style*="Kulturista"],
    h1[style*="font-family"],
    h2[style*="font-family"],
    h3[style*="font-family"] {
        font-family: "kulturista-web", Georgia, "Times New Roman", serif !important;
    }
}
</style>
```

---

## Best Practices Summary

1. **Alternate section backgrounds** — `tw-bg-white` and `tw-bg-smoke-gray-7`
2. **Consistent section padding** — Always `tw-py-12`
3. **Content containment** — `tw-max-w-7xl tw-mx-auto tw-px-6`
4. **Kulturista headings** — Use `font-kulturista` class
5. **Image styling** — `tw-rounded-lg tw-shadow-xl tw-object-cover`
6. **Card variety** — Rotate border colors: campus-green, loyal-yellow, uab-green
7. **Button icons** — Include `<i class="fas fa-arrow-right tw-ml-2"></i>` in CTAs
8. **Hover states** — Add `hover:tw-shadow-lg tw-transition-shadow` to interactive cards
9. **Stats emphasis** — Use large `tw-text-5xl tw-font-bold` numbers
10. **Quote styling** — Include `fa-quote-left` icon with `tw-opacity-50`
