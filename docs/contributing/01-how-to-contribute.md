# How to Contribute

Thank you for your interest in contributing to QuantomOS! This guide will help you get started.

## Ways to Contribute

### 1. Report Bugs

Found a bug? Let us know!

**Steps**:
1. Check [existing issues](https://github.com/QuantomDevs/quantomos/issues) to avoid duplicates
2. Create new issue with template
3. Include:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment (OS, browser, version)
   - Console errors if any

**Good Bug Report Example**:
```markdown
**Bug**: Weather widget shows incorrect temperature

**Steps to Reproduce**:
1. Add weather widget
2. Set location to "London, UK"
3. Observe temperature display

**Expected**: Shows temperature in Celsius
**Actual**: Shows Fahrenheit

**Environment**: QuantomOS v1.3.2, Chrome 120, Ubuntu 22.04
```

### 2. Suggest Features

Have an idea? We'd love to hear it!

**Steps**:
1. Check existing feature requests
2. Create new issue with `[Feature Request]` label
3. Describe:
   - What feature you want
   - Why it's useful
   - How it might work
   - Mockups or examples (optional)

### 3. Improve Documentation

Documentation is always a work in progress!

**Contributions Welcome**:
- Fix typos and grammar
- Add missing information
- Improve clarity and examples
- Create tutorials
- Add screenshots/diagrams
- Translate to other languages (future)

### 4. Create Extensions

Build widgets for the community!

**Steps**:
1. Follow [Extension Development Guide](../developer-guide/02-extension-structure.md)
2. Test thoroughly
3. Document usage
4. Submit to marketplace repository
5. Share with community

### 5. Submit Code

Contribute to the codebase!

**What to Contribute**:
- Bug fixes
- New features
- Performance improvements
- Refactoring
- Tests
- UI/UX enhancements

## Pull Request Process

### 1. Fork and Clone

```bash
# Fork repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/quantomos.git
cd quantomos
```

### 2. Create Branch

```bash
# Create feature branch from main
git checkout -b feature/amazing-feature

# Or for bug fixes
git checkout -b fix/bug-description
```

**Branch Naming**:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Tests

### 3. Make Changes

Follow these guidelines:
- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation
- Add/update tests when applicable

### 4. Test Changes

```bash
# Run linters
npm run lint

# Test build
npm run build

# Run application
npm run dev
```

Ensure:
- Code lints without errors
- Application builds successfully
- Features work as expected
- No console errors
- Existing features still work

### 5. Commit Changes

Use conventional commit format:

```bash
git commit -m "feat: add amazing feature"
git commit -m "fix: resolve bug in weather widget"
git commit -m "docs: update installation guide"
git commit -m "refactor: improve API structure"
```

**Commit Types**:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting, missing semicolons
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance

### 6. Push to Fork

```bash
git push origin feature/amazing-feature
```

### 7. Create Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill in PR template:
   - **Title**: Clear, concise description
   - **Description**: What changes and why
   - **Related Issue**: Link to issue if applicable
   - **Testing**: How you tested
   - **Screenshots**: Visual changes

**Good PR Example**:
```markdown
## Description
Adds dark mode toggle to header for quick theme switching.

## Related Issue
Closes #123

## Changes
- Added theme toggle component
- Implemented dark/light mode switching
- Updated theme context
- Added persistence to local storage

## Testing
- [x] Tested toggle functionality
- [x] Verified theme persists on refresh
- [x] Checked all components in both modes
- [x] Tested on mobile and desktop

## Screenshots
[Screenshots of dark and light modes]
```

### 8. Code Review

Maintainers will review your PR:
- May request changes
- Provide feedback
- Ask questions

**Responding to Feedback**:
- Be open to suggestions
- Make requested changes
- Push updates to same branch
- Mark conversations as resolved

### 9. Merge

Once approved:
- PR will be merged by maintainer
- Your contribution becomes part of QuantomOS!
- You'll be added to contributors list

## Code Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Define proper types (avoid `any`)
- Use interfaces for object shapes
- Document public APIs with JSDoc

```typescript
/**
 * Fetches weather data for a given location
 * @param location - City name or coordinates
 * @param units - Temperature units (celsius/fahrenheit)
 * @returns Weather data object
 */
async function fetchWeather(
  location: string,
  units: 'celsius' | 'fahrenheit'
): Promise<WeatherData> {
  // Implementation
}
```

### React

- Use functional components
- Use hooks (useState, useEffect, etc.)
- Keep components focused and single-purpose
- Extract reusable logic to custom hooks
- Use proper prop types

```typescript
interface MyComponentProps {
  title: string;
  onClose: () => void;
  optional?: boolean;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onClose,
  optional = false
}) => {
  // Implementation
};
```

### Styling

- Use Material-UI components when possible
- Use Emotion for custom styles
- Always use CSS variables for colors
- Follow existing patterns
- Ensure responsive design

```typescript
const StyledComponent = styled.div`
  background: var(--color-secondary-background);
  color: var(--color-text-primary);
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;
```

### File Organization

- Keep related files together
- Use descriptive file names
- One component per file
- Index files for exports
- Types in separate files or co-located

## Testing

While comprehensive tests are a work in progress:
- Manually test all changes
- Test on multiple browsers (Chrome, Firefox, Safari)
- Test responsive design (mobile, tablet, desktop)
- Test with different configurations
- Check browser console for errors

## Documentation

Update documentation when:
- Adding new features
- Changing existing features
- Fixing bugs that affect usage
- Adding new APIs

Documentation locations:
- User-facing: `/docs/user-guide/`
- Developer: `/docs/developer-guide/`
- Code comments: Inline in code

## Need Help?

- [GitHub Discussions](https://github.com/QuantomDevs/quantomos/discussions) - Ask questions
- [Development Setup](./03-development-setup.md) - Setup guide
- [Code of Conduct](./02-code-of-conduct.md) - Community standards

## Recognition

Contributors are recognized:
- In release notes
- In contributors list
- On project website (future)

Thank you for contributing to QuantomOS! Every contribution helps make the project better for everyone.
