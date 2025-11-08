# Troubleshooting

Common issues, error messages, debugging techniques, and solutions for QuantomOS extension development.

## Common Issues

### Extension Not Appearing

**Problem**: Extension doesn't show up in the widget selector

**Possible Causes**:
1. JSON syntax error
2. File not in `/extensions` directory
3. Missing required fields
4. Invalid extension ID

**Solutions**:
```bash
# 1. Validate JSON syntax
# Use an online JSON validator or:
cat your-extension.json | python -m json.tool

# 2. Check file location
ls extensions/your-extension.json

# 3. Verify required fields are present
# Must have: id, name, title, version, author, description, html
```

### Template Not Rendering

**Problem**: `{{placeholder}}` appears as literal text

**Cause**: Template variable doesn't match setting ID

**Solution**:
```json
// Setting ID
{
  "id": "apiKey",  // Must match exactly
  "name": "API Key",
  "type": "text",
  "defaultValue": ""
}

// Template usage - case sensitive!
"html": "Key: {{apiKey}}"  // ✓ Correct
"html": "Key: {{apikey}}"  // ✗ Wrong case
"html": "Key: {{api_key}}" // ✗ Wrong format
```

### CSS Not Applied

**Problem**: Styles don't appear or look wrong

**Debugging Steps**:
1. Check browser console for CSS syntax errors
2. Verify CSS string is properly escaped
3. Check Shadow DOM encapsulation
4. Validate color values

**Solutions**:
```json
// Bad: Unescaped quotes break JSON
{
  "css": ".widget { content: "test"; }"
}

// Good: Properly escaped
{
  "css": ".widget { content: \"test\"; }"
}

// Better: Use single quotes in CSS
{
  "css": ".widget { content: 'test'; }"
}

// Best: Avoid quotes when possible
{
  "css": ".widget { background: #1a1a1f; }"
}
```

### JavaScript Errors

**Problem**: Extension breaks with console errors

**Debugging**:
```javascript
// Add error handling
try {
  // Your code
  const data = await fetch('{{apiUrl}}');
} catch (error) {
  console.error('Extension error:', error);
  // Show user-friendly message
  document.querySelector('.error').textContent = 'Failed to load data';
}

// Add validation
const apiUrl = '{{apiUrl}}';
if (!apiUrl) {
  console.warn('API URL not configured');
  return;
}
```

**Common Errors**:

1. **"fetch is not defined"**
   - Cause: Browser doesn't support fetch
   - Solution: Use polyfill or XMLHttpRequest

2. **"Cannot read property of undefined"**
   - Cause: Accessing property on undefined/null
   - Solution: Use optional chaining
   ```javascript
   const value = data?.property?.nested;
   ```

3. **"Unexpected token"**
   - Cause: Syntax error in JavaScript string
   - Solution: Validate JavaScript syntax, escape quotes

### Settings Not Saving

**Problem**: Settings revert to default values

**Cause**: Usually a form validation or submission issue

**Solution**:
1. Check browser console for errors
2. Verify all setting IDs are unique
3. Test with simple values first
4. Check setting types match expected values

### API Calls Failing

**Problem**: Extension can't fetch external data

**Debugging**:
```javascript
async function fetchWithDebug(url) {
  console.log('Fetching:', url);

  try {
    const response = await fetch(url);
    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Data received:', data);
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
}
```

**Common Issues**:

1. **CORS Errors**
   - Problem: API blocks requests from your domain
   - Solution: Use CORS proxy or API that allows cross-origin requests
   ```javascript
   const proxyUrl = 'https://corsproxy.io/?';
   const apiUrl = proxyUrl + encodeURIComponent('{{apiUrl}}');
   ```

2. **Invalid API Key**
   - Problem: API returns 401/403
   - Solution: Verify API key is correct, check API documentation

3. **Rate Limiting**
   - Problem: Too many requests
   - Solution: Implement caching, increase update interval
   ```javascript
   const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
   let cache = { data: null, timestamp: 0 };

   async function getData() {
     if (Date.now() - cache.timestamp < CACHE_DURATION) {
       return cache.data;
     }
     cache.data = await fetch('{{apiUrl}}');
     cache.timestamp = Date.now();
     return cache.data;
   }
   ```

## Error Messages

### "Invalid JSON"

**Full Error**: "SyntaxError: Unexpected token..."

**Causes**:
- Missing comma between properties
- Trailing comma (not allowed in JSON)
- Unescaped quotes in strings
- Single quotes (JSON requires double quotes)

**Fix**:
```json
// Bad
{
  "id": "test"
  "name": "Test"  // Missing comma
}

// Bad
{
  "id": "test",
  "name": "Test",  // Trailing comma
}

// Good
{
  "id": "test",
  "name": "Test"
}
```

### "Required field missing"

**Error**: Extension won't load

**Solution**: Ensure all required fields are present:
```json
{
  "id": "required",
  "name": "required",
  "title": "required",
  "version": "required",
  "author": "required",
  "description": "required",
  "html": "required"
}
```

### "Duplicate extension ID"

