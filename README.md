# QuantomOS

**Version:** 1.0.0
**Status:** Beta - In Active Development

A comprehensive web-based dashboard system that provides a centralized interface for managing and monitoring servers. QuantomOS features a customizable home layout, app store, settings management, and is designed to expand into a full-fledged server monitoring dashboard with authentication and real-time server statistics.

---

## Features

### Current Features

**Home Dashboard**
- 3 customizable layout options
- Dynamic app management with folder organization
- Drag & drop app reordering
- Quick access dock with favorite apps
- Responsive design for all screen sizes

**App Management**
- Create, edit, and delete apps/links
- Custom icon upload support (WebP, PNG, JPG)
- Folder organization system
- App Store for command installation
- Bulk app operations

**Settings & Configuration**
- Theme customization
- Layout selection (3 options)
- User preferences management
- Configuration backup/restore

**Admin Panel**
- Full CRUD operations for apps and folders
- Nginx/Apache2 configuration management
- Server configuration viewer
- Icon management system

### Planned Features (Phase 2)

- Secure authentication system with JWT tokens
- Real-time server monitoring via SSH
- Server statistics dashboard with live metrics
- Multi-server management capabilities
- Role-based access control
- Historical data tracking and graphs

---

## Technology Stack

### Backend
- **Node.js** (v14+) - Runtime environment
- **Express.js** (v4.18.2) - Web framework
- **Multer** (v2.0.2) - File upload handling
- **CORS** (v2.8.5) - Cross-origin resource sharing

### Frontend
- **HTML5, CSS3, JavaScript (ES6+)** - Core technologies
- **Font Awesome** - Icons
- **Google Fonts** (Inter, Google Sans) - Typography
- **Figlet.js** - ASCII art for terminal

### Planned Dependencies (Phase 2)
- **ssh2** - SSH client for server connections
- **bcrypt** - Password hashing
- **jsonwebtoken** - Token-based authentication
- **node-cron** - Scheduled tasks

---

## Prerequisites

Before installing QuantomOS, ensure you have:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **Git** (for cloning the repository)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/QuantomOS.git
cd QuantomOS
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root (optional for development):

```env
PORT=3022
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3022
```

### 4. Start the Server

```bash
npm start
```

The application will be available at:
- **Main Page:** http://localhost:3022/main
- **Admin Panel:** http://localhost:3022/admin

---

## Usage

### Starting the Application

```bash
# Development mode
npm start

# Production mode (when available)
NODE_ENV=production npm start
```

### Accessing Different Pages

- **Home:** Navigate to http://localhost:3022/ (redirects to /main)
- **Main Dashboard:** http://localhost:3022/main
- **Admin Panel:** http://localhost:3022/admin

### Managing Apps

**Creating a New App:**
1. Navigate to the Admin Panel (/admin)
2. Click "Create Link" button
3. Fill in app details (ID, Name, Link, Folder)
4. Upload a custom icon (optional)
5. Click "Save"

**Editing an App:**
1. Find the app in the admin panel
2. Click the edit icon
3. Modify the details
4. Save changes

**Deleting an App:**
1. Find the app in the admin panel
2. Click the delete icon
3. Confirm deletion

### Organizing with Folders

**Creating a Folder:**
1. In the Admin Panel, click "Create Folder"
2. Enter folder details (ID, Name)
3. Choose display options (Dock, Home)
4. Upload folder icon (optional)
5. Save

**Managing Apps in Folders:**
- Apps can be assigned to folders during creation
- Drag and drop apps to reorder them
- Only apps in "Haupt" folder can be reordered in the main view

---

## Project Structure

