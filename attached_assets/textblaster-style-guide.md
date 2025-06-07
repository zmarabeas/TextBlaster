# TextBlaster CRM Style Guide

## Brand Overview

TextBlaster CRM is a lightweight, human-centered customer relationship management system focused on helping small businesses maintain personal connections with clients through simple messaging capabilities.

Our design philosophy emphasizes:
- Simplicity and ease of use
- Human connection over complexity
- A clean, futuristic aesthetic
- Mobile-first functionality
- Minimal yet delightful interactions

## Logo

The TextBlaster logo features a retro-futuristic raygun on a vibrant yellow circular background. This playful yet tech-forward design establishes our unique brand identity.

## Typography

We use a dual-typeface system that balances personality with readability:

### Primary Typefaces

**Space Grotesk** - For headlines, feature titles, and emphasis
- Modern with subtle geometric qualities
- Technical feel with personality
- Used for H1-H3 headings and key UI elements

**Inter** - For body text and UI elements
- Highly readable at all sizes
- Designed specifically for screens
- Clean, neutral character that works well in interfaces

### Type Scale

| Element | Font | Weight | Size (Desktop) | Size (Mobile) |
|---------|------|--------|----------------|---------------|
| H1 | Space Grotesk | 700 | 2.5rem (40px) | 2rem (32px) |
| H2 | Space Grotesk | 700 | 2rem (32px) | 1.75rem (28px) |
| H3 | Space Grotesk | 600 | 1.5rem (24px) | 1.25rem (20px) |
| H4 | Space Grotesk | 600 | 1.25rem (20px) | 1.125rem (18px) |
| Body | Inter | 400 | 1rem (16px) | 1rem (16px) |
| Small | Inter | 400 | 0.875rem (14px) | 0.875rem (14px) |
| Button | Inter | 500 | 0.875rem (14px) | 0.875rem (14px) |
| Caption | Inter | 400 | 0.75rem (12px) | 0.75rem (12px) |

### Type Principles

1. **Hierarchy** - Clear typographic hierarchy guides users through the interface
2. **Readability** - Proper line height (1.5 for body text) and letter spacing
3. **Consistency** - Consistent use of type styles across the application
4. **Emphasis** - Strategic use of weight and size for emphasis, not color

## Color Palette

Our Retro-Futuristic palette balances the playful energy of our logo with a professional appearance suitable for a business application.

### Primary Colors

- **Primary:** #FFD600 (Raygun Yellow)
  - Used sparingly for key brand moments and emphasis
  - Our brand identifier, but not dominant in the interface

- **Secondary:** #2D2A24 (Raygun Dark)
  - Used for primary text and important UI elements
  - Provides strong contrast against light backgrounds

- **Background:** #FAFAFA (Paper White)
  - Primary background color
  - Creates a clean, focused canvas for content

### Accent Colors

- **Accent:** #7B2CBF (Purple)
  - Used for primary buttons and interactive elements
  - Provides a retro-futuristic feel

- **Tertiary:** #3A86FF (Blue)
  - Used for links and secondary actions
  - Complements the primary accent

### Feedback Colors

- **Success:** #06D6A0 (Teal)
  - Used for success states and positive feedback
  - Modern take on traditional green

- **Warning:** #FFBE0B (Amber)
  - Used for warnings and alerts
  - Attention-grabbing without being alarming

- **Error:** #EF476F (Pink Red)
  - Used for error states and critical alerts
  - Softer than traditional red but still effective

### Neutral Colors

- **Neutral-100:** #F3F4F6
- **Neutral-200:** #E5E7EB
- **Neutral-300:** #D1D5DB
- **Neutral-400:** #9CA3AF
- **Neutral-500:** #6B7280
- **Neutral-600:** #4B5563
- **Neutral-700:** #374151
- **Neutral-800:** #1F2937
- **Neutral-900:** #111827

### Color Usage Principles

1. **Restraint** - Yellow is used sparingly as an accent, not a dominant color
2. **Contrast** - Maintain WCAG AA contrast ratio (at minimum) for all text
3. **Hierarchy** - Colors reinforce visual hierarchy and guide user attention
4. **Consistency** - Consistent meaning attached to each color (e.g., purple for primary actions)
5. **Accessibility** - Color is never the sole indicator of meaning

## UI Components

### Buttons

**Primary Button**
- Background: #7B2CBF (Purple)
- Text: White
- Hover: #6A24A6 (Darker Purple)
- Active: #5C1E8F (Even Darker Purple)
- Rounded corners (8px)
- Subtle shadow on hover

**Secondary Button**
- Background: White
- Border: 1px solid #2D2A24 (Raygun Dark)
- Text: #2D2A24 (Raygun Dark)
- Hover: #F3F4F6 (Neutral-100)
- Rounded corners (8px)

**Tertiary Button / Text Button**
- No background
- Text: #3A86FF (Blue)
- Hover: #2563EB (Darker Blue)
- No border

### Cards

- Background: White
- Border: 1px solid #E5E7EB (Neutral-200)
- Border Radius: 8px
- Shadow: subtle, only when elevated (0 4px 6px rgba(0, 0, 0, 0.05))
- Padding: 16px (consistent across the application)

### Form Elements

**Text Inputs**
- Border: 1px solid #D1D5DB (Neutral-300)
- Border Radius: 6px
- Focus: Border color #7B2CBF (Purple), subtle glow
- Error: Border color #EF476F (Pink Red)
- Background: White
- Text: #2D2A24 (Raygun Dark)

