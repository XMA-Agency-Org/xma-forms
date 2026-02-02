# Design System

## Color System

All colors use the oklch color space. No hex or rgb values are permitted anywhere in the codebase.

### Palettes

Five palettes, each spanning a 50-950 scale with consistent lightness ramps:

| Palette   | Hue | Usage                          |
| --------- | --- | ------------------------------ |
| Primary   | 260 | Brand, interactive elements    |
| Neutral   | 0   | Text, backgrounds, borders     |
| Success   | 145 | Positive states, confirmations |
| Warning   | 85  | Caution states, alerts         |
| Error     | 25  | Destructive actions, errors    |

Each palette provides steps: 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950.

Lightness decreases from 50 (lightest) to 950 (darkest). Chroma varies per palette to maintain perceptual consistency.

### Semantic Aliases

Semantic tokens map to specific palette steps for consistent usage across the UI:

| Token                  | Maps To        | Purpose                        |
| ---------------------- | -------------- | ------------------------------ |
| background             | neutral-50     | Page background                |
| foreground             | neutral-950    | Primary text                   |
| muted                  | neutral-100    | Subtle backgrounds             |
| muted-foreground       | neutral-500    | Secondary text, placeholders   |
| border                 | neutral-200    | General borders                |
| input-border           | neutral-300    | Form input borders             |
| ring                   | primary-500    | Focus ring color               |
| card                   | neutral-50     | Card backgrounds               |
| card-foreground        | neutral-950    | Card text                      |
| destructive            | error-600      | Destructive action backgrounds |
| destructive-foreground | neutral-50     | Text on destructive background |

## Radius Tokens

| Token | Value     | Usage                       |
| ----- | --------- | --------------------------- |
| sm    | 0.375rem  | Small elements, badges      |
| md    | 0.5rem    | Buttons, inputs             |
| lg    | 0.75rem   | Cards, sections             |
| xl    | 1rem      | Modals, large containers    |

## Typography

Two font families loaded via `next/font/google`:

- **Geist Sans** - Primary typeface for all UI text. Applied as `--font-geist-sans`.
- **Geist Mono** - Monospace typeface for code or technical content. Applied as `--font-geist-mono`.

## Tailwind v4 Integration

All tokens are registered in a `@theme` inline block inside the global CSS file. This maps every token to `--color-*` CSS custom properties, making them available as standard Tailwind utilities:

```css
@theme inline {
  --color-primary-50: oklch(0.97 0.02 260);
  --color-primary-500: oklch(0.55 0.2 260);
  /* ... all palette steps and semantic aliases */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}
```

Usage in components:

```tsx
<div className="bg-primary-500 text-neutral-50 rounded-md" />
<div className="bg-background text-foreground border-border" />
```
