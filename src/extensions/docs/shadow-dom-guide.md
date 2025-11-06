# Shadow DOM Guide

Understanding and working with Shadow DOM in QuantomOS extensions.

## Overview

QuantomOS extensions use Shadow DOM to provide style and script isolation. This prevents your extension's CSS from affecting the main dashboard and vice versa.

## What is Shadow DOM?

Shadow DOM creates an encapsulated DOM tree attached to an element but separate from the main document DOM. It provides:

1. **Style Encapsulation**: CSS defined in your extension only affects your extension
2. **DOM Encapsulation**: Your HTML structure is hidden from the main document
3. **Composition**: Clear boundaries between extension and dashboard code

## How It Works in Extensions

When your extension is loaded:

```javascript
// QuantomOS creates a shadow root for your extension
const shadow = hostElement.attachShadow({ mode: 'open' });

// Your HTML is inserted into the shadow DOM
shadow.innerHTML = yourExtensionHtml;

// Your CSS is scoped to the shadow DOM
const style = document.createElement('style');
style.textContent = yourExtensionCss;
shadow.appendChild(style);

// Your JavaScript runs in the extension context
eval(yourExtensionJavascript);
```

## Benefits

### 1. Style Isolation

**Your CSS won't affect the dashboard**:
```css
/* This only styles elements in YOUR extension */
.container {
  background: red;
}
```

**Dashboard CSS won't affect your extension**:
- Dashboard's `.container` class won't style your `.container`
- Your extension maintains its intended appearance
- No CSS conflicts or naming collisions

### 2. Predictable Styling

You have full control over your extension's appearance:

```css
/* Works exactly as written, no interference */
h1 {
  font-size: 24px;
  color: #fff;
}
```

### 3. Clean Namespacing

No need for complex class naming schemes:

```html
<!-- Simple, clean class names -->
<div class="header">
  <h1 class="title">Weather</h1>
</div>
```

## Working with Shadow DOM

### Accessing Elements

Within your extension's JavaScript, you can access elements normally:

```javascript
// This works - searches within your extension
const element = document.querySelector('.my-element');
element.textContent = 'Updated!';
```

### Event Listeners

Standard event listeners work as expected:

```javascript
document.querySelector('.button').addEventListener('click', () => {
  console.log('Clicked!');
});
```

### Setting Styles

You can manipulate styles directly:

```javascript
const widget = document.querySelector('.widget');
widget.style.backgroundColor = '#1a1a1f';
```

## Using Dashboard Theme Variables

While your CSS is isolated, you can still access the dashboard's theme colors using CSS custom properties:

```css
.widget {
  /* Use dashboard theme colors */
  background: var(--color-widget-background);
  color: var(--color-primary-text);
  border: 1px solid var(--color-border);
}

.accent {
  color: var(--color-primary-accent);
}
```

### Available Theme Variables

**Background Colors**:
```css
var(--color-background)
var(--color-widget-background)
var(--color-header-background)
var(--color-sidebar-background)
var(--color-secondary-background)
```

**Accent Colors**:
```css
var(--color-primary-accent)
var(--color-secondary-accent)
var(--color-success)
var(--color-warning)
var(--color-error)
```

**Text Colors**:
```css
var(--color-primary-text)
var(--color-secondary-text)
```

**Border Colors**:
```css
var(--color-border)
var(--color-hover-border)
```

**Effects**:
```css
var(--backdrop-blur)
```

## Limitations

### 1. Cannot Style Parent Elements

Your CSS cannot affect elements outside your extension:

```css
/* This WON'T work - can't style dashboard */
body {
  background: red;
}

/* This WON'T work - can't reach outside shadow DOM */
.dashboard-header {
  color: blue;
}
```

### 2. Global Selectors Are Scoped

Global selectors only apply within your extension:

```css
/* Only affects * within your extension */
* {
  box-sizing: border-box;
}

/* Only affects h1 within your extension */
h1 {
  color: white;
}
```

### 3. External Resources

Loading external resources works normally:

```html
<!-- Works fine -->
<img src="https://example.com/image.jpg">

<!-- Works fine -->
<iframe src="https://example.com/content"></iframe>
```

### 4. Font Loading

External fonts must be loaded in your CSS:

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

