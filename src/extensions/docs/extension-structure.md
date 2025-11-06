# Extension Structure

This document provides a detailed explanation of the QuantomOS extension JSON schema, required and optional fields, and best practices for structuring extensions.

## Overview

Extensions in QuantomOS are defined using JSON files that contain metadata, configuration settings, and the actual HTML/CSS/JavaScript code that powers the extension.

## JSON Schema

### Required Fields

#### `id` (string)
- **Description**: Unique identifier for the extension
- **Format**: Lowercase letters, numbers, and hyphens only
- **Example**: `"weather-radar"`
- **Best Practice**: Use descriptive, URL-friendly names

```json
{
  "id": "weather-radar"
}
```

#### `name` (string)
- **Description**: Internal name of the extension (used in code references)
- **Format**: CamelCase or kebab-case
- **Example**: `"weatherRadar"` or `"weather-radar"`

```json
{
  "name": "weatherRadar"
}
```

#### `title` (string)
- **Description**: Display name shown to users in the widget selector
- **Format**: Human-readable title
- **Example**: `"Weather Radar"`

```json
{
  "title": "Weather Radar"
}
```

#### `version` (string)
- **Description**: Extension version number
- **Format**: Semantic versioning (MAJOR.MINOR.PATCH)
- **Example**: `"1.0.0"`

```json
{
  "version": "1.0.0"
}
```

#### `author` (string)
- **Description**: Name of the extension creator
- **Example**: `"John Doe"`

```json
{
  "author": "John Doe"
}
```

#### `description` (string)
- **Description**: Brief description of what the extension does
- **Format**: 1-2 sentences, displayed in widget selector
- **Best Practice**: Keep under 100 characters for better display

```json
{
  "description": "Display real-time weather radar imagery for any location"
}
```

#### `html` (string)
- **Description**: HTML markup for the extension
- **Format**: Valid HTML string, can include template placeholders
- **Required**: Yes, cannot be empty

```json
{
  "html": "<div class=\"weather-radar\">{{locationName}}</div>"
}
```

### Optional Fields

#### `settings` (array)
- **Description**: Array of configurable settings for the extension
- **Format**: Array of setting objects (see Settings Reference)
- **Default**: Empty array if not provided

```json
{
  "settings": [
    {
      "id": "location",
      "name": "Location",
      "type": "text",
      "defaultValue": "New York",
      "description": "City name for weather data"
    }
  ]
}
```

#### `css` (string)
- **Description**: CSS styles for the extension
- **Format**: Valid CSS string
- **Scope**: Styles are scoped to the extension via Shadow DOM
- **Default**: Empty string if not provided

```json
{
  "css": ".weather-radar { background: #1a1a1f; padding: 1rem; }"
}
```

#### `javascript` (string)
- **Description**: JavaScript code for the extension
- **Format**: Valid JavaScript code
- **Scope**: Executed within the extension's context
- **Default**: Empty string if not provided

```json
{
  "javascript": "console.log('Weather radar loaded');"
}
```

## Complete Example

```json
{
  "id": "weather-radar",
  "name": "weatherRadar",
  "title": "Weather Radar",
  "version": "1.2.0",
  "author": "John Doe",
  "description": "Display real-time weather radar imagery for any location",
  "settings": [
    {
      "id": "location",
      "name": "Location",
      "type": "text",
      "defaultValue": "New York",
      "description": "City or region name"
    },
    {
      "id": "updateInterval",
      "name": "Update Interval",
      "type": "number",
      "defaultValue": 300,
      "description": "Refresh interval in seconds"
    },
    {
      "id": "showTimestamp",
      "name": "Show Timestamp",
      "type": "boolean",
      "defaultValue": true,
      "description": "Display the radar image timestamp"
    }
  ],
  "html": "<div class=\"weather-radar-container\"><img src=\"{{radarUrl}}\" alt=\"Weather Radar for {{location}}\"><div class=\"timestamp\" style=\"display: {{showTimestamp ? 'block' : 'none'}}\">Last updated: {{timestamp}}</div></div>",
  "css": ".weather-radar-container { background: var(--color-widget-background); border-radius: 8px; padding: 1rem; } .weather-radar-container img { width: 100%; height: auto; border-radius: 4px; } .timestamp { margin-top: 0.5rem; font-size: 0.85rem; color: var(--color-secondary-text); }",
  "javascript": "const updateRadar = () => { const img = document.querySelector('.weather-radar-container img'); img.src = `https://api.weather.com/radar?location={{location}}&t=${Date.now()}`; }; setInterval(updateRadar, {{updateInterval}} * 1000);"
}
```

## File Organization

### Directory Structure
Extensions should be placed in the `/extensions` directory:

```
extensions/
├── weather-radar.json
├── system-stats.json
├── crypto-ticker.json
└── docs/
    └── extension-development-guide.md
```

### Naming Conventions

**File Names:**
- Use the extension `id` as the filename
- Add `.json` extension
- Example: `weather-radar.json`

**Extension IDs:**
- Lowercase only
- Use hyphens to separate words
- Avoid special characters
- Examples: `weather-radar`, `system-monitor`, `crypto-prices`

## Best Practices

### 1. Keep Extensions Focused
- Each extension should do one thing well
- Avoid feature bloat
- Consider creating separate extensions for distinct features

### 2. Use Semantic Versioning
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### 3. Provide Meaningful Descriptions
- Clearly explain what the extension does
- Mention key features
- Keep it concise (under 100 characters)

### 4. Design for Configurability
- Make common options configurable via settings
- Provide sensible defaults
- Use appropriate setting types

### 5. Follow Naming Conventions
- Use consistent casing (prefer kebab-case for IDs)
- Choose descriptive names
- Avoid abbreviations unless widely understood

### 6. Document Your Settings
- Always include descriptions for settings
- Explain what values are acceptable
- Provide examples when helpful

### 7. Test Thoroughly
- Test with different setting values
- Verify template placeholders work correctly
- Check CSS scoping doesn't conflict
- Test JavaScript for errors

## Validation

Before deploying an extension, ensure:

1. **JSON is valid** - Use a JSON validator
2. **All required fields are present** - id, name, title, version, author, description, html
3. **Settings are properly formatted** - Each setting has id, name, type, defaultValue
4. **Template placeholders match settings** - All `{{variable}}` have corresponding settings
5. **CSS doesn't break layout** - Test in various screen sizes
6. **JavaScript has no errors** - Check browser console

## Common Mistakes to Avoid

1. **Missing Required Fields** - Always include all required fields
2. **Invalid JSON** - Use a linter to validate JSON syntax
3. **Duplicate IDs** - Each extension must have a unique ID
4. **Unescaped Quotes** - Properly escape quotes in HTML/CSS/JS strings
5. **Missing Template Variables** - Ensure all placeholders have corresponding settings
6. **Overly Complex HTML** - Keep markup simple and semantic

## Migration Guide

### Updating from v1.0 to v1.1

If you're updating an existing extension:

1. Add semantic version number if missing
2. Update any deprecated template syntax
3. Review CSS for Shadow DOM compatibility
4. Test with new extension loader

## Further Reading

- [Settings Reference](./settings-reference.md) - Detailed settings documentation
- [Template System](./template-system.md) - Template syntax and usage
- [Best Practices](./best-practices.md) - Coding standards and tips
- [Examples](./examples.md) - Complete extension examples
