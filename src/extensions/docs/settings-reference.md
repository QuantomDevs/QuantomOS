# Settings Reference

Complete reference for all available setting types in QuantomOS extensions, with examples and use cases for each.

## Overview

Settings allow users to configure extensions without modifying code. Each setting appears in the extension configuration dialog when adding the extension to the dashboard.

## Setting Structure

All settings share a common base structure:

```json
{
  "id": "settingIdentifier",
  "name": "Display Name",
  "type": "settingType",
  "defaultValue": "default",
  "description": "Optional description shown to users"
}
```

### Required Properties

- **`id`** (string): Unique identifier for the setting, used in template placeholders
- **`name`** (string): Human-readable label shown in the configuration UI
- **type`** (string): Type of setting (text, url, number, boolean, file)
- **`defaultValue`** (string | number | boolean): Default value used if user doesn't provide one

### Optional Properties

- **`description`** (string): Help text explaining the setting's purpose

## Setting Types

### 1. Text (`text`)

**Purpose**: Single-line text input for strings, names, API keys, etc.

**Default Value Type**: `string`

**Use Cases**:
- Location names
- API keys or tokens
- Custom labels
- Short text snippets

**Example**:
```json
{
  "id": "cityName",
  "name": "City Name",
  "type": "text",
  "defaultValue": "San Francisco",
  "description": "Enter the city name for weather data"
}
```

**Template Usage**:
```html
<div class="city">Weather for {{cityName}}</div>
```

**Advanced Example** (API Key):
```json
{
  "id": "apiKey",
  "name": "API Key",
  "type": "text",
  "defaultValue": "",
  "description": "Your OpenWeatherMap API key (get one at openweathermap.org/api)"
}
```

### 2. URL (`url`)

**Purpose**: Input for web addresses, API endpoints, image URLs

**Default Value Type**: `string` (valid URL)

**Use Cases**:
- API endpoints
- Image sources
- External links
- Webhook URLs

**Example**:
```json
{
  "id": "apiEndpoint",
  "name": "API Endpoint",
  "type": "url",
  "defaultValue": "https://api.example.com/data",
  "description": "Full URL to the data API endpoint"
}
```

**Template Usage**:
```javascript
fetch('{{apiEndpoint}}')
  .then(response => response.json())
  .then(data => console.log(data));
```

**Best Practices**:
- Always include `https://` in default values
- Validate URLs in JavaScript if making fetch requests
- Provide complete URLs, not partial paths

### 3. Number (`number`)

**Purpose**: Numeric input for integers and decimals

**Default Value Type**: `number` (integer or float)

**Use Cases**:
- Refresh intervals
- Maximum items to display
- Opacity values
- Timeouts and delays
- Chart limits

**Example** (Update Interval):
```json
{
  "id": "refreshInterval",
  "name": "Refresh Interval",
  "type": "number",
  "defaultValue": 300,
  "description": "How often to update data (in seconds)"
}
```

**Example** (Max Items):
```json
{
  "id": "maxItems",
  "name": "Maximum Items",
  "type": "number",
  "defaultValue": 10,
  "description": "Maximum number of items to display (1-50)"
}
```

**Template Usage**:
```javascript
setInterval(() => {
  updateData();
}, {{refreshInterval}} * 1000);
```

**Validation in JavaScript**:
```javascript
const maxItems = Math.min(Math.max({{maxItems}}, 1), 50);
```

### 4. Boolean (`boolean`)

**Purpose**: Toggle switches for on/off options

**Default Value Type**: `boolean` (true or false)

**Use Cases**:
- Feature toggles
- Show/hide elements
- Enable/disable functionality
- Dark mode switches

**Example** (Show/Hide):
```json
{
  "id": "showTimestamp",
  "name": "Show Timestamp",
  "type": "boolean",
  "defaultValue": true,
  "description": "Display the last update time"
}
```

**Example** (Feature Toggle):
```json
{
  "id": "enableAnimations",
  "name": "Enable Animations",
  "type": "boolean",
  "defaultValue": false,
  "description": "Enable smooth transitions and animations"
}
```

**Template Usage** (Conditional Display):
```html
<div class="timestamp" style="display: {{showTimestamp ? 'block' : 'none'}}">
  Last updated: 5 minutes ago
</div>
```

**Template Usage** (CSS Class):
```html
<div class="widget {{enableAnimations ? 'animated' : ''}}">
  Content here
</div>
```

**JavaScript Usage**:
```javascript
if ({{enableAnimations}}) {
  element.classList.add('fade-in');
}
```

### 5. File (`file`)

**Purpose**: File upload for images, icons, custom assets

**Default Value Type**: `string` (empty string or placeholder URL)

**Use Cases**:
- Custom background images
- Profile pictures
- Custom icons
- Logo uploads

**Example**:
```json
{
  "id": "backgroundImage",
  "name": "Background Image",
  "type": "file",
  "defaultValue": "",
  "description": "Upload a custom background image (JPG, PNG)"
}
```

**Template Usage**:
```html
<div class="widget" style="background-image: url('{{backgroundImage}}')">
  Content here
</div>
```

**Important Notes**:
- Files are uploaded to the server and a URL is returned
- The setting value will contain the full URL to the uploaded file
- Support for image files (JPG, PNG, GIF, SVG)
- File size limits may apply

## Complete Examples

### Example 1: Weather Widget

