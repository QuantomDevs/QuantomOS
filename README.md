# QuantomOS

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.3.2-brightgreen.svg)](package.json)

**QuantomOS** - A modern, customizable dashboard system for managing your server and homelab infrastructure.

<img width="1912" alt="QuantomOS Dashboard" src="https://github.com/user-attachments/assets/55ae6a22-33e3-40ab-b1e2-a8deeaa5239b" />

---

## Table of Contents

- [About QuantomOS](#about-quantomos)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running in Development Mode](#running-in-development-mode)
  - [Building for Production](#building-for-production)
- [Docker Support](#docker-support)
  - [Using Docker Compose](#using-docker-compose)
  - [Building Docker Images](#building-docker-images)
  - [Updating](#updating)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development](#development)
  - [Local Development](#local-development)
  - [Code Style and Conventions](#code-style-and-conventions)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## About QuantomOS

QuantomOS is an open-source user interface designed to be your internally hosted homepage for your homelab and server infrastructure. It provides a sleek, modern dashboard where you can monitor services, manage resources, and access your tools from a single unified interface.

### Key Features

- **Customizable Grid Layout**: Drag and drop widgets to create your perfect dashboard
- **Extensive Widget Library**: System monitoring, service health checks, shortcuts, and custom widgets
- **Multi-Page Support**: Organize your dashboard across multiple pages
- **Full Customization**: Change backgrounds, themes, colors, and layout to match your style
- **Privacy-First**: All data stored locally with AES-256-CBC encryption for sensitive information
- **Role-Based Access**: Admin and user roles with granular permissions
- **PWA Support**: Install as an app on desktop, mobile, or tablet
- **Dark Mode**: Beautiful dark theme optimized for 24/7 monitoring
- **Responsive Design**: Works flawlessly on any screen size
- **Backup & Restore**: Easily backup and restore your configurations

---

## Features

### Dashboard & Widgets

- **Shortcuts Widget**: Quick access to your favorite services and tools
- **System Monitor**: Real-time CPU, RAM, network, and disk usage
- **Service Health Checks**: Monitor the status of your services
- **Media Server Integration**: Plex, Jellyfin, Emby support
- **Download Clients**: qBittorrent, Transmission, SABnzbd, and more
- **Arr Stack**: Sonarr, Radarr, Lidarr, Prowlarr, Readarr integration
- **Pi-hole & AdGuard**: DNS and ad-blocking statistics
- **Weather Widget**: Current weather and forecast
- **Clock & Calendar**: Time, date, and timezone information
- **Group Widget**: Container widget for organizing related items
- **Dual Widget**: Combine two widgets into a single dashboard item
- **Custom Extensions**: Create your own widgets with JSON-based extensions
  - Unified widget selector with extensions integrated alongside built-in widgets
  - Comprehensive extension development documentation
  - Template system for dynamic content
  - Shadow DOM isolation for style encapsulation

### Customization

- **Drag & Drop Interface**: Reorder and resize widgets effortlessly
- **Background Customization**: Upload your own background images
- **Custom Search Providers**: Add your preferred search engines
- **Theme Customization**: Adjust colors, fonts, and spacing
- **Custom Page Names**: Organize widgets across multiple named pages
- **Flexible Layouts**: Desktop and mobile layouts managed separately

### Privacy & Security

- **Complete Data Control**: All data stored on your own device
- **Local Encryption**: Sensitive data encrypted with AES-256-CBC
- **Admin-Only Changes**: Only administrators can modify dashboards
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against brute-force attacks
- **Backup System**: Automatic and manual configuration backups

---

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.21.2
- **Language**: TypeScript 5.7.3
- **Authentication**: JSON Web Tokens (JWT)
- **Encryption**: AES-256-CBC for sensitive data
- **System Monitoring**: systeminformation library
- **Build Tool**: esbuild

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **UI Library**: Material-UI (MUI) 6.4.3
- **State Management**: React Context API
- **Routing**: React Router DOM 7.2.0
- **Drag & Drop**: @dnd-kit for sortable widgets
- **Charts**: MUI X-Charts for data visualization
- **Build Tool**: Vite 6.2.2
- **Styling**: Emotion (CSS-in-JS)

### Other Tools
- **Containerization**: Docker
- **Package Manager**: npm
- **Development**: Nodemon, ESLint, ts-node

---

## Getting Started

### Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Docker** (optional): For containerized deployment

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/QuantomDevs/quantomos.git
   cd quantomos
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   This will automatically install dependencies for both backend and frontend.

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```bash
   SECRET=your_secret_key_here
   ```
   Generate a secure secret key:
   ```bash
   openssl rand -base64 32
   ```

### Running in Development Mode

Start both backend and frontend development servers:

```bash
npm run dev
```

- **Backend** runs on: `http://localhost:2525`
- **Frontend** runs on: `http://localhost:5173` (default Vite port)

### Building for Production

Build both backend and frontend:

```bash
npm run build
```

This creates optimized production builds in:
- `backend/dist/` - Bundled backend server
- `frontend/dist/` - Static frontend assets

---

## Docker Support

### Using Docker Compose

The easiest way to run QuantomOS is with Docker Compose:

1. **Create a `docker-compose.yml` file**:

```yaml
---
services:
  quantomos:
      container_name: quantomos
      image: ghcr.io/snenjih/quantomos:latest
      privileged: true
      #network_mode: host # for monitoring network usage stats
      ports:
        - 2022:2022
      environment:
        - SECRET=YOUR_SECRET_KEY
      volumes:
        - /sys:/sys:ro
        - /docker/quantomos/config:/config
        - /docker/quantomos/uploads:/app/public/uploads
        - /var/run/docker.sock:/var/run/docker.sock
      restart: unless-stopped
      labels:
        - "com.centurylinklabs.watchtower.enable=true"
```

2. **Start the container**:
```bash
docker compose up -d
```

3. **Access QuantomOS**:
   - Local: `http://localhost:2022`
   - Network: `http://192.168.x.x:2022`
   - Domain: `http://your-domain.com`

### Building Docker Images

**Build for local platform**:
```bash
npm run docker:build
```

**Build for multiple platforms** (amd64 and arm64):
```bash
npm run docker:build:multi
```

### Updating

#### Via Portainer:
1. Navigate to Stacks
2. Click on the `quantomos` stack
3. Click the Editor tab
4. Click "Update the stack"
5. Enable "Re-pull image and redeploy"
6. Click "Update"

#### Via Docker CLI:
```bash
cd /path/to/docker-compose.yml
docker compose down
docker compose pull
docker compose up -d
```

---

## Usage

### Accessing QuantomOS

QuantomOS can be accessed from any web browser:
- **Local device**: `http://localhost:2022`
- **Local network**: `http://192.168.x.x:2022`
- **Custom domain**: `http://www.your-dashboard.com`

> [!IMPORTANT]
> Assign a static IP address to your server so devices on your network can reliably access QuantomOS.

### Installing as PWA

QuantomOS can be installed as a Progressive Web App on:
- **Chrome**: Mac, Windows, Android, Linux (click install icon in address bar)
- **Safari**: iOS/iPadOS (Share menu → Add to Home Screen)

<img width="391" alt="PWA Install" src="https://github.com/user-attachments/assets/2b6ec3b4-5cda-4cd0-b8aa-70185477b633" />

---

## Project Structure

```
QuantomOS-main/
├── backend/
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Authentication, rate limiting
│   │   ├── config/         # Configuration files
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript type definitions
│   ├── index.ts           # Backend entry point
│   ├── package.json       # Backend dependencies
│   └── tsconfig.json      # TypeScript configuration
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── api/           # API client functions
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── theme/         # MUI theme and styles
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   ├── index.html         # HTML entry point
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.ts     # Vite configuration
│   └── tsconfig.json      # TypeScript configuration
├── extensions/            # Custom extension files
│   ├── docs/              # Extension development documentation
│   │   ├── extension-development-guide.md
│   │   ├── extension-structure.md
│   │   ├── settings-reference.md
│   │   ├── template-system.md
│   │   ├── shadow-dom-guide.md
│   │   ├── best-practices.md
│   │   ├── examples.md
│   │   ├── troubleshooting.md
│   │   └── api-reference.md
│   └── *.json             # Extension definition files
├── docker-compose.yml     # Docker Compose configuration
├── Dockerfile             # Docker build instructions
├── package.json           # Root package.json (scripts)
└── README.md              # This file
```

---

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
SECRET=your_secret_key_here  # Used for JWT and encryption
PORT=2525                     # Backend port (optional, defaults to 2525)
```

### Configuration Files

- **Backend Config**: Located in `backend/src/config/config.json`
- **Dashboard Layout**: Automatically saved to config directory
- **User Credentials**: Securely stored with bcrypt hashing

### Customizing the Dashboard

1. **Add Widgets**: Click the "+" button in the top navigation
2. **Drag & Drop**: Enter edit mode and drag widgets to reorder
3. **Resize Widgets**: Drag widget corners to resize (desktop only)
4. **Change Background**: Settings → Appearance → Upload background
5. **Add Pages**: Settings → Pages → Create new page
6. **Manage Users**: Settings → Users → Add/Edit users (admin only)

### Creating Custom Extensions

QuantomOS supports custom widgets through a JSON-based extension system. Extensions are automatically discovered and integrated into the widget selector.

**Quick Start**:

1. **Create an extension file** in the `/extensions` directory:
   ```json
   {
     "id": "my-widget",
     "name": "myWidget",
     "title": "My Custom Widget",
     "version": "1.0.0",
     "author": "Your Name",
     "description": "A custom widget for my dashboard",
     "settings": [
       {
         "id": "message",
         "name": "Message",
         "type": "text",
         "defaultValue": "Hello World!",
         "description": "Text to display"
       }
     ],
     "html": "<div class='widget'>{{message}}</div>",
     "css": ".widget { padding: 2rem; background: var(--color-widget-background); }",
     "javascript": "console.log('Widget loaded!');"
   }
   ```

2. **Extension appears automatically** in the widget selector under "Custom Extensions"

3. **Configure and add** to your dashboard like any built-in widget

**Documentation**:

Comprehensive extension development documentation is available in `/extensions/docs/`:

- [Extension Development Guide](./extensions/docs/extension-development-guide.md) - Getting started
- [Extension Structure](./extensions/docs/extension-structure.md) - JSON schema and required fields
- [Settings Reference](./extensions/docs/settings-reference.md) - All available setting types
- [Template System](./extensions/docs/template-system.md) - Dynamic content with placeholders
- [Shadow DOM Guide](./extensions/docs/shadow-dom-guide.md) - Style isolation and theming
- [Best Practices](./extensions/docs/best-practices.md) - Code quality and performance
- [Examples](./extensions/docs/examples.md) - Complete extension examples
- [Troubleshooting](./extensions/docs/troubleshooting.md) - Common issues and solutions
- [API Reference](./extensions/docs/api-reference.md) - Available APIs and utilities

---

## Development

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development servers**:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:2525`

### Code Style and Conventions

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for TypeScript and React
- **Formatting**: Consistent code formatting enforced
- **Commit Messages**: Use conventional commit format
- **Testing**: Run `npm test` before committing

### Project Scripts

```bash
npm run dev          # Start both backend and frontend in dev mode
npm run build        # Build both backend and frontend
npm run lint         # Lint both backend and frontend
npm install          # Install dependencies (runs preinstall script)
```

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'feat: add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add tests for new features when applicable
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Reporting Issues

Please report bugs and request features through [GitHub Issues](https://github.com/QuantomDevs/quantomos/issues).

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Material-UI** - For the excellent React component library
- **The Homelab Community** - For inspiration and feedback
- **Open Source Contributors** - For making this project possible

---

---

**Made with ❤️ for the homelab community**
