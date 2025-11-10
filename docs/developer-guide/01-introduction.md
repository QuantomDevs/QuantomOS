# Developer Introduction

Welcome to the QuantomOS developer documentation. This guide will help you understand the architecture, contribute to the project, and create custom extensions.

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Key Concepts](#key-concepts)

---

## Project Overview

QuantomOS is a modern, customizable dashboard system built with TypeScript, React, and Express. It provides a flexible, widget-based interface for monitoring and managing homelab infrastructure.

### Design Philosophy

**Core Principles**:
- **Modularity**: Everything is a widget or extension
- **Customizability**: Users control appearance and layout
- **Privacy**: All data stored locally with encryption
- **Performance**: Optimized for 24/7 operation
- **Extensibility**: Easy to add new widgets and features

### Project Goals

1. **User-Friendly**: Intuitive interface for all skill levels
2. **Feature-Rich**: Comprehensive widget library
3. **Secure**: Privacy-first with strong encryption
4. **Performant**: Fast, responsive, and efficient
5. **Maintainable**: Clean code, good documentation

---

## Technology Stack

### Backend

**Runtime & Framework**:
- **Node.js**: 18.x or higher
- **Express.js**: 4.21.2 - Web server framework
- **TypeScript**: 5.7.3 - Type-safe JavaScript

**Key Libraries**:
- **jsonwebtoken**: JWT authentication
- **bcrypt**: Password hashing
- **multer**: File uploads
- **systeminformation**: System metrics
- **node-ical**: Calendar integration

**Build Tools**:
- **esbuild**: Fast JavaScript bundler
- **ts-node**: TypeScript execution
- **nodemon**: Development auto-restart

### Frontend

**Core Framework**:
- **React**: 18.3.1 - UI library
- **TypeScript**: 5.7.3 - Type safety
- **Vite**: 6.2.2 - Build tool and dev server

**UI Framework**:
- **Material-UI (MUI)**: 6.4.3 - Component library
- **Emotion**: CSS-in-JS styling
- **@mui/x-charts**: Data visualization

**State & Routing**:
- **React Context API**: State management
- **React Router DOM**: 7.2.0 - Client-side routing

**Drag & Drop**:
- **@dnd-kit/core**: 6.3.1 - Drag and drop
- **@dnd-kit/sortable**: 10.0.0 - Sortable lists

**Other Libraries**:
- **axios**: 1.8.3 - HTTP client
- **react-hook-form**: 7.54.2 - Form management
- **react-markdown**: 10.1.0 - Markdown rendering
- **sweetalert2**: 11.16.0 - Beautiful alerts

### Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Concurrently**: Run multiple commands
- **Docker**: Containerization
- **Git**: Version control

---

## Architecture

QuantomOS follows a client-server architecture with clear separation between frontend and backend.

### High-Level Architecture

```
┌─────────────────────────────────────────┐
│           Client (Browser)              │
│  ┌───────────────────────────────────┐  │
│  │         React Frontend            │  │
│  │  - Components (Widgets, UI)       │  │
│  │  - Context (State Management)     │  │
│  │  - API Client (Axios)             │  │
│  └───────────────────────────────────┘  │
└──────────────────┬──────────────────────┘
                   │ HTTPS/WebSocket
                   │
┌──────────────────▼──────────────────────┐
│        Express Backend Server           │
│  ┌───────────────────────────────────┐  │
│  │   Routes & Controllers            │  │
│  │  - Auth, Config, Media, etc.      │  │
│  ├───────────────────────────────────┤  │
│  │   Middleware                      │  │
│  │  - Authentication, Rate Limiting  │  │
│  ├───────────────────────────────────┤  │
│  │   Services                        │  │
│  │  - System Info, iCal, etc.        │  │
│  └───────────────────────────────────┘  │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│       File System Storage               │
│  - config/config.json                   │
│  - public/uploads/                      │
│  - extensions/*.json                    │
└─────────────────────────────────────────┘
```

### Frontend Architecture

**Component Hierarchy**:
```
App
├── AppContextProvider (Global State)
│   ├── Router
│   │   ├── LoginPage
│   │   ├── SetupPage
│   │   └── DashboardPage
│   │       ├── Header (Navigation)
│   │       ├── WidgetGrid (Layout)
│   │       │   └── Widgets (Individual Items)
│   │       └── Modals (Settings, Add Widget, etc.)
│   └── Notifications (Toasts)
```

**Data Flow**:
1. **User Action** → Event Handler
2. **Event Handler** → API Call (via axios)
3. **API Response** → Context Update
4. **Context Update** → Component Re-render

**State Management**:
- **AppContext**: Global app state (user, config, layout)
- **Component State**: Local UI state (modals, forms)
- **React Hook Form**: Form state management

### Backend Architecture

**Layer Structure**:
```
┌─────────────────────────────────┐
│         HTTP Request            │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│        Middleware               │
│  - CORS, JSON Parser            │
│  - Authentication (JWT)         │
│  - Rate Limiting                │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│         Routes                  │
│  - auth.route.ts                │
│  - config.route.ts              │
│  - media.route.ts               │
│  - ... (other routes)           │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│       Controllers               │
│  - Handle Request               │
│  - Call Services                │
│  - Send Response                │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│         Services                │
│  - Business Logic               │
│  - Data Access                  │
│  - External APIs                │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│     File System / Storage       │
└─────────────────────────────────┘
```

**Authentication Flow**:
1. User submits credentials
2. Server validates with bcrypt
3. JWT token generated and signed
4. Token sent in httpOnly cookie
5. Subsequent requests include token
6. Middleware validates token
7. Request proceeds or rejected

---

## Project Structure

```
QuantomOS/
├── src/
│   ├── backend/                # Backend code
│   │   ├── index.ts           # Server entry point
│   │   ├── routes/            # API route handlers
│   │   │   ├── auth.route.ts
│   │   │   ├── config.route.ts
│   │   │   ├── media.route.ts
│   │   │   └── ...
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   └── rateLimiter.ts
│   │   ├── services/          # Business logic
│   │   │   └── icalService.ts
│   │   ├── utils/             # Utility functions
│   │   └── types/             # TypeScript types
│   │
│   └── frontend/              # Frontend code
│       ├── index.html         # Entry HTML
│       ├── main.tsx           # React entry point
│       ├── App.tsx            # Root component
│       ├── components/        # React components
│       │   ├── dashboard/     # Dashboard widgets
│       │   ├── forms/         # Form components
│       │   ├── modals/        # Modal dialogs
│       │   ├── navbar/        # Navigation
│       │   └── settings/      # Settings panels
│       ├── context/           # React context
│       │   └── AppContextProvider.tsx
│       ├── api/               # API client
│       │   └── dash-api.ts
│       ├── hooks/             # Custom React hooks
│       ├── types/             # TypeScript types
│       ├── utils/             # Utility functions
│       └── theme/             # MUI theme config
│
├── public/                    # Static assets
│   └── uploads/               # User uploads
│       ├── wallpapers/
│       ├── icons/
│       └── profile/
│
├── config/                    # Configuration files
│   └── config.json            # Dashboard config
│
├── extensions/                # Custom extensions
│   └── *.json                 # Extension definitions
│
├── docs/                      # Documentation
│   ├── getting-started/
│   ├── user-guide/
│   ├── developer-guide/
│   └── contributing/
│
├── dist/                      # Build output
│   ├── backend/               # Compiled backend
│   └── frontend/              # Built frontend
│
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite config
├── Dockerfile                 # Docker build
└── docker-compose.yml         # Docker Compose
```

---

## Development Workflow

### Setting Up Development Environment

1. **Clone Repository**:
   ```bash
   git clone https://github.com/QuantomDevs/quantomos.git
   cd quantomos
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Create Environment File**:
   ```bash
   echo "SECRET=$(openssl rand -base64 32)" > .env
   ```

4. **Start Development Servers**:
   ```bash
   npm run dev
   ```

   This starts:
   - Backend on port 2525
   - Frontend on port 5173

### Development Commands

```bash
# Development
npm run dev              # Start both servers
npm run dev:backend      # Backend only
npm run dev:frontend     # Frontend only

# Building
npm run build            # Build both
npm run build:backend    # Backend only
npm run build:frontend   # Frontend only

# Production
npm start                # Run production build

# Code Quality
npm run lint             # Lint all code
npm run lint:backend     # Lint backend
npm run lint:frontend    # Lint frontend

# Docker
npm run docker:build     # Build Docker image
npm run docker:run       # Run container
```

### Hot Reload

**Frontend**: Vite provides instant hot reload
- Changes reflected immediately
- No full page reload needed

**Backend**: Nodemon watches for changes
- Auto-restarts on file changes
- Quick iteration on API changes

---

## Key Concepts

### Widget System

**Widgets** are the fundamental building blocks:
- Self-contained components
- Configurable via props
- Draggable and resizable
- Support edit and preview modes

**Widget Lifecycle**:
1. User selects widget type
2. Configuration form displayed
3. User provides settings
4. Widget added to layout
5. Widget renders with config
6. Widget updates on interval

### Extension System

**Extensions** allow custom widgets:
- JSON-based definition
- HTML, CSS, JavaScript content
- Shadow DOM isolation
- Template system for dynamic data
- Settings schema for configuration

See [Extension Structure](./02-extension-structure.md) for details.

### Theme System

**Centralized theming** via CSS variables:
- All colors defined as variables
- User can customize any color
- Widgets use theme variables
- Consistent appearance

Theme variables:
- `--color-background`
- `--color-secondary-background`
- `--color-accent`
- `--color-text-primary`
- etc.

### Authentication

**JWT-based authentication**:
- Secure token-based system
- httpOnly cookies prevent XSS
- Tokens expire after 24 hours
- Refresh on activity

**Public Access Mode**:
- Optional read-only public view
- Admin features require auth
- Edit mode requires login

### Data Storage

**File-based storage**:
- Configuration in JSON
- No database required
- Easy backup and migration
- Version control friendly

**Encryption**:
- Sensitive data (API keys, passwords)
- AES-256-CBC encryption
- Secret key from environment

---

## Contributing

We welcome contributions! See the [Contributing Guide](../contributing/01-how-to-contribute.md) for:
- Code standards
- Pull request process
- Testing requirements
- Documentation expectations

---

## Next Steps

Explore more developer documentation:
- [Extension Structure](./02-extension-structure.md) - Create custom widgets
- [API Reference](./03-api-reference.md) - Frontend and backend APIs
- [Theming Guide](./04-theming-guide.md) - Customize appearance
- [Development Setup](../contributing/03-development-setup.md) - Detailed setup guide

---

## Getting Help

- [GitHub Issues](https://github.com/QuantomDevs/quantomos/issues) - Report bugs
- [Discussions](https://github.com/QuantomDevs/quantomos/discussions) - Ask questions
- [Contributing Guide](../contributing/01-how-to-contribute.md) - Learn how to contribute