```json
{
  "settings": [
    {
      "id": "location",
      "name": "Location",
      "type": "text",
      "defaultValue": "New York",
      "description": "City name for weather data"
    },
    {
      "id": "units",
      "name": "Temperature Units",
      "type": "text",
      "defaultValue": "fahrenheit",
      "description": "Use 'fahrenheit' or 'celsius'"
    },
    {
      "id": "updateInterval",
      "name": "Update Interval (seconds)",
      "type": "number",
      "defaultValue": 600,
      "description": "How often to fetch new weather data"
    },
    {
      "id": "showForecast",
      "name": "Show 5-Day Forecast",
      "type": "boolean",
      "defaultValue": true,
      "description": "Display extended forecast information"
    }
  ]
}
```

### Example 2: RSS Feed Reader

```json
{
  "settings": [
    {
      "id": "feedUrl",
      "name": "RSS Feed URL",
      "type": "url",
      "defaultValue": "https://example.com/rss",
      "description": "URL to the RSS or Atom feed"
    },
    {
      "id": "itemCount",
      "name": "Number of Items",
      "type": "number",
      "defaultValue": 5,
      "description": "Maximum items to display (1-20)"
    },
    {
      "id": "showImages",
      "name": "Show Images",
      "type": "boolean",
      "defaultValue": true,
      "description": "Display thumbnail images from feed items"
    },
    {
      "id": "customTitle",
      "name": "Custom Title",
      "type": "text",
      "defaultValue": "Latest News",
      "description": "Override feed title with custom text"
    }
  ]
}
```

### Example 3: Custom Banner

```json
{
  "settings": [
    {
      "id": "bannerText",
      "name": "Banner Text",
      "type": "text",
      "defaultValue": "Welcome!",
      "description": "Text to display in the banner"
    },
    {
      "id": "backgroundImage",
      "name": "Background Image",
      "type": "file",
      "defaultValue": "",
      "description": "Upload a custom background (optional)"
    },
    {
      "id": "textColor",
      "name": "Text Color",
      "type": "text",
      "defaultValue": "#ffffff",
      "description": "Hex color code for text (e.g., #ffffff)"
    },
    {
      "id": "animateText",
      "name": "Animate Text",
      "type": "boolean",
      "defaultValue": false,
      "description": "Add sliding animation to text"
    }
  ]
}
```

## Best Practices

### 1. Provide Meaningful Defaults
- Choose defaults that work out of the box
- Use safe, commonly-used values
- For URLs, use example domains or popular services

### 2. Write Clear Descriptions
- Explain what the setting does
- Mention valid value ranges or formats
- Include examples when helpful
- Keep descriptions concise (under 100 characters)

### 3. Use Appropriate Types
- `text` for short strings
- `url` specifically for web addresses
- `number` for any numeric value
- `boolean` for on/off options
- `file` for uploads

### 4. Validation
While the extension system doesn't enforce validation, you should:
- Validate inputs in JavaScript
- Handle invalid values gracefully
- Provide feedback if settings are incorrect

```javascript
// Validate number range
const itemCount = Math.min(Math.max({{itemCount}}, 1), 20);

// Validate URL
const url = {{feedUrl}}.startsWith('http') ? {{feedUrl}} : 'https://' + {{feedUrl}};

// Validate non-empty string
const title = {{customTitle}}.trim() || 'Default Title';
```

### 5. Setting Order
- Place most important settings first
- Group related settings together
- Consider user workflow when ordering

### 6. Naming Conventions
**IDs**: Use camelCase
- `refreshInterval`
- `showTimestamp`
- `apiEndpoint`

**Names**: Use Title Case
- "Refresh Interval"
- "Show Timestamp"
- "API Endpoint"

## Common Patterns

### API Configuration
```json
[
  {
    "id": "apiUrl",
    "name": "API URL",
    "type": "url",
    "defaultValue": "https://api.example.com",
    "description": "Base URL for API requests"
  },
  {
    "id": "apiKey",
    "name": "API Key",
    "type": "text",
    "defaultValue": "",
    "description": "Your API authentication key"
  }
]
```

### Display Options
```json
[
  {
    "id": "showHeader",
    "name": "Show Header",
    "type": "boolean",
    "defaultValue": true
  },
  {
    "id": "maxItems",
    "name": "Max Items",
    "type": "number",
    "defaultValue": 10
  }
]
```

### Styling Options
```json
[
  {
    "id": "backgroundColor",
    "name": "Background Color",
    "type": "text",
    "defaultValue": "#1a1a1f",
    "description": "Hex color code"
  },
  {
    "id": "customFont",
    "name": "Custom Font",
    "type": "text",
    "defaultValue": "Inter",
    "description": "Font family name"
  }
]
```

## Troubleshooting

**Problem**: Setting value not appearing in template
- **Solution**: Check that setting `id` matches template placeholder exactly

**Problem**: Boolean setting not working as expected
- **Solution**: Ensure you're using ternary operators: `{{setting ? 'true' : 'false'}}`

**Problem**: File upload not working
- **Solution**: Verify file type is supported (images only), check file size limits

**Problem**: Number setting treated as string
- **Solution**: In JavaScript, multiply by 1 to convert: `{{setting}} * 1`

## Further Reading

- [Template System](./template-system.md) - How to use settings in templates
- [Extension Structure](./extension-structure.md) - Overall extension schema
- [Examples](./examples.md) - Complete extension examples
