# Best Practices

Coding standards, performance tips, accessibility guidelines, and design patterns for creating high-quality QuantomOS extensions.

## Code Quality

### 1. Keep It Simple
- Write clear, readable code
- Avoid unnecessary complexity
- Use descriptive variable names
- Comment complex logic

### 2. Follow Standards
- Use modern JavaScript (ES6+)
- Write semantic HTML
- Use CSS custom properties
- Follow accessibility guidelines

### 3. Test Thoroughly
- Test with different settings
- Test on various screen sizes
- Check browser console for errors
- Verify in both light and dark themes

## Performance

### 1. Optimize API Calls
```javascript
// Good: Debounce frequent updates
let timeout;
function updateData() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    fetch('{{apiUrl}}').then(/* ... */);
  }, {{updateInterval}} * 1000);
}

// Bad: Constant polling
setInterval(() => {
  fetch('{{apiUrl}}'); // Too frequent
}, 100);
```

### 2. Minimize DOM Manipulation
```javascript
// Good: Update once
const items = data.map(item => `<div>${item.name}</div>`).join('');
container.innerHTML = items;

// Bad: Update repeatedly
data.forEach(item => {
  container.innerHTML += `<div>${item.name}</div>`;
});
```

### 3. Use Efficient Selectors
```javascript
// Good: Specific selector
const button = document.querySelector('.widget-btn');

// Avoid: Overly broad
const button = document.querySelector('*[class*="btn"]');
```

### 4. Lazy Load Resources
```javascript
// Load images only when needed
const img = new Image();
img.onload = () => {
  container.appendChild(img);
};
img.src = '{{imageUrl}}';
```

## Accessibility

### 1. Semantic HTML
```html
<!-- Good: Semantic elements -->
<article class="news-item">
  <h2>{{title}}</h2>
  <p>{{content}}</p>
</article>

<!-- Bad: Generic divs -->
<div class="news-item">
  <div class="title">{{title}}</div>
  <div class="content">{{content}}</div>
</div>
```

### 2. ARIA Labels
```html
<button aria-label="Refresh widget data">
  ↻
</button>

<div role="status" aria-live="polite">
  {{statusMessage}}
</div>
```

### 3. Keyboard Navigation
```javascript
// Make interactive elements keyboard accessible
button.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleClick();
  }
});
```

### 4. Color Contrast
```css
/* Ensure sufficient contrast */
.text {
  /* Good: WCAG AA compliant */
  background: #1a1a1f;
  color: #f3f4f6;
}
```

### 5. Focus Indicators
```css
button:focus {
  outline: 2px solid var(--color-primary-accent);
  outline-offset: 2px;
}
```

## Security

### 1. Sanitize User Input
```javascript
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

const safe = escapeHtml(userInput);
```

### 2. Validate URLs
```javascript
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

if (isValidUrl('{{apiUrl}}')) {
  fetch('{{apiUrl}}');
}
```

### 3. Use HTTPS
```javascript
// Always use HTTPS for API calls
const apiUrl = '{{apiEndpoint}}'.replace('http://', 'https://');
```

### 4. Avoid eval()
```javascript
// Bad: Security risk
eval(userCode);

// Good: Use safer alternatives
const func = new Function('param', userCode);
```

## Error Handling

### 1. Graceful Degradation
```javascript
async function fetchData() {
  try {
    const response = await fetch('{{apiUrl}}');
    if (!response.ok) throw new Error('API error');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch:', error);
    return { error: 'Unable to load data' };
  }
}
```

### 2. User-Friendly Messages
```javascript
function displayError(message) {
  const errorDiv = document.querySelector('.error-message');
  errorDiv.textContent = 'Oops! ' + message;
  errorDiv.style.display = 'block';
}
```

### 3. Timeout Handling
```javascript
function fetchWithTimeout(url, timeout = 5000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}
```

## Responsive Design

### 1. Flexible Layouts
```css
.widget {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .widget {
    font-size: 14px;
    padding: 0.75rem;
  }
}
```

### 2. Relative Units
```css
/* Good: Scalable */
.title {
  font-size: 1.5rem;
  padding: 1rem;
}

/* Avoid: Fixed pixels for everything */
.title {
  font-size: 24px;
  padding: 16px;
}
```

### 3. Container Queries
```css
.widget-item {
  display: flex;
  gap: 1rem;
}

/* Adapt to container size */
@container (max-width: 400px) {
  .widget-item {
    flex-direction: column;
  }
}
```

## Code Organization

### 1. Modular Structure
```javascript
// Separate concerns
const DataService = {
  async fetch() { /* ... */ },
  cache: {}
};

const UI = {
  render(data) { /* ... */ },
  update(data) { /* ... */ }
};

// Use them together
DataService.fetch().then(UI.render);
```

### 2. Constants
```javascript
// Define at top
const API_ENDPOINT = '{{apiUrl}}';
const REFRESH_INTERVAL = {{updateInterval}} * 1000;
const MAX_ITEMS = {{maxItems}};

// Use throughout
fetch(API_ENDPOINT);
```

