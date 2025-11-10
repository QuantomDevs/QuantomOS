# Development Setup

Comprehensive guide to setting up your QuantomOS development environment.

## Prerequisites

Before you begin, ensure you have:
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **Git**: Latest version
- **Code Editor**: VS Code recommended

## Initial Setup

### 1. Fork and Clone

```bash
# Fork repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/quantomos.git
cd quantomos

# Add upstream remote
git remote add upstream https://github.com/QuantomDevs/quantomos.git
```

### 2. Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm install
```

This installs:
- Backend dependencies
- Frontend dependencies
- Development tools

### 3. Create Environment File

```bash
# Generate secure secret
echo "SECRET=$(openssl rand -base64 32)" > .env
echo "PORT=2525" >> .env
echo "NODE_ENV=development" >> .env
```

### 4. Verify Setup

```bash
# Check Node.js version
node --version  # Should be v18.x or higher

# Check npm version
npm --version   # Should be 9.x or higher

# Verify dependencies installed
ls node_modules  # Should see packages
```

## Development Workflow

### Start Development Servers

```bash
# Start both backend and frontend
npm run dev
```

This starts:
- **Backend**: http://localhost:2525
- **Frontend**: http://localhost:5173

Both servers support hot reload - changes reflect immediately.

### Individual Services

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

## Project Structure

```
quantomos/
├── src/
│   ├── backend/        # Express server
│   └── frontend/       # React app
├── public/             # Static assets
├── config/             # Configuration
├── extensions/         # Custom widgets
└── docs/               # Documentation
```

## Code Style

### ESLint

Linting is configured for both backend and frontend:

```bash
# Lint everything
npm run lint

# Lint backend only
npm run lint:backend

# Lint frontend only
npm run lint:frontend
```

**Auto-fix**:
```bash
# Add --fix flag (not in package.json, manual)
eslint src/backend --fix
eslint src/frontend --fix
```

### TypeScript

Strict mode enabled:
- Type safety enforced
- No implicit `any`
- Strict null checks
- No unused variables

**Type Checking**:
```bash
# Check backend types
tsc --noEmit -p tsconfig.backend.json

# Check frontend types
tsc --noEmit -p tsconfig.frontend.json
```

## Building

### Production Build

```bash
# Build both backend and frontend
npm run build
```

Outputs:
- Backend: `dist/backend/`
- Frontend: `dist/frontend/`

### Individual Builds

```bash
# Build backend
npm run build:backend

# Build frontend
npm run build:frontend
```

### Test Production Build

```bash
# Build first
npm run build

# Start production server
npm start
```

Access at http://localhost:2022

## Development Tools

### Recommended VS Code Extensions

- **ESLint**: Microsoft
- **TypeScript**: Built-in
- **Prettier**: esbenp.prettier-vscode
- **Auto Rename Tag**: formulahendry.auto-rename-tag
- **Path Intellisense**: christian-kohler.path-intellisense
- **GitLens**: eamodio.gitlens

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

## Debugging

### Frontend Debugging

Use browser DevTools:
1. Open DevTools (F12)
2. Sources tab
3. Set breakpoints
4. Refresh page

**React DevTools**:
- Install React DevTools extension
- Inspect component tree
- View props and state

### Backend Debugging

Use VS Code debugger:

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev:backend"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

Set breakpoints and press F5 to debug.

## Testing Changes

### Manual Testing

1. **Functionality**: Test new features work
2. **Existing Features**: Ensure nothing broke
3. **Browsers**: Test in Chrome, Firefox, Safari
4. **Responsive**: Test on mobile, tablet, desktop
5. **Console**: Check for errors
6. **Network**: Verify API calls succeed

### Performance Testing

Check for performance issues:
- Use browser Performance tab
- Monitor memory usage
- Check for memory leaks
- Test with many widgets

## Git Workflow

### Staying Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge into main
git checkout main
git merge upstream/main

# Push to your fork
git push origin main
```

### Creating Feature Branch

```bash
# Update main first
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature

# Make changes, commit
git add .
git commit -m "feat: add your feature"

# Push to your fork
git push origin feature/your-feature
```

### Keeping Branch Updated

```bash
# Fetch latest upstream
git fetch upstream

# Rebase on upstream/main
git rebase upstream/main

# Force push if needed (after rebase)
git push origin feature/your-feature --force-with-lease
```

## Common Development Tasks

### Add New Widget

1. Create component in `src/frontend/components/dashboard/base-items/widgets/`
2. Add to `ITEM_TYPE` enum
3. Register in widget selector
4. Create configuration form
5. Add mock data if needed
6. Test thoroughly
7. Document in `/docs/user-guide/02-widgets/`

### Add New API Endpoint

1. Create route in `src/backend/routes/`
2. Add controller logic
3. Update API client in `src/frontend/api/dash-api.ts`
4. Add types if needed
5. Document in `docs/developer-guide/03-api-reference.md`

### Add New Setting

1. Update config type
2. Add UI in settings panel
3. Update context
4. Save to config file
5. Document in `docs/user-guide/03-settings.md`

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :2525
lsof -i :5173

# Kill process
kill -9 <PID>
```

### Dependencies Won't Install

```bash
# Clean install
npm run clean
npm install
```

### Build Errors

```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

### TypeScript Errors

```bash
# Check types
tsc --noEmit
```

## Next Steps

- [How to Contribute](./01-how-to-contribute.md) - Contribution guidelines
- [Developer Introduction](../developer-guide/01-introduction.md) - Architecture overview
- [Extension Development](../developer-guide/02-extension-structure.md) - Create extensions

## Getting Help

- [GitHub Issues](https://github.com/QuantomDevs/quantomos/issues)
- [GitHub Discussions](https://github.com/QuantomDevs/quantomos/discussions)
- Check existing documentation

Happy coding! 🚀
