# Template System

In-depth guide to the QuantomOS extension templating engine, covering placeholders, ternary operators, escaping, and advanced techniques.

## Overview

The template system allows you to create dynamic content by inserting setting values into your HTML, CSS, and JavaScript code using placeholder syntax.

## Basic Syntax

### Placeholder Format

Use double curly braces to insert setting values:

```
{{settingId}}
```

**Example**:
```html
<div class="greeting">Hello, {{userName}}!</div>
```

With setting:
```json
{
  "id": "userName",
  "name": "User Name",
  "type": "text",
  "defaultValue": "Guest"
}
```

Result:
```html
<div class="greeting">Hello, Guest!</div>
```

## Using Templates

### In HTML

Templates can be used anywhere in your HTML markup:

**Text Content**:
```html
<h1>{{title}}</h1>
<p>{{description}}</p>
```

**Attributes**:
```html
<img src="{{imageUrl}}" alt="{{imageAlt}}">
<a href="{{linkUrl}}" target="_blank">{{linkText}}</a>
```

**Inline Styles**:
```html
<div style="color: {{textColor}}; background: {{bgColor}}">
  Content
</div>
```

**Data Attributes**:
```html
<div data-api-key="{{apiKey}}" data-endpoint="{{apiUrl}}">
  Widget
</div>
```

### In CSS

Templates work in CSS strings:

**Colors**:
```css
.widget {
  background-color: {{backgroundColor}};
  color: {{textColor}};
}
```

**Sizes**:
```css
.container {
  max-width: {{maxWidth}}px;
  padding: {{padding}}rem;
}
```

**URLs**:
```css
.banner {
  background-image: url('{{backgroundImage}}');
}
```

### In JavaScript

Templates can be used in JavaScript code:

**Variables**:
```javascript
const apiKey = '{{apiKey}}';
const refreshInterval = {{updateInterval}};
const isEnabled = {{featureEnabled}};
```

**Function Calls**:
```javascript
fetchData('{{apiEndpoint}}', '{{apiKey}}');
```

**String Interpolation**:
```javascript
const message = `Welcome to {{cityName}}`;
```

## Conditional Rendering

### Ternary Operators

Use JavaScript ternary operators for conditional content:

**Basic Syntax**:
```
{{condition ? 'valueIfTrue' : 'valueIfFalse'}}
```

**Show/Hide Elements**:
```html
<div style="display: {{showElement ? 'block' : 'none'}}">
  Optional content
</div>
```

**Conditional Classes**:
```html
<div class="widget {{darkMode ? 'dark' : 'light'}}">
  Content
</div>
```

**Conditional Text**:
```html
<span>Status: {{isOnline ? 'Online' : 'Offline'}}</span>
```

**Conditional Attributes**:
```html
<button {{isDisabled ? 'disabled' : ''}}>
  Click me
</button>
```

### Complex Conditions

**Multiple Classes**:
```html
<div class="widget {{largeSize ? 'large' : 'small'}} {{darkMode ? 'dark' : 'light'}}">
  Content
</div>
```

**Nested Ternaries** (use sparingly):
```html
<span class="{{status === 'active' ? 'green' : status === 'pending' ? 'yellow' : 'red'}}">
  {{status}}
</span>
```

**Conditional Styles**:
```html
<div style="
  opacity: {{fadeEnabled ? '0.8' : '1'}};
  transition: {{animationsEnabled ? 'all 0.3s ease' : 'none'}}
">
  Content
</div>
```

## Data Types

### Strings

String values are inserted as-is:

```json
{
  "id": "title",
  "type": "text",
  "defaultValue": "My Widget"
}
```

```html
<h1>{{title}}</h1>
<!-- Result: <h1>My Widget</h1> -->
```

### Numbers

Numbers are inserted without quotes:

```json
{
  "id": "count",
  "type": "number",
  "defaultValue": 42
}
```

```javascript
const itemCount = {{count}};
// Result: const itemCount = 42;
```

```html
<div style="opacity: {{opacity}}">
<!-- Result: <div style="opacity: 0.8"> -->
</div>
```

### Booleans

Boolean values become `true` or `false`:

```json
{
  "id": "isActive",
  "type": "boolean",
  "defaultValue": true
}
```

```javascript
if ({{isActive}}) {
  // Result: if (true) {
  doSomething();
}
```

### URLs

URLs are treated as strings:

```json
{
  "id": "apiEndpoint",
  "type": "url",
  "defaultValue": "https://api.example.com"
}
```

```javascript
fetch('{{apiEndpoint}}')
// Result: fetch('https://api.example.com')
```

## Advanced Techniques

### Array-like Values

While settings don't support arrays directly, you can use comma-separated strings:

```json
{
  "id": "tags",
  "type": "text",
  "defaultValue": "news,technology,science"
}
```

```javascript
const tags = '{{tags}}'.split(',');
// Result: const tags = ['news', 'technology', 'science'];
```

### JSON Data

Store JSON in text settings for complex data:

```json
{
  "id": "config",
  "type": "text",
  "defaultValue": "{\"theme\":\"dark\",\"fontSize\":14}"
}
```

```javascript
const config = JSON.parse('{{config}}');
// Result: const config = {theme: "dark", fontSize: 14};
```

### Math Operations

Perform calculations with number settings:

```javascript
const updateMs = {{updateSeconds}} * 1000;
const halfWidth = {{containerWidth}} / 2;
const total = {{value1}} + {{value2}};
```

### String Concatenation

Combine multiple settings:

```javascript
const fullUrl = '{{baseUrl}}' + '/api/' + '{{endpoint}}';
```

```html
<div class="{{prefix}}-{{type}}-widget">
  Content
</div>
```

## Escaping and Special Characters