```
QuantomOS/
├── src/
│   ├── main/                   # Main website files
│   │   ├── index.html          # Main page
│   │   ├── js/
│   │   │   ├── index.js        # Main page logic
│   │   │   ├── app-store.js    # App store functionality
│   │   │   └── service-worker.js # PWA service worker
│   │   └── css/
│   │       ├── index.css       # Main styles
│   │       └── app-store.css   # App store styles
│   ├── admin/                  # Admin panel files
│   │   ├── admin.html          # Admin page
│   │   ├── js/
│   │   │   └── admin.js        # Admin panel logic
│   │   └── css/
│   │       └── admin.css       # Admin styles
│   └── shared/                 # Shared resources
│       ├── css/
│       │   ├── variables.css   # CSS design system
│       │   └── header.css      # Shared header styles
│       ├── js/
│       │   ├── header.js       # Shared header component
│       │   ├── notification.js # Notification system
│       │   └── figlet.min.js   # ASCII art library
│       ├── images/             # All images
│       │   ├── icons/          # App and folder icons
│       │   ├── wallpapers/     # Background images
│       │   ├── favicon/        # Favicons
│       │   └── dock/           # Dock icons
│       └── config/
│           ├── apps.json       # App and folder configuration
│           ├── app-store.json  # App store items
│           └── commands.json   # Terminal commands
├── config/                     # Configuration files
│   ├── apps.json               # Apps configuration (shared)
│   ├── app-store.json          # App store configuration
│   ├── commands.json           # Commands configuration
│   ├── manifest.json           # PWA manifest
│   └── preset-motd.md          # Message of the day
├── server.js                   # Express server
├── package.json                # NPM dependencies
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
├── CONTRIBUTING.md             # Contribution guidelines
├── LICENSE                     # License information
└── USAGE.md                    # Detailed usage guide
```

---

## Configuration

### Apps Configuration

Apps are stored in `src/shared/config/apps.json`:

```json
{
  "folders": [
    {
      "id": 1,
      "name": "Haupt",
      "folderIconPath": "src/shared/images/icons/folder.svg",
      "displayInDock": false,
      "displayOnHome": true,
      "apps": [
        {
          "id": 1,
          "name": "Example App",
          "icon": "src/shared/images/icons/example.png",
          "link": "https://example.com"
        }
      ]
    }
  ]
}
```

### Server Configuration

Configure server settings in `.env` or directly in `server.js`:

- **PORT:** Server port (default: 3022)
- **NODE_ENV:** Environment (development/production)
- **ALLOWED_ORIGINS:** CORS whitelist

---

## API Endpoints

### Apps API

**GET /api/apps**
- Fetches all apps and folders
- Returns: JSON with complete apps.json structure

**POST /api/links**
- Creates a new app/link
- Body: `{ id, name, link, folder }` + optional iconFile
- Returns: Created app object

**PUT /api/links/:appId**
- Updates an existing app
- Body: `{ id, name, link, folder }` + optional iconFile
- Returns: Updated app object

**DELETE /api/links/:appId**
- Deletes an app by ID
- Returns: Success message

**POST /api/folders**
- Creates a new folder
- Body: `{ id, name, displayInDock, displayOnHome }` + optional iconFile
- Returns: Created folder object

**POST /api/apps/reorder**
- Reorders apps in Haupt folder
- Body: `{ apps: [{ id, order }] }`
- Returns: New order with reassigned IDs

### Server Configuration API

**GET /api/nginx/configs**
- Fetches all Nginx/Apache2 configurations
- Returns: Array of server configs

**POST /api/nginx/configs**
- Creates a new server configuration
- Body: `{ name, type, port, root, domain, proxy, ssl }`
- Returns: Created config

**DELETE /api/nginx/configs/:filename**
- Deletes a server configuration
- Query: `type` (nginx/apache2)
- Returns: Success message

---

## Security Considerations

### Current Security Features

- Content Security Policy (CSP) headers
- CORS configuration with origin whitelist
- File upload validation with magic number checking
- File size limits (5MB per file)
- Input sanitization on client-side
- XSS protection headers

### Known Security Issues (To Be Fixed in Phase 1.9)

⚠️ **IMPORTANT:** Before deploying to production, address these critical security issues:

1. **Missing API Authentication** - All API endpoints are currently unprotected
2. **XSS Vulnerabilities** - Some user inputs are not properly escaped
3. **Hardcoded Configuration** - Port and URLs are hardcoded
4. **File Upload Security** - Enhanced validation needed