### 3. Reusable Functions
```javascript
function createElement(tag, className, content) {
  const el = document.createElement(tag);
  el.className = className;
  el.textContent = content;
  return el;
}

// Reuse
const title = createElement('h2', 'title', '{{title}}');
```

## Styling Best Practices

### 1. Use Theme Variables
```css
.widget {
  background: var(--color-widget-background);
  color: var(--color-primary-text);
  border: 1px solid var(--color-border);
}
```

### 2. BEM Naming (Optional)
```css
/* Block */
.weather-widget {}

/* Element */
.weather-widget__title {}

/* Modifier */
.weather-widget--dark {}
```

### 3. Consistent Spacing
```css
.widget {
  --spacing-unit: 1rem;
  padding: var(--spacing-unit);
  margin-bottom: calc(var(--spacing-unit) * 2);
}
```

### 4. Transitions
```css
.button {
  transition: all 0.2s ease;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
```

## Data Management

### 1. Caching
```javascript
const cache = {
  data: null,
  timestamp: 0,
  maxAge: 5 * 60 * 1000 // 5 minutes
};

async function getData() {
  const now = Date.now();
  if (cache.data && (now - cache.timestamp) < cache.maxAge) {
    return cache.data;
  }

  cache.data = await fetch('{{apiUrl}}').then(r => r.json());
  cache.timestamp = now;
  return cache.data;
}
```

### 2. State Management
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
    this.render();
  },

  setData(data) {
    this.data = data;
    this.error = null;
    this.render();
  },

  render() {
    // Update UI based on state
  }
};
```

### 3. Local Storage
```javascript
// Save state
function saveState(key, value) {
  localStorage.setItem(`extension_${key}`, JSON.stringify(value));
}

// Load state
function loadState(key, defaultValue) {
  const saved = localStorage.getItem(`extension_${key}`);
  return saved ? JSON.parse(saved) : defaultValue;
}
```

## Documentation

### 1. Comment Complex Logic
```javascript
// Calculate the optimal number of columns based on container width
// Uses golden ratio (1.618) for aesthetically pleasing layout
function calculateColumns(containerWidth) {
  const minColumnWidth = 200;
  const optimalColumns = Math.floor(containerWidth / (minColumnWidth * 1.618));
  return Math.max(1, optimalColumns);
}
```

### 2. JSDoc for Functions
```javascript
/**
 * Fetches weather data for a given location
 * @param {string} location - City name or coordinates
 * @param {string} units - Temperature units ('celsius' or 'fahrenheit')
 * @returns {Promise<Object>} Weather data object
 */
async function getWeather(location, units) {
  // Implementation
}
```

### 3. README for Complex Extensions
Create a separate README if your extension is complex:

```markdown
# Weather Widget Extension

## Features
- Real-time weather data
- 5-day forecast
- Multiple locations

## Settings
- `location`: City name
- `units`: Temperature units
- `updateInterval`: Refresh rate

## API Key
Required. Get one at weatherapi.com
```

## Testing Checklist

Before publishing an extension:

- [ ] Tested with all setting combinations
- [ ] Tested on mobile and desktop
- [ ] No console errors
- [ ] Handles API failures gracefully
- [ ] Accessible via keyboard
- [ ] Good color contrast
- [ ] Works in dark and light themes
- [ ] No memory leaks
- [ ] Reasonable performance
- [ ] Code is documented
- [ ] Settings have descriptions
- [ ] Template placeholders are valid

## Common Pitfalls

### 1. Memory Leaks
```javascript
// Bad: Creates new interval on every update
function start() {
  setInterval(update, 1000);
}

// Good: Store and clear intervals
let intervalId;
function start() {
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(update, 1000);
}
```

### 2. Blocking the Main Thread
```javascript
// Bad: Synchronous heavy operation
for (let i = 0; i < 1000000; i++) {
  // Heavy computation
}

// Good: Use async/await or Web Workers
async function heavyTask() {
  return new Promise(resolve => {
    setTimeout(() => {
      // Heavy computation
      resolve(result);
    }, 0);
  });
}
```

### 3. Not Handling Edge Cases
```javascript
// Handle missing data
const title = data?.title || 'Untitled';
const count = items?.length ?? 0;

// Handle empty states
if (!items || items.length === 0) {
  container.innerHTML = '<p>No items to display</p>';
  return;
}
```

## Versioning

Use semantic versioning:

**1.0.0** → **1.0.1** (Bug fix)
**1.0.0** → **1.1.0** (New feature, backward compatible)
**1.0.0** → **2.0.0** (Breaking change)

Update version when:
- Fixing bugs (patch)
- Adding features (minor)
- Changing structure or breaking compatibility (major)

## Further Reading

- [Extension Structure](./extension-structure.md)
- [Settings Reference](./settings-reference.md)
- [Template System](./template-system.md)
- [Examples](./examples.md)