**Error**: Extension with same ID already exists

**Solution**: Choose a unique ID:
```json
{
  "id": "my-unique-extension-name-v2"
}
```

## Debugging Techniques

### 1. Browser Developer Tools

**Open Console**:
- Chrome/Edge: `Ctrl+Shift+J` (Windows) or `Cmd+Option+J` (Mac)
- Firefox: `Ctrl+Shift+K` (Windows) or `Cmd+Option+K` (Mac)

**Inspect Element**:
- Right-click on extension → Inspect
- Check Shadow DOM in Elements tab

**Network Tab**:
- Monitor API calls
- Check response status codes
- View request/response data

### 2. Console Logging

Add strategic log statements:

```javascript
console.log('Extension initialized');
console.log('Settings:', { apiUrl: '{{apiUrl}}', interval: {{updateInterval}} });

async function fetchData() {
  console.log('Fetching data...');
  const data = await fetch('{{apiUrl}}');
  console.log('Data received:', data);
  return data;
}
```

### 3. Error Boundaries

Wrap risky code in try-catch:

```javascript
async function safeInit() {
  try {
    await initialize();
  } catch (error) {
    console.error('Initialization failed:', error);
    showErrorMessage('Failed to load extension');
  }
}
```

### 4. Validation Functions

Create validation helpers:

```javascript
function validateSettings() {
  const errors = [];

  if (!{{apiUrl}}) {
    errors.push('API URL is required');
  }

  if ({{updateInterval}} < 60) {
    errors.push('Update interval must be at least 60 seconds');
  }

  if (errors.length > 0) {
    console.error('Settings validation failed:', errors);
    return false;
  }

  return true;
}

if (validateSettings()) {
  start();
}
```

## Performance Issues

### Extension Loading Slowly

**Causes**:
- Large images
- Heavy API calls on init
- Complex DOM manipulation
- Too many elements

**Solutions**:

1. **Lazy Load Images**:
```javascript
const img = new Image();
img.onload = () => container.appendChild(img);
img.src = '{{imageUrl}}';
```

2. **Defer Heavy Operations**:
```javascript
// Don't do this on load
setTimeout(() => {
  heavyOperation();
}, 1000);
```

3. **Optimize DOM Updates**:
```javascript
// Bad: Multiple updates
items.forEach(item => {
  container.innerHTML += `<div>${item}</div>`;
});

// Good: Single update
const html = items.map(item => `<div>${item}</div>`).join('');
container.innerHTML = html;
```

### High Memory Usage

**Causes**:
- Memory leaks
- Large cached data
- Uncleared intervals

**Solutions**:

1. **Clear Intervals**:
```javascript
let intervalId;

function start() {
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(update, {{updateInterval}} * 1000);
}
```

2. **Limit Cache Size**:
```javascript
const cache = new Map();
const MAX_CACHE_SIZE = 100;

function addToCache(key, value) {
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  cache.set(key, value);
}
```

3. **Remove Event Listeners**:
```javascript
const handler = () => console.log('clicked');
element.addEventListener('click', handler);

// Later
element.removeEventListener('click', handler);
```

## Testing Strategies

### 1. Test in Isolation

Create a standalone HTML file:

```html
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

### 2. Test Different Settings

Try edge cases:
- Empty strings
- Very large numbers
- Special characters
- Long text

### 3. Test Error Conditions

Simulate failures:
- Disconnect network
- Use invalid API keys
- Provide malformed data

### 4. Cross-Browser Testing

Test in multiple browsers:
- Chrome
- Firefox
- Safari
- Edge

## Getting Help

If you're still stuck:

1. **Check Documentation**:
   - [Extension Structure](./extension-structure.md)
   - [Settings Reference](./settings-reference.md)
   - [Template System](./template-system.md)
   - [Best Practices](./best-practices.md)

2. **Review Examples**:
   - [Examples](./examples.md)

3. **Check Console**:
   - Browser developer tools
   - Look for error messages
   - Check network requests

4. **Simplify**:
   - Start with minimal extension
   - Add features incrementally
   - Test after each change

5. **Community**:
   - GitHub Issues
   - Community forums
   - Discord/Slack channels

## Quick Reference

### Validation Checklist

- [ ] JSON is valid (use validator)
- [ ] All required fields present
- [ ] Extension ID is unique
- [ ] Settings have matching templates
- [ ] CSS syntax is correct
- [ ] JavaScript has no errors
- [ ] API calls handle errors
- [ ] Tested in browser
- [ ] No console errors
- [ ] Works with different settings

### Common Fixes

| Problem | Quick Fix |
|---------|-----------|
| Template not working | Check setting ID matches exactly |
| CSS not applied | Escape quotes, check syntax |
| JS error | Add try-catch, check console |
| API failing | Add error handling, check CORS |
| Slow loading | Optimize, defer heavy operations |
| Memory leak | Clear intervals, remove listeners |

## Further Reading

- [Extension Structure](./extension-structure.md)
- [Settings Reference](./settings-reference.md)
- [Best Practices](./best-practices.md)
- [Examples](./examples.md)
