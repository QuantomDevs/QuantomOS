# API Reference

Reference documentation for APIs and utilities available to QuantomOS extensions.

## Overview

Extensions run in an isolated context with access to standard web APIs. This document covers available APIs, limitations, and best practices.

## Standard Web APIs

### DOM APIs

All standard DOM manipulation methods are available:

```javascript
// Query elements
document.querySelector('.my-element')
document.querySelectorAll('.items')
document.getElementById('item-id')

// Create elements
document.createElement('div')
document.createTextNode('text')

// Modify elements
element.innerHTML = '<p>content</p>'
element.textContent = 'text only'
element.setAttribute('data-value', '123')
element.classList.add('active')
```

### Fetch API

Make HTTP requests to external APIs:

```javascript
// GET request
const response = await fetch('https://api.example.com/data');
const data = await response.json();

// POST request
const response = await fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ key: 'value' })
});
```

### Timers

Schedule code execution:

```javascript
// One-time execution
setTimeout(() => {
  console.log('Delayed');
}, 1000);

// Repeated execution
const intervalId = setInterval(() => {
  updateData();
}, {{updateInterval}} * 1000);

// Clear interval
clearInterval(intervalId);
```

### Local Storage

Persist data locally:

```javascript
// Save data
localStorage.setItem('extensionData', JSON.stringify(data));

// Load data
const saved = localStorage.getItem('extensionData');
const data = saved ? JSON.parse(saved) : null;

// Remove data
localStorage.removeItem('extensionData');

// Clear all
localStorage.clear();
```

**Note**: Use a unique prefix to avoid conflicts:
```javascript
const PREFIX = 'myExtension_';
localStorage.setItem(PREFIX + 'settings', JSON.stringify(settings));
```

### Console API

Logging and debugging:

```javascript
console.log('Info message', data);
console.error('Error occurred:', error);
console.warn('Warning message');
console.table(arrayOfObjects);
console.time('operation');
// ... code ...
console.timeEnd('operation');
```

## Extension Context

### Available Globals

Extensions have access to:

```javascript
// Standard JavaScript
window
document
console
fetch
setTimeout
setInterval
localStorage
sessionStorage

// Modern JavaScript features
Promise
async/await
Array methods (map, filter, reduce, etc.)
Object methods
String methods
```

### Shadow DOM Context

Your extension runs in a Shadow DOM:

```javascript
// This searches within your extension only
const element = document.querySelector('.my-element');

// Event listeners work normally
element.addEventListener('click', handleClick);

// Styles are scoped to your extension
const style = document.createElement('style');
style.textContent = '.widget { color: red; }';
document.head.appendChild(style);
```

## Theme Variables

Access dashboard theme colors via CSS custom properties:

```javascript
// Get theme color value
const primaryAccent = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-primary-accent');

// Use in JavaScript
element.style.backgroundColor = `var(--color-primary-accent)`;
```

### Available Theme Variables

```javascript
// Background colors
'--color-background'
'--color-widget-background'
'--color-header-background'
'--color-sidebar-background'
'--color-secondary-background'

// Accent colors
'--color-primary-accent'
'--color-secondary-accent'
'--color-success'
'--color-warning'
'--color-error'

// Text colors
'--color-primary-text'
'--color-secondary-text'

// Border colors
'--color-border'
'--color-hover-border'

// Effects
'--backdrop-blur'
```

## Limitations

### What's NOT Available

1. **Dashboard APIs**: Cannot directly access dashboard internals
2. **Other Extensions**: Cannot communicate with other extensions
3. **Parent DOM**: Cannot modify elements outside Shadow DOM
4. **File System**: No direct file system access (browser security)
5. **System Commands**: Cannot execute system commands

### Security Restrictions

```javascript
// ✗ Cannot access dashboard elements
document.querySelector('.dashboard-header') // null in Shadow DOM

// ✗ Cannot access other extensions
window.otherExtension // undefined

// ✗ Cannot execute arbitrary code from user
eval(userInput) // Dangerous, avoid

// ✓ Can make fetch requests
fetch('https://api.example.com/data') // Allowed

// ✓ Can use localStorage
localStorage.setItem('key', 'value') // Allowed
```

## Best Practices

### 1. Namespace Your Data