### Quotes in Strings

**Problem**: Quotes can break HTML/JavaScript
```html
<!-- WRONG: -->
<div title="{{description}}"></div>
<!-- If description contains quotes, this breaks -->
```

**Solution**: Use alternative quote style or escape
```html
<!-- Better: -->
<div title='{{description}}'></div>

<!-- Or in JavaScript, escape: -->
<script>
const desc = `{{description}}`.replace(/"/g, '\\"');
</script>
```

### HTML Entities

For special characters in HTML:

```html
<div data-content="{{userInput}}"></div>
```

Consider sanitizing user input in JavaScript:

```javascript
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

const safe = escapeHtml('{{userInput}}');
```

### URLs with Parameters

```javascript
const apiUrl = '{{baseUrl}}?key={{apiKey}}&format=json';
```

```html
<img src="{{imageUrl}}?size={{imageSize}}&cache={{timestamp}}">
```

## Best Practices

### 1. Keep It Simple
- Avoid overly complex ternary expressions
- Break complex logic into JavaScript functions
- Use readable variable names

### 2. Validate Data
Always validate setting values in JavaScript:

```javascript
// Validate number is positive
const interval = Math.max(1, {{updateInterval}});

// Validate URL format
const url = '{{apiUrl}}'.startsWith('http')
  ? '{{apiUrl}}'
  : 'https://{{apiUrl}}';

// Provide fallback for empty strings
const title = '{{customTitle}}'.trim() || 'Default Title';
```

### 3. Handle Missing Values
Provide defaults for optional settings:

```javascript
const bgColor = '{{backgroundColor}}' || '#1a1a1f';
const fontSize = {{fontSize}} || 14;
```

### 4. Use Semantic Names
Choose descriptive setting IDs that explain their purpose:

**Good**:
- `{{primaryColor}}`
- `{{updateInterval}}`
- `{{showTimestamp}}`

**Bad**:
- `{{color1}}`
- `{{interval}}`
- `{{flag1}}`

### 5. Comment Your Templates
Add comments to explain complex template logic:

```html
<!-- Display error message if showErrors is enabled -->
<div style="display: {{showErrors ? 'block' : 'none'}}">
  Error messages here
</div>
```

### 6. Consistent Formatting
```html
<!-- Good: Consistent spacing -->
<div class="widget {{darkMode ? 'dark' : 'light'}}">

<!-- Avoid: Inconsistent spacing -->
<div class="widget {{darkMode?'dark':'light'}}">
```

## Common Patterns

### API Integration
```javascript
async function fetchData() {
  try {
    const response = await fetch('{{apiEndpoint}}', {
      headers: {
        'Authorization': 'Bearer {{apiKey}}',
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    updateUI(data);
  } catch (error) {
    console.error('Failed to fetch:', error);
  }
}

// Refresh every N seconds
setInterval(fetchData, {{refreshInterval}} * 1000);
```

### Conditional Styling
```html
<div
  class="widget {{size}}-size {{theme}}-theme"
  style="
    opacity: {{opacity}};
    border-radius: {{borderRadius}}px;
    display: {{visible ? 'flex' : 'none'}};
  "
>
  <h2 style="color: {{titleColor}}">{{title}}</h2>
  <p style="font-size: {{fontSize}}px">{{description}}</p>
</div>
```

### Dynamic Content
```javascript
const config = {
  title: '{{widgetTitle}}',
  refreshRate: {{refreshRate}},
  maxItems: {{maxItems}},
  showIcons: {{showIcons}},
  theme: '{{theme}}'
};

function render() {
  const container = document.querySelector('.widget-container');
  container.innerHTML = `
    <h1>${config.title}</h1>
    ${config.showIcons ? '<div class="icons"></div>' : ''}
  `;
}
```

## Troubleshooting

### Template Not Rendering

**Problem**: `{{settingId}}` appears as literal text
- **Cause**: Template processing didn't run
- **Solution**: Check extension is properly loaded and settings are configured

### Syntax Errors

**Problem**: JavaScript errors in console
- **Cause**: Invalid template syntax or missing quotes
- **Solution**: Check browser console, validate template syntax

### Unexpected Values

**Problem**: Wrong value appears
- **Cause**: Setting ID mismatch or wrong data type
- **Solution**: Verify setting ID matches exactly (case-sensitive)

### Broken HTML/CSS

**Problem**: Layout breaks or styles don't apply
- **Cause**: Special characters in setting values
- **Solution**: Sanitize/escape user input, use alternative quote styles

## Examples

### Complete Weather Widget

```html
<div class="weather-widget {{darkMode ? 'dark' : 'light'}}">
  <h2>{{locationName}}</h2>
  <div class="temp" style="font-size: {{fontSize}}px">
    {{temperature}}°{{units === 'celsius' ? 'C' : 'F'}}
  </div>
  <div class="forecast" style="display: {{showForecast ? 'block' : 'none'}}">
    5-day forecast
  </div>
</div>
```

### Complete News Feed

```javascript
async function loadNews() {
  const feed = await fetch('{{feedUrl}}');
  const data = await feed.json();

  const items = data.items
    .slice(0, {{maxItems}})
    .map(item => `
      <div class="news-item">
        ${{{showImages}} ? `<img src="${item.image}">` : ''}
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    `)
    .join('');

  document.querySelector('.news-container').innerHTML = items;
}

setInterval(loadNews, {{updateInterval}} * 1000);
loadNews();
```

## Further Reading

- [Settings Reference](./settings-reference.md) - All available setting types
- [Extension Structure](./extension-structure.md) - Overall JSON schema
- [Examples](./examples.md) - Complete extension examples
- [Best Practices](./best-practices.md) - Coding standards