See [Security Analysis](#security) section for detailed remediation steps.

---

## Development

### Code Style

This project follows the guidelines in `.claude/CLAUDE.md`:

- Use consistent naming conventions (camelCase for variables and functions)
- Add comments for complex logic
- Keep functions focused and single-purpose
- Use meaningful variable names
- Maintain separation between UI and business logic

### Running in Development Mode

```bash
npm start
```

Development mode features:
- Detailed error messages
- Console logging enabled
- CORS accepts all origins
- Hot reload (manual)

### Building for Production

Currently, no build step is required as the project uses vanilla JavaScript. For future optimization:

```bash
# Planned for Phase 4
npm run build
```

---

## Testing

Currently, the project has 0% test coverage. Testing infrastructure will be added in Phase 3.

### Planned Testing (Future)

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

---

## Troubleshooting

### Common Issues

**Server won't start**
- Check if port 3022 is already in use: `lsof -i :3022`
- Kill existing process: `kill -9 <PID>`
- Try different port in `server.js`

**Apps not loading**
- Check `src/shared/config/apps.json` exists and is valid JSON
- Verify file permissions: `chmod 644 src/shared/config/apps.json`
- Check browser console for errors

**File upload failing**
- Ensure `src/shared/images/icons/` directory exists
- Check write permissions: `chmod 755 src/shared/images/icons/`
- Verify file type is WebP, PNG, JPG, or JPEG
- Check file size is under 5MB

**CORS errors**
- Update CORS configuration in `server.js`
- Add your domain to `ALLOWED_ORIGINS` environment variable
- Check browser console for specific origin being blocked

**Page shows 404**
- Verify server is running on correct port
- Check that `src/main/index.html` or `src/admin/admin.html` exists
- Clear browser cache and reload

---

## Performance

### Current Performance

- **First Contentful Paint:** ~800ms (development)
- **Time to Interactive:** ~1.2s (development)
- **Bundle Size:** ~150KB total (unminified)

### Performance Optimization (Planned)

- Code minification and bundling
- Image optimization and lazy loading
- Service Worker caching strategy
- Virtual scrolling for large app lists
- Resource preloading and prefetching

---

## Browser Support

QuantomOS supports all modern browsers:

- **Chrome/Edge:** 90+
- **Firefox:** 88+
- **Safari:** 14+
- **Opera:** 76+

### Required Browser Features

- ES6+ JavaScript support
- CSS Grid and Flexbox
- Fetch API
- Service Workers (for PWA features)
- File API (for uploads)

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on:

- Code style requirements
- Pull request process
- Development setup
- Testing requirements
- Commit message format

---

## Roadmap

### Phase 1: Project Restructuring ✅
- Clean directory structure
- Modular file organization
- Improved maintainability

### Phase 1.9: Documentation & Analysis (Current)
- Comprehensive documentation
- Security analysis
- Bug identification
- .gitignore setup

### Phase 2: Dashboard & Authentication (Next)
- Login system with JWT
- Server monitoring dashboard
- Real-time statistics
- SSH integration
- Multi-user support

### Phase 3: Bug Fixes
- Fix identified security vulnerabilities
- Resolve XSS issues
- Implement proper authentication
- Enhanced error handling

### Phase 4: Improvements
- Performance optimization
- State management (Zustand/Redux)
- TypeScript migration
- Test coverage (80%+)
- PWA enhancements

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

### Getting Help

- **Documentation:** Check [USAGE.md](USAGE.md) for detailed guides
- **Issues:** Report bugs or request features on GitHub Issues
- **Security:** For security issues, please email security@example.com

### FAQ

**Q: Can I use this in production?**
A: Not yet. Phase 1.9 security fixes must be completed first.

**Q: Does this work on mobile?**
A: Yes! QuantomOS is fully responsive and works on mobile devices.

**Q: Can I customize the appearance?**
A: Yes, through CSS variables in `src/shared/css/variables.css`.

**Q: How do I add my own apps?**
A: Use the Admin Panel at /admin to create new apps with custom icons.

---

## Acknowledgments

- **Font Awesome** for the icon library
- **Google Fonts** for typography
- **Figlet.js** for ASCII art capabilities
- All contributors and users of QuantomOS

---

## Contact

- **Project Lead:** [Your Name]
- **Email:** contact@example.com
- **GitHub:** https://github.com/yourusername/QuantomOS

---

**Last Updated:** 2025-10-16
**Documentation Version:** 1.0.0
