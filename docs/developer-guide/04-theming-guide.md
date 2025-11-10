# Theming Guide

Comprehensive guide to the QuantomOS theme system and customization.

## Overview

QuantomOS uses CSS Custom Properties (variables) for theming, allowing complete color customization without modifying code.

## Theme System Architecture

### CSS Variables

All colors are defined as CSS variables in `:root`:

```css
:root {
  /* Backgrounds */
  --color-background: #0a0e27;
  --color-secondary-background: #1a1f3a;
  --color-tertiary-background: #2a2f4a;

  /* Accents */
  --color-accent: #3b82f6;
  --color-secondary-accent: #60a5fa;

  /* Text */
  --color-text-primary: #ffffff;
  --color-text-secondary: #94a3b8;
  --color-text-tertiary: #64748b;

  /* Borders */
  --color-border: #334155;
  --color-border-light: #475569;

  /* States */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}
```

### Variable Categories

**1. Background Colors**:
- `--color-background`: Main dashboard background
- `--color-secondary-background`: Widgets, panels, cards
- `--color-tertiary-background`: Nested elements, hover states

**2. Accent Colors**:
- `--color-accent`: Primary buttons, links, highlights
- `--color-secondary-accent`: Secondary elements, hover states

**3. Text Colors**:
- `--color-text-primary`: Main text
- `--color-text-secondary`: Subtext, labels
- `--color-text-tertiary`: Disabled, placeholder text

**4. Border Colors**:
- `--color-border`: Default borders
- `--color-border-light`: Lighter borders, separators

**5. State Colors**:
- `--color-success`: Success messages, positive states
- `--color-warning`: Warnings, cautions
- `--color-error`: Errors, failures
- `--color-info`: Information, neutral states

## Using Theme Variables

### In Components

Always use CSS variables instead of hardcoded colors:

```tsx
const StyledComponent = styled.div`
  background: var(--color-secondary-background);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);

  &:hover {
    background: var(--color-tertiary-background);
  }

  .accent {
    color: var(--color-accent);
  }
`;
```

### In MUI Theme

