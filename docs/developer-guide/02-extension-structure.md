# Extension Structure

Create custom widgets for QuantomOS using the JSON-based extension system.

## Overview

QuantomOS extensions allow you to create custom widgets without modifying the core codebase. Extensions are defined in JSON files and support HTML, CSS, and JavaScript.

## Quick Start

### Basic Extension

Create a file in `/extensions/my-widget.json`:

```json
{
  "id": "my-custom-widget",
  "name": "myWidget",
  "title": "My Custom Widget",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "A custom widget for my dashboard",
  "settings": [
    {
      "id": "message",
      "name": "Message",
      "type": "text",
      "defaultValue": "Hello World!",
      "description": "Text to display"
    }
  ],
  "html": "<div class='widget'>{{message}}</div>",
  "css": ".widget { padding: 2rem; background: var(--color-secondary-background); }",
  "javascript": "console.log('Widget loaded!');"
}
```

### Extension Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (lowercase, hyphens) |
| `name` | string | Yes | Internal name (camelCase) |
| `title` | string | Yes | Display name |
| `version` | string | Yes | Semantic version (1.0.0) |
| `author` | string | Yes | Creator name |
| `description` | string | Yes | Widget description |
| `settings` | array | No | Configuration options |
| `html` | string | Yes | Widget HTML content |
| `css` | string | No | Widget styles |
| `javascript` | string | No | Widget behavior |

## Comprehensive Extension Documentation

For complete documentation on creating extensions, see the [Extensions Documentation](../extensions/):

### Core Guides

- **[Extension Development Guide](../extensions/extension-development-guide.md)** - Complete guide to building extensions
- **[Extension Structure](../extensions/extension-structure.md)** - Detailed schema and field reference
- **[Settings Reference](../extensions/settings-reference.md)** - All available setting types

### Advanced Topics

- **[Template System](../extensions/template-system.md)** - Dynamic content with placeholders
- **[Shadow DOM Guide](../extensions/shadow-dom-guide.md)** - Style isolation and theming
- **[API Reference](../extensions/api-reference.md)** - Available APIs for extensions

### Resources

- **[Best Practices](../extensions/best-practices.md)** - Code quality and performance tips
- **[Examples](../extensions/examples.md)** - Complete extension examples
- **[Troubleshooting](../extensions/troubleshooting.md)** - Common issues and solutions

## Extension Development Workflow

1. **Create Extension File**: Add JSON file to `/extensions` directory
2. **Define Structure**: Set id, name, title, version, author, description
3. **Add Settings**: Define configuration options (optional)
4. **Write HTML**: Create widget structure with template placeholders
5. **Style with CSS**: Use theme variables for consistency
6. **Add JavaScript**: Implement dynamic behavior (optional)
7. **Test**: Add widget to dashboard and test functionality
8. **Iterate**: Refine based on testing
9. **Share**: Contribute to marketplace (optional)

## Setting Types

Extensions support various setting types:

- **text**: Single-line text input
- **textarea**: Multi-line text
- **number**: Numeric input
- **boolean**: Toggle switch
- **select**: Dropdown selection
- **color**: Color picker
- **url**: URL input with validation

See [Settings Reference](../extensions/settings-reference.md) for complete details.

## Template System

Use placeholders in HTML to display settings:

```html
<div class="widget">
  <h2>{{title}}</h2>
  <p>{{description}}</p>
</div>
```

Placeholders are replaced with setting values at runtime.

See [Template System](../extensions/template-system.md) for advanced usage.

## Theming

Use CSS variables to match dashboard theme:

```css
.widget {
  background: var(--color-secondary-background);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.widget-title {
  color: var(--color-accent);
}
```

All theme variables automatically update when user changes theme.

See [Shadow DOM Guide](../extensions/shadow-dom-guide.md) for theming details.

## JavaScript APIs

Extensions can use browser APIs and QuantomOS-specific utilities:

```javascript
// Access widget configuration
const config = this.config;

// Update widget content dynamically
document.querySelector('.value').textContent = new Date().toLocaleString();

// Make API calls
fetch('https://api.example.com/data')
  .then(res => res.json())
  .then(data => {
    // Update widget with data
  });
```

See [API Reference](../extensions/api-reference.md) for available APIs.

## Example: Weather Extension

```json
{
  "id": "custom-weather",
  "name": "customWeather",
  "title": "Custom Weather",
  "version": "1.0.0",
  "author": "Me",
  "description": "Display weather for a location",
  "settings": [
    {
      "id": "city",
      "name": "City",
      "type": "text",
      "defaultValue": "New York",
      "description": "City name"
    },
    {
      "id": "units",
      "name": "Units",
      "type": "select",
      "options": ["Celsius", "Fahrenheit"],
      "defaultValue": "Fahrenheit"
    }
  ],
  "html": "<div class='weather'><div class='city'>{{city}}</div><div class='temp' id='temp'>Loading...</div></div>",
  "css": ".weather { padding: 1rem; text-align: center; } .city { font-size: 1.2rem; font-weight: bold; } .temp { font-size: 2rem; color: var(--color-accent); }",
  "javascript": "const city = '{{city}}'; const units = '{{units}}'; fetch(`https://api.weatherapi.com/v1/current.json?key=YOUR_KEY&q=${city}`).then(r => r.json()).then(d => { document.getElementById('temp').textContent = units === 'Celsius' ? d.current.temp_c + '°C' : d.current.temp_f + '°F'; });"
}
```

## Testing Extensions

1. **Add to Dashboard**: Extensions appear automatically in widget selector
2. **Configure**: Test all settings work correctly
3. **Verify Display**: Check HTML renders properly
4. **Test Interactivity**: Ensure JavaScript functions as expected
5. **Check Theming**: Verify colors adapt to theme changes
6. **Test Resizing**: Confirm widget scales appropriately

## Best Practices

1. **Unique IDs**: Use descriptive, unique extension IDs
2. **Semantic Versioning**: Follow semver (1.0.0)
3. **Theme Variables**: Always use CSS variables for colors
4. **Error Handling**: Wrap JavaScript in try-catch
5. **Documentation**: Include clear setting descriptions
6. **Testing**: Test across different widget sizes
7. **Performance**: Avoid heavy operations in JavaScript
8. **Security**: Sanitize any user input

## Marketplace

Share your extensions with the community:

1. Create extension following best practices
2. Test thoroughly
3. Document usage
4. Submit to marketplace repository
5. Community can install via marketplace modal

## Next Steps

- **[Extension Examples](../extensions/examples.md)** - Study complete examples
- **[Best Practices](../extensions/best-practices.md)** - Learn optimization techniques
- **[Troubleshooting](../extensions/troubleshooting.md)** - Solve common issues

---

For the complete extension development guide with detailed explanations, examples, and advanced topics, visit the **[Extensions Documentation](../extensions/)**.