.widget {
  font-family: 'Roboto', sans-serif;
}
```

Or use dashboard fonts:
```css
.widget {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

## Best Practices

### 1. Embrace Isolation

Design your extension as a self-contained component:

```html
<div class="extension-root">
  <style>
    .extension-root {
      /* All styles here are isolated */
    }
  </style>
  <!-- Content -->
</div>
```

### 2. Use Theme Variables

Integrate with dashboard theme for consistency:

```css
.widget {
  background: var(--color-widget-background);
  color: var(--color-primary-text);
  border-radius: 12px; /* Match dashboard style */
}
```

### 3. Provide Fallbacks

Theme variables should have fallbacks:

```css
.widget {
  /* Fallback if variable isn't available */
  background: var(--color-widget-background, #2e2e2e);
  color: var(--color-primary-text, #f3f4f6);
}
```

### 4. Responsive Design

Make your extension responsive within its container:

```css
.widget {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

@media (max-width: 600px) {
  .widget {
    font-size: 14px;
  }
}
```

### 5. Test in Isolation

Test your extension independently before integrating:

```html
<!-- Test file -->
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Your extension CSS */
  </style>
</head>
<body>
  <!-- Your extension HTML -->
  <script>
    // Your extension JavaScript
  </script>
</body>
</html>
```

## Common Patterns

### Responsive Container

```css
.extension-container {
  width: 100%;
  height: 100%;
  padding: 1rem;
  background: var(--color-widget-background, #2e2e2e);
  border-radius: 8px;
  overflow: auto;
}
```

### Themed Components

```css
.button {
  background: var(--color-primary-accent, #8b5cf6);
  color: var(--color-primary-text, #fff);
  border: 1px solid var(--color-border, #374151);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.button:hover {
  background: var(--color-secondary-accent, #6366f1);
  border-color: var(--color-hover-border, #6b7280);
}
```

### Card Layout

```css
.card {
  background: var(--color-widget-background, #2e2e2e);
  border: 1px solid var(--color-border, rgba(255, 255, 255, 0.1));
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  color: var(--color-primary-text, #f3f4f6);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.card-content {
  color: var(--color-secondary-text, #9ca3af);
  line-height: 1.6;
}
```

## Troubleshooting

### Styles Not Applying

**Problem**: Your CSS isn't working
- **Solution**: Check for syntax errors in CSS string
- **Solution**: Ensure CSS is properly included in extension JSON

### Theme Variables Not Working

**Problem**: `var(--color-*)` showing as literal text
- **Solution**: Add fallback values: `var(--color-primary, #default)`
- **Solution**: Check variable name spelling

### JavaScript Can't Find Elements

**Problem**: `querySelector` returns null
- **Solution**: Ensure you're searching within extension scope
- **Solution**: Check HTML structure and class names match

### Font Not Loading

**Problem**: Custom font not displaying
- **Solution**: Import font in CSS
- **Solution**: Verify font URL is accessible
- **Solution**: Check font-family name matches import

## Examples

### Complete Themed Extension

```json
{
  "id": "themed-widget",
  "html": "<div class=\"widget-container\"><h1 class=\"title\">{{title}}</h1><p class=\"content\">{{content}}</p></div>",
  "css": ".widget-container { width: 100%; height: 100%; padding: 1.5rem; background: var(--color-widget-background, #2e2e2e); border-radius: 12px; } .title { color: var(--color-primary-text, #f3f4f6); font-size: 1.5rem; margin-bottom: 1rem; } .content { color: var(--color-secondary-text, #9ca3af); line-height: 1.6; }",
  "javascript": "console.log('Widget loaded');"
}
```

### Interactive Component

```html
<div class="interactive-widget">
  <button class="action-btn">Click Me</button>
  <div class="result"></div>
</div>
```

```css
.interactive-widget {
  padding: 2rem;
  background: var(--color-widget-background);
  border-radius: 12px;
}

.action-btn {
  background: var(--color-primary-accent);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s;
}

.action-btn:hover {
  transform: scale(1.05);
}

.result {
  margin-top: 1rem;
  color: var(--color-primary-text);
}
```

```javascript
document.querySelector('.action-btn').addEventListener('click', () => {
  document.querySelector('.result').textContent = 'Button clicked!';
});
```

## Further Reading

- [Extension Structure](./extension-structure.md) - Overall extension schema
- [Best Practices](./best-practices.md) - Coding standards
- [MDN Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) - Technical documentation
