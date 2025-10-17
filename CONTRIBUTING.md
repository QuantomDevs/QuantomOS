# Contributing to QuantomOS

Thank you for your interest in contributing to QuantomOS! We welcome contributions from everyone. This document provides guidelines for contributing to the project.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Code Style Guidelines](#code-style-guidelines)
5. [Commit Message Format](#commit-message-format)
6. [Pull Request Process](#pull-request-process)
7. [Testing Requirements](#testing-requirements)
8. [Documentation Standards](#documentation-standards)
9. [Issue Reporting](#issue-reporting)
10. [Security Vulnerabilities](#security-vulnerabilities)

---

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of:
- Age
- Body size
- Disability
- Ethnicity
- Gender identity and expression
- Level of experience
- Nationality
- Personal appearance
- Race
- Religion
- Sexual identity and orientation

### Our Standards

**Positive behaviors include:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behaviors include:**
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** (v14+)
- **npm** (v6+)
- **Git**
- A code editor (VS Code recommended)
- Basic knowledge of JavaScript, HTML, CSS
- Familiarity with Express.js (for backend contributions)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/QuantomOS.git
cd QuantomOS
```

3. Add the upstream repository:

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/QuantomOS.git
```

4. Install dependencies:

```bash
npm install
```

---

## Development Setup

### Initial Setup

1. **Create a development branch:**

```bash
git checkout -b feature/your-feature-name
```

2. **Start the development server:**

```bash
npm start
```

3. **Access the application:**
   - Main page: http://localhost:3022/main
   - Admin panel: http://localhost:3022/admin

### Development Workflow

1. Make your changes in your feature branch
2. Test your changes thoroughly
3. Commit your changes with descriptive messages
4. Push to your fork
5. Create a Pull Request

### Keeping Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## Code Style Guidelines

QuantomOS follows the coding standards defined in `.claude/CLAUDE.md`. Please adhere to these guidelines:

### JavaScript Style

#### Naming Conventions

```javascript
// Variables and functions: camelCase
const appStore = {};
function loadApps() {}

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:3022';
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Classes: PascalCase
class AppManager {}

// Private variables: _prefixed (convention)
const _internalState = {};
```

#### Function Guidelines

```javascript
// ✅ GOOD: Focused, single-purpose function
function validateAppId(id) {
    return Number.isInteger(id) && id > 0 && id < 100000;
}

// ❌ BAD: Too many responsibilities
function handleAppOperations(app, operation, folder, settings) {
    // ... 200 lines of mixed logic
}
```

#### Comments and Documentation

```javascript
/**
 * Fetches all apps from the server
 * @returns {Promise<Array<App>>} Array of app objects
 * @throws {Error} If the API request fails
 */
async function fetchApps() {
    const response = await fetch('/api/apps');
    if (!response.ok) {
        throw new Error(`Failed to fetch apps: ${response.statusText}`);
    }
    return response.json();
}

// Use inline comments for complex logic
function calculateAppOrder() {
    // Sort apps by ID first to ensure consistent ordering
    apps.sort((a, b) => a.id - b.id);

    // Then apply custom user-defined order
    apps.forEach((app, index) => {
        app.order = index + 1; // 1-based indexing
    });
}
```

### CSS Style

#### Variable Usage

```css
/* ✅ GOOD: Use CSS variables from variables.css */
.app-card {
    background: var(--bg-secondary);
    padding: var(--spacing-md);
    border-radius: var(--radius-lg);
    color: var(--text-primary);
}

/* ❌ BAD: Hardcoded values */
.app-card {
    background: #1F1E1D;
    padding: 16px;
    border-radius: 12px;
    color: #f5f5f5;
}
```

#### Consistent Styling

```css
/* All buttons should use unified button system */
.btn {
    /* Base button styles */
}

.btn-primary {
    background: var(--accent-color);
}

.btn-secondary {
    background: var(--bg-tertiary);
}
```

### HTML Style

```html
<!-- ✅ GOOD: Semantic HTML -->
<section class="app-grid">
    <article class="app-card">
        <h3 class="app-name">Example App</h3>
        <p class="app-description">Description here</p>
    </article>
</section>

<!-- ❌ BAD: Non-semantic divs -->
<div class="apps">
    <div class="app">
        <div class="title">Example App</div>
        <div class="text">Description here</div>
    </div>
</div>
```

### Code Quality Checklist

Before submitting, ensure:

- [ ] No console.log statements (use logger utility instead)
- [ ] All variables are properly scoped (const/let, no var)
- [ ] Functions are small and focused (<50 lines ideally)
- [ ] Meaningful names for variables and functions
- [ ] Comments for complex logic
- [ ] No dead code or unused variables
- [ ] Proper error handling with try-catch
- [ ] Input validation for user data
- [ ] XSS prevention (use textContent, not innerHTML for user data)

---

## Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, no logic change)
- **refactor:** Code refactoring
- **perf:** Performance improvements
- **test:** Adding or updating tests
- **chore:** Maintenance tasks (dependencies, build config)
- **security:** Security fixes

### Examples

```bash
# Feature
git commit -m "feat(apps): add drag and drop reordering"

# Bug fix
git commit -m "fix(admin): resolve XSS vulnerability in app name display"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactoring
git commit -m "refactor(api): extract authentication middleware"

# Security
git commit -m "security(upload): add magic number validation for file uploads"
```

### Detailed Commit

```bash
git commit -m "feat(dashboard): add real-time server monitoring

- Implement SSH connection manager
- Add server statistics API endpoints
- Create dashboard UI components
- Add auto-refresh mechanism (30s interval)

Closes #123"
```

---

## Pull Request Process

### Before Submitting

1. **Update your branch:**

```bash
git fetch upstream
git rebase upstream/main
```

2. **Test your changes:**
   - Manual testing of affected features
   - Check browser console for errors
   - Test on different screen sizes (responsive)
   - Verify no regressions in existing features

3. **Review your code:**
   - Run through the Code Quality Checklist
   - Remove debug code and console.logs
   - Check for security issues (XSS, injection, etc.)

### Creating the Pull Request

1. **Push your branch:**

```bash
git push origin feature/your-feature-name
```

2. **Open a Pull Request on GitHub**

3. **Fill out the PR template:**

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
Describe how you tested your changes:
- [ ] Manual testing on desktop
- [ ] Manual testing on mobile
- [ ] Tested on Chrome, Firefox, Safari
- [ ] No console errors
- [ ] No regressions in existing features

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the code style of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] Any dependent changes have been merged and published

## Related Issues
Closes #issue_number
```

### Review Process

1. **Automated Checks:**
   - Code will be reviewed by maintainers
   - CI/CD pipeline will run (when implemented)

2. **Code Review:**
   - Maintainers will review your code
   - Address any feedback or requested changes
   - Push additional commits to your branch if needed

3. **Approval and Merge:**
   - Once approved, a maintainer will merge your PR
   - Your contribution will be included in the next release

### After Your PR is Merged

1. **Delete your feature branch:**

```bash
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

2. **Update your main branch:**

```bash
git checkout main
git pull upstream main
```

---

## Testing Requirements

### Current State

QuantomOS currently has 0% test coverage. While tests are not yet required for contributions, writing tests is highly encouraged.

### Future Testing Requirements

Once testing infrastructure is implemented (Phase 3):

#### Unit Tests

```javascript
// Example: tests/validateAppId.test.js
describe('validateAppId', () => {
    it('should accept valid IDs between 1 and 99999', () => {
        expect(validateAppId(1)).toBe(true);
        expect(validateAppId(100)).toBe(true);
        expect(validateAppId(99999)).toBe(true);
    });

    it('should reject invalid IDs', () => {
        expect(validateAppId(0)).toBe(false);
        expect(validateAppId(-1)).toBe(false);
        expect(validateAppId(100000)).toBe(false);
        expect(validateAppId('abc')).toBe(false);
    });
});
```

#### Integration Tests

```javascript
// Example: tests/api/apps.test.js
describe('GET /api/apps', () => {
    it('should return all apps', async () => {
        const response = await request(app).get('/api/apps');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('folders');
        expect(Array.isArray(response.body.folders)).toBe(true);
    });
});
```

### Manual Testing Checklist

For now, perform these manual tests:

#### Desktop Testing (Chrome, Firefox, Safari)
- [ ] Main page loads without errors
- [ ] Apps display correctly
- [ ] Drag and drop works
- [ ] Clicking apps opens correct links
- [ ] Admin panel loads
- [ ] CRUD operations work (Create, Read, Update, Delete)
- [ ] File uploads work
- [ ] Settings save correctly

#### Mobile Testing (iOS/Android)
- [ ] Responsive layout works
- [ ] Touch interactions work
- [ ] No horizontal scrolling
- [ ] Menus are accessible
- [ ] Forms are usable

#### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Documentation Standards

### When to Update Documentation

Update documentation when:
- Adding new features
- Changing existing functionality
- Fixing bugs that affect user behavior
- Modifying API endpoints
- Changing configuration options

### Documentation Files

- **README.md:** Overview, installation, features
- **USAGE.md:** Detailed usage instructions
- **CONTRIBUTING.md:** This file
- **API.md:** API documentation (to be created)
- **CHANGELOG.md:** Version history (to be created)

### Inline Documentation

```javascript
/**
 * JSDoc format for functions
 * @param {number} id - The app ID
 * @param {string} name - The app name
 * @returns {Object} The created app object
 * @throws {Error} If validation fails
 */
function createApp(id, name) {
    // Implementation
}
```

---

## Issue Reporting

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check documentation** for solutions
3. **Reproduce the bug** to confirm it's consistent
4. **Collect information:**
   - Browser and version
   - Operating system
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots or videos

### Issue Template

```markdown
## Description
Clear description of the issue.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Screenshots
If applicable, add screenshots.

## Environment
- Browser: [e.g., Chrome 96]
- OS: [e.g., macOS 12.1]
- Node.js version: [e.g., 16.13.0]
- QuantomOS version: [e.g., 1.0.0]

## Additional Context
Any other information about the problem.
```

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `security` - Security vulnerability
- `performance` - Performance improvement
- `refactoring` - Code refactoring

---

## Security Vulnerabilities

### Reporting Security Issues

**DO NOT** create a public issue for security vulnerabilities.

Instead:

1. **Email security@example.com** with details
2. **Include:**
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

3. **Wait for response** before public disclosure

### Security Best Practices

When contributing code:

- **Never commit sensitive data** (passwords, API keys, tokens)
- **Validate all user input** on both client and server
- **Sanitize output** to prevent XSS
- **Use parameterized queries** to prevent SQL injection
- **Implement proper authentication** for protected routes
- **Use HTTPS** in production
- **Keep dependencies updated** to patch vulnerabilities

### Known Security Issues

See the comprehensive security analysis report in the project documentation for current security issues that need addressing.

---

## Branch Naming

Use descriptive branch names:

```bash
# Features
feature/add-user-authentication
feature/server-monitoring-dashboard

# Bug fixes
fix/xss-vulnerability-in-app-names
fix/drag-drop-race-condition

# Documentation
docs/update-installation-guide
docs/add-api-documentation

# Refactoring
refactor/extract-api-middleware
refactor/simplify-drag-drop-logic
```

---

## Release Process

(For maintainers)

1. **Update version** in `package.json`
2. **Update CHANGELOG.md** with new features and fixes
3. **Create release tag:**

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

4. **Create GitHub Release** with release notes
5. **Publish to npm** (if applicable)

---

## Questions?

If you have questions about contributing:

- **Check the documentation:** README.md, USAGE.md
- **Ask in discussions:** GitHub Discussions
- **Contact maintainers:** contact@example.com

---

## Recognition

Contributors will be recognized in:

- CONTRIBUTORS.md file (to be created)
- Release notes
- Project README

---

## License

By contributing to QuantomOS, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to QuantomOS!** Every contribution, no matter how small, helps make the project better.

---

**Last Updated:** 2025-10-16