MUI components use theme-defined colors:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: getComputedStyle(document.documentElement)
        .getPropertyValue('--color-accent').trim(),
    },
    background: {
      default: getComputedStyle(document.documentElement)
        .getPropertyValue('--color-background').trim(),
      paper: getComputedStyle(document.documentElement)
        .getPropertyValue('--color-secondary-background').trim(),
    },
    text: {
      primary: getComputedStyle(document.documentElement)
        .getPropertyValue('--color-text-primary').trim(),
      secondary: getComputedStyle(document.documentElement)
        .getPropertyValue('--color-text-secondary').trim(),
    },
  },
});
```

### In Extensions

Extensions should always use CSS variables:

```css
.my-extension {
  background: var(--color-secondary-background);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.my-extension-title {
  color: var(--color-accent);
}

.my-extension-button {
  background: var(--color-accent);
  color: white;
}

.my-extension-button:hover {
  background: var(--color-secondary-accent);
}
```

## User Theme Customization

Users can customize colors via Settings → Color Customization:

1. Click color swatch to open picker
2. Choose new color
3. Color updates immediately across all components
4. Changes persist in configuration

## Creating Custom Themes

### Define Theme Object

```typescript
interface Theme {
  name: string;
  colors: {
    background: string;
    secondaryBackground: string;
    tertiaryBackground: string;
    accent: string;
    secondaryAccent: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    borderLight: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}
```

### Apply Theme

```typescript
function applyTheme(theme: Theme) {
  const root = document.documentElement;

  root.style.setProperty('--color-background', theme.colors.background);
  root.style.setProperty('--color-secondary-background', theme.colors.secondaryBackground);
  root.style.setProperty('--color-tertiary-background', theme.colors.tertiaryBackground);
  root.style.setProperty('--color-accent', theme.colors.accent);
  // ... set all variables
}
```

### Export/Import Themes

Themes can be exported as JSON:

```json
{
  "name": "Ocean Blue",
  "colors": {
    "background": "#0c1445",
    "secondaryBackground": "#1a2456",
    "tertiaryBackground": "#2a3466",
    "accent": "#3b82f6",
    "secondaryAccent": "#60a5fa",
    "textPrimary": "#ffffff",
    "textSecondary": "#94a3b8",
    "textTertiary": "#64748b",
    "border": "#334155",
    "borderLight": "#475569",
    "success": "#10b981",
    "warning": "#f59e0b",
    "error": "#ef4444",
    "info": "#3b82f6"
  }
}
```

## Color Accessibility

### Contrast Ratios

Maintain WCAG AA compliance:
- **Normal text**: 4.5:1 minimum contrast
- **Large text**: 3:1 minimum contrast
- **UI components**: 3:1 minimum contrast

### Testing Tools

Use browser dev tools to check contrast:
1. Inspect element
2. View color contrast ratio
3. Adjust if below recommended ratio

### Best Practices

1. **High Contrast**: Use sufficient contrast between text and background
2. **Color Blindness**: Don't rely solely on color to convey information
3. **State Indicators**: Use icons in addition to colors
4. **Test**: Test themes with accessibility tools

## Dark Mode (Default)

QuantomOS uses dark mode by default:
- Reduces eye strain in dark environments
- Better for OLED screens
- Preferred for 24/7 monitoring displays
- Energy efficient on OLED displays

### Dark Theme Guidelines

**Backgrounds**:
- Use very dark colors (not pure black)
- Subtle elevation with lighter backgrounds
- 3-4 shade levels maximum

**Text**:
- Pure white for primary text
- Reduced opacity for secondary text
- Increase contrast for accessibility

**Colors**:
- Slightly desaturated colors
- Avoid pure saturated colors
- Use softer accents

## Light Mode

Light mode can be created as custom theme:

```css
:root[data-theme="light"] {
  --color-background: #ffffff;
  --color-secondary-background: #f8fafc;
  --color-tertiary-background: #f1f5f9;
  --color-accent: #2563eb;
  --color-secondary-accent: #3b82f6;
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-tertiary: #94a3b8;
  --color-border: #e2e8f0;
  --color-border-light: #cbd5e1;
}
```

## Example Themes

### Midnight Blue

```css
--color-background: #0a0e27;
--color-secondary-background: #1a1f3a;
--color-accent: #3b82f6;
```

### Forest Green

```css
--color-background: #0a1f0f;
--color-secondary-background: #1a2f1f;
--color-accent: #10b981;
```

### Sunset Orange

```css
--color-background: #1f0f0a;
--color-secondary-background: #2f1f1a;
--color-accent: #f97316;
```

### Purple Haze

```css
--color-background: #1a0f27;
--color-secondary-background: #2a1f3a;
--color-accent: #a855f7;
```

## Best Practices

### For Developers

1. **Always Use Variables**: Never hardcode colors
2. **Consistent Naming**: Follow established variable names
3. **Semantic Colors**: Use variables semantically (accent for accents, not arbitrary blues)
4. **Test Themes**: Test components with different themes
5. **Document Usage**: Comment which variables to use where

### For Theme Creators

1. **Contrast**: Ensure sufficient contrast
2. **Consistency**: Use cohesive color palette
3. **Accessibility**: Test with accessibility tools
4. **Test Components**: Preview with all widgets
5. **Document**: Provide theme name and description

### For Users

1. **Start with Presets**: Use default themes as starting point
2. **Subtle Changes**: Make incremental adjustments
3. **Test**: Preview on all pages before finalizing
4. **Backup**: Export custom themes for backup
5. **Share**: Share great themes with community

## Troubleshooting

### Colors Not Applying

**Causes**:
- CSS variable typo
- !important overriding variable
- Cached styles

**Solutions**:
1. Check variable name spelling
2. Remove !important declarations
3. Clear browser cache
4. Hard refresh (Ctrl+Shift+R)

### Contrast Issues

**Solutions**:
1. Use browser's color picker contrast checker
2. Increase text brightness
3. Adjust background darkness
4. Test with different content

### Theme Not Saving

**Solutions**:
1. Check browser console for errors
2. Verify local storage isn't full
3. Check network request succeeded
4. Try exporting and re-importing

## Resources

- [Material Design Color Tool](https://material.io/resources/color/)
- [Adobe Color](https://color.adobe.com/)
- [Coolors](https://coolors.co/) - Color palette generator
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Next Steps

- [Dashboard Basics](../user-guide/01-dashboard-basics.md) - Learn to use themes
- [Settings Guide](../user-guide/03-settings.md) - Customize colors
- [Extension Structure](./02-extension-structure.md) - Theme extensions properly