**Checkboxes and Radio Buttons**
- Selected: #7B2CBF (Purple)
- Border: 1px solid #D1D5DB (Neutral-300)
- Background: White

**Dropdowns**
- Same styling as text inputs
- Dropdown background: White
- Selected item: Highlighted with #F3F4F6 (Neutral-100)

### Messaging Components

**Message Bubbles - Outgoing**
- Background: #7B2CBF (Purple)
- Text: White
- Border Radius: 18px with asymmetry (flatter on sender side)

**Message Bubbles - Incoming**
- Background: #F3F4F6 (Neutral-100)
- Text: #2D2A24 (Raygun Dark)
- Border Radius: 18px with asymmetry (flatter on sender side)

**New Message Indicator**
- Color: #FFD600 (Raygun Yellow)
- Small dot indicator

### Navigation

**Primary Navigation**
- Background: White
- Active item: #7B2CBF (Purple) indicator
- Text: #2D2A24 (Raygun Dark)
- Active Text: #7B2CBF (Purple)

**Mobile Navigation**
- Bottom tab bar
- Selected: #7B2CBF (Purple)
- Unselected: #6B7280 (Neutral-500)
- Background: White

## Icons and Imagery

### Icons
- Line style (not filled)
- 1.5px stroke weight
- Rounded caps and corners
- Consistent 24x24 size (16x16 for small UI elements)
- Color: #2D2A24 (Raygun Dark) or contextual (match text color)

### Illustrations
- Simple, line-based illustrations
- Limited color palette from brand colors
- Focus on human connection themes
- Clean, minimal style without excessive detail

## Layout and Spacing

### Grid System
- 12-column grid for desktop layouts
- Single column layouts for mobile views
- Content area maximum width: 1200px
- Container padding: 16px mobile, 32px desktop

### Spacing System
- Based on 4px increments
- Key values:
  - 4px (extra small)
  - 8px (small)
  - 16px (medium)
  - 24px (large)
  - 32px (extra large)
  - 48px (2x large)
  - 64px (3x large)

### White Space
- Generous white space to create a clean, focused interface
- Section spacing: minimum 32px between major sections
- Card spacing: 16px between cards
- List item spacing: 12px between items

## Responsive Behavior

- Mobile-first design approach
- Breakpoints:
  - Small (mobile): 0-639px
  - Medium (tablet): 640px-1023px
  - Large (desktop): 1024px+
- Consistent padding across breakpoints (percentage-based)
- Stack elements vertically on mobile
- Simplified navigation on mobile (bottom tab bar)

## Motion and Interactions

### Transitions
- Subtle, quick transitions (150-200ms)
- Ease-in-out timing function
- Used for hover states, reveal animations

### Animation
- Minimal, purposeful animation
- Used primarily for:
  - Status changes (loading, success, error)
  - New message notifications
  - Page transitions
  - Empty state illustrations

### Loading States
- Subtle loading indicators
- Purple spinner or progress bar
- Skeleton screens for content loading

## Voice and Tone

### Writing Principles
- Clear and concise (no unnecessary words)
- Friendly but professional
- Active voice
- Present tense
- Conversational without being overly casual

### UI Text Guidelines
- Button text: Action verbs, 1-3 words
- Headings: Descriptive, not clever
- Error messages: Clear explanation and solution
- Success messages: Confirmation of action
- Form labels: Concise, descriptive nouns

## Accessibility

- WCAG AA compliance minimum
- Color contrast ratios: 4.5:1 for normal text, 3:1 for large text
- Focus states clearly visible
- Alt text for all images
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly content

## Implementation in Tailwind CSS

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#FFD600',    // Raygun Yellow
        secondary: '#2D2A24',  // Raygun Dark
        background: '#FAFAFA', // Paper White
        accent: '#7B2CBF',     // Purple
        tertiary: '#3A86FF',   // Blue
        success: '#06D6A0',    // Teal
        warning: '#FFBE0B',    // Amber
        error: '#EF476F',      // Pink Red
        neutral: {
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        'message': '18px',
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
```

## Common Component Classes

```html
<!-- Primary Button -->
<button class="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg font-sans font-medium">
  Send Message
</button>

<!-- Secondary Button -->
<button class="bg-white hover:bg-neutral-100 text-secondary border border-secondary px-4 py-2 rounded-lg font-sans font-medium">
  Cancel
</button>

<!-- Heading -->
<h1 class="text-4xl md:text-5xl font-display font-bold text-secondary mb-6">
  Dashboard
</h1>

<!-- Card -->
<div class="bg-white border border-neutral-200 rounded-lg p-4 shadow-card">
  Card content
</div>

<!-- Form Input -->
<input type="text" class="w-full p-2 border border-neutral-300 rounded-md focus:border-accent focus:ring-1 focus:ring-accent text-secondary">

<!-- Message Bubble - Outgoing -->
<div class="bg-accent text-white p-3 rounded-message rounded-br-sm max-w-xs ml-auto my-1">
  Hello there!
</div>

<!-- Message Bubble - Incoming -->
<div class="bg-neutral-100 text-secondary p-3 rounded-message rounded-bl-sm max-w-xs mr-auto my-1">
  Hi! How can I help?
</div>
```