```javascript
const NAMESPACE = 'myExtension_';

function saveData(key, value) {
  localStorage.setItem(NAMESPACE + key, JSON.stringify(value));
}

function loadData(key, defaultValue = null) {
  const item = localStorage.getItem(NAMESPACE + key);
  return item ? JSON.parse(item) : defaultValue;
}
```

### 2. Handle API Errors

```javascript
async function safeApiFetch(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API fetch failed:', error);
    return null;
  }
}
```

### 3. Clean Up Resources

```javascript
let intervalId = null;
let eventHandlers = [];

function start() {
  // Clear existing interval
  if (intervalId) {
    clearInterval(intervalId);
  }

  // Start new interval
  intervalId = setInterval(update, 1000);

  // Store event handler reference
  const handler = () => console.log('clicked');
  element.addEventListener('click', handler);
  eventHandlers.push({ element, type: 'click', handler });
}

function cleanup() {
  // Clear interval
  if (intervalId) {
    clearInterval(intervalId);
  }

  // Remove event listeners
  eventHandlers.forEach(({ element, type, handler }) => {
    element.removeEventListener(type, handler);
  });
  eventHandlers = [];
}
```

### 4. Use Async/Await

```javascript
// Modern approach
async function loadData() {
  try {
    const response = await fetch('{{apiUrl}}');
    const data = await response.json();
    displayData(data);
  } catch (error) {
    displayError(error);
  }
}

// Older Promise approach (also works)
function loadData() {
  fetch('{{apiUrl}}')
    .then(response => response.json())
    .then(data => displayData(data))
    .catch(error => displayError(error));
}
```

## Common Patterns

### Debouncing

```javascript
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Usage
const debouncedUpdate = debounce(() => {
  fetchAndUpdateData();
}, 1000);

element.addEventListener('input', debouncedUpdate);
```

### Retry Logic

```javascript
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### Polling with Error Handling

```javascript
async function poll() {
  try {
    const data = await fetch('{{apiUrl}}');
    updateUI(data);
  } catch (error) {
    console.error('Poll failed:', error);
    // Continue polling despite error
  } finally {
    setTimeout(poll, {{updateInterval}} * 1000);
  }
}

poll(); // Start polling
```

## Examples

### Complete API Integration

```javascript
class WeatherAPI {
  constructor(apiKey, city) {
    this.apiKey = apiKey;
    this.city = city;
    this.cache = { data: null, timestamp: 0 };
    this.cacheDuration = 10 * 60 * 1000; // 10 minutes
  }

  async fetch() {
    // Check cache
    if (this.isCacheValid()) {
      return this.cache.data;
    }

    // Fetch new data
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${this.apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // Update cache
      this.cache = {
        data,
        timestamp: Date.now()
      };

      return data;
    } catch (error) {
      console.error('Weather API error:', error);
      throw error;
    }
  }

  isCacheValid() {
    return this.cache.data &&
           (Date.now() - this.cache.timestamp) < this.cacheDuration;
  }
}

// Usage
const weather = new WeatherAPI('{{apiKey}}', '{{city}}');
weather.fetch().then(data => console.log(data));
```

### State Management

```javascript
const state = {
  loading: false,
  error: null,
  data: null,

  setLoading(isLoading) {
    this.loading = isLoading;
    this.render();
  },

  setError(error) {
    this.error = error;
    this.loading = false;
    this.render();
  },

  setData(data) {
    this.data = data;
    this.loading = false;
    this.error = null;
    this.render();
  },

  render() {
    const container = document.querySelector('.widget-container');

    if (this.loading) {
      container.innerHTML = '<div class="loading">Loading...</div>';
      return;
    }

    if (this.error) {
      container.innerHTML = `<div class="error">${this.error}</div>`;
      return;
    }

    if (this.data) {
      container.innerHTML = `<div class="content">${this.data.value}</div>`;
    }
  }
};

// Usage
state.setLoading(true);
fetch('{{apiUrl}}')
  .then(r => r.json())
  .then(data => state.setData(data))
  .catch(error => state.setError(error.message));
```

## Further Reading

- [Extension Structure](./extension-structure.md)
- [Template System](./template-system.md)
- [Best Practices](./best-practices.md)
- [MDN Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)
