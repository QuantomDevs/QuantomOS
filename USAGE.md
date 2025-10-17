# QuantomOS Usage Guide

This comprehensive guide will help you get the most out of QuantomOS. Whether you're setting up for the first time or looking to master advanced features, this guide has you covered.

---

## Table of Contents

1. [First-Time Setup](#first-time-setup)
2. [Navigating the Interface](#navigating-the-interface)
3. [Managing Apps](#managing-apps)
4. [Working with Folders](#working-with-folders)
5. [Drag and Drop Reordering](#drag-and-drop-reordering)
6. [Using the App Store](#using-the-app-store)
7. [Settings Configuration](#settings-configuration)
8. [Admin Panel Guide](#admin-panel-guide)
9. [Server Configuration Management](#server-configuration-management)
10. [Keyboard Shortcuts](#keyboard-shortcuts)
11. [Tips and Tricks](#tips-and-tricks)
12. [Troubleshooting](#troubleshooting)
13. [FAQ](#faq)

---

## First-Time Setup

### System Requirements

**Minimum Requirements:**
- Node.js 14.0.0 or higher
- 2GB RAM
- 500MB free disk space
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)

**Recommended:**
- Node.js 16.0.0 or higher
- 4GB RAM
- 1GB free disk space
- High-speed internet connection

### Installation Steps

#### 1. Install Node.js

**macOS (via Homebrew):**
```bash
brew install node
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Windows:**
Download from [nodejs.org](https://nodejs.org) and run the installer.

**Verify Installation:**
```bash
node --version  # Should show v14.0.0 or higher
npm --version   # Should show v6.0.0 or higher
```

#### 2. Clone and Setup QuantomOS

```bash
# Clone the repository
git clone https://github.com/yourusername/QuantomOS.git
cd QuantomOS

# Install dependencies
npm install

# Verify installation
ls -la  # Should see node_modules folder
```

#### 3. Start the Server

```bash
npm start
```

You should see:
```
Server running on http://localhost:3022
```

#### 4. Access the Application

Open your browser and navigate to:
- **Main Page:** http://localhost:3022/main
- **Admin Panel:** http://localhost:3022/admin

### Environment Configuration

Create a `.env` file in the project root for custom configuration:

```env
# Server Configuration
PORT=3022
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3022

# File Upload Limits (in bytes)
MAX_FILE_SIZE=5242880  # 5MB

# Future configurations (Phase 2)
# JWT_SECRET=your-secret-key-here
# SESSION_TIMEOUT=86400
```

---

## Navigating the Interface

### Main Dashboard

The main dashboard is your home screen with quick access to all your apps and folders.

**Layout Options:**
1. **Compact:** Dense grid layout, more apps visible
2. **Standard:** Balanced layout with medium spacing
3. **Spacious:** Large icons with generous spacing

**Key Components:**

**1. Header**
- Logo and branding
- Navigation links (Home, Admin, Settings)
- Search bar (coming soon)

**2. App Grid**
- Displays all apps from the "Haupt" folder
- Drag and drop to reorder
- Click to open app/website

**3. Dock**
- Quick access to favorite apps
- Folders configured for dock display
- Always visible at bottom

**4. Folders**
- Expandable folder cards
- Contains grouped apps
- Configurable display options

### Admin Panel

The admin panel provides comprehensive management tools.

**Sections:**

**1. Apps Management**
- List of all apps
- Create, edit, delete operations
- Bulk actions (coming soon)

**2. Folders Management**
- Folder creation and configuration
- Display settings (Dock, Home)
- Icon management

**3. Server Configurations**
- Nginx/Apache2 config viewer
- Config file management
- Quick actions

**4. Settings**
- Application settings
- User preferences
- System configuration

---

## Managing Apps

### Creating a New App

#### Method 1: Admin Panel (Recommended)

1. **Navigate to Admin Panel**
   - Go to http://localhost:3022/admin
   - Click "Apps" in the sidebar

2. **Open Create Dialog**
   - Click the "Create Link" button
   - A modal will appear

3. **Fill in App Details**

   **ID:**
   - Enter a unique number (1-99999)
   - For "Haupt" folder, ID is auto-assigned sequentially
   - For other folders, ensure ID doesn't exist

   **Name:**
   - Enter the app name (e.g., "GitHub")
   - Will be displayed below the icon
   - Keep it short (max 20 characters recommended)

   **Link:**
   - Enter the full URL (must start with http:// or https://)
   - Example: https://github.com
   - Supports external websites only

   **Folder:**
   - Select from dropdown (e.g., "Haupt", "Development", "Social")
   - Apps in "Haupt" appear on main grid
   - Apps in other folders appear in folder cards

4. **Upload Icon (Optional)**

   **Supported Formats:**
   - WebP (recommended for smaller size)
   - PNG (recommended for quality)
   - JPG/JPEG

   **Requirements:**
   - Maximum size: 5MB
   - Recommended dimensions: 512x512px
   - Square aspect ratio preferred

   **Upload Process:**
   - Click "Choose File"
   - Select your icon image
   - Preview will show (coming soon)
   - If no icon is uploaded, default template icon is used

5. **Save**
   - Click "Create Link" button
   - Wait for success notification
   - App will appear immediately

#### Method 2: Direct JSON Editing (Advanced)

Edit `src/shared/config/apps.json`:

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
          "name": "New App",
          "icon": "src/shared/images/icons/new-app.png",
          "link": "https://example.com"
        }
      ]
    }
  ]
}
```

**Important:** After manual editing, restart the server or refresh the browser.

### Editing an Existing App

1. **Locate the App**
   - In Admin Panel, find the app in the list
   - Or use search (coming soon)

2. **Open Edit Dialog**
   - Click the pencil/edit icon next to the app
   - Edit dialog appears with current values pre-filled

3. **Modify Fields**
   - **Change ID:** Can reassign to new ID (must be unique)
   - **Rename:** Update app name
   - **Change Link:** Update URL
   - **Move to Different Folder:** Select new folder from dropdown
   - **Replace Icon:** Upload new icon file

4. **Save Changes**
   - Click "Update Link"
   - App updates immediately across all views

**Important Notes:**
- Changing folder moves the app between folders
- Changing ID in "Haupt" folder may affect order
- Icon replacement deletes old icon file

### Deleting an App

1. **Locate the App**
   - In Admin Panel apps list

2. **Delete**
   - Click the trash/delete icon
   - Confirmation dialog appears

3. **Confirm**
   - Click "Yes, Delete" to confirm
   - Or "Cancel" to abort

**What Gets Deleted:**
- App entry from apps.json
- Custom uploaded icon file (if any)
- App disappears from all views immediately

**Cannot be Undone:** Deletion is permanent. Consider exporting your configuration beforehand.

### App Properties Explained

**id (number):**
- Unique identifier for the app
- Used for internal tracking and ordering
- Range: 1-99999
- In "Haupt" folder: auto-assigned sequentially

**name (string):**
- Display name shown to users
- Appears below icon
- Max length: ~50 characters (soft limit)
- Can contain any characters, but avoid special characters for best display

**icon (string):**
- Path to icon image file
- Relative path from project root
- Default: `src/shared/images/icons/template.svg`
- Custom uploads: `src/shared/images/icons/[filename]`

**link (string):**
- Full URL to the target website/app
- Must include protocol (http:// or https://)
- Opens in new tab when clicked
- Validated on client and server side

---

## Working with Folders

### Creating a Folder

1. **Open Admin Panel**
   - Navigate to /admin
   - Click "Folders" in sidebar (coming soon) or scroll to folders section

2. **Click "Create Folder"**

3. **Fill in Folder Details**

   **ID:**
   - Unique folder identifier (1-99999)
   - Must be unique across all folders

   **Name:**
   - Folder display name
   - Shown on folder card
   - Examples: "Development", "Social Media", "Tools"

   **Display in Dock:**
   - Checkbox: Show folder in dock (quick access)
   - Recommended for frequently used folders

   **Display on Home:**
   - Checkbox: Show folder on home page
   - Unchecked folders are accessible via menu only

   **Icon (Optional):**
   - Upload custom folder icon
   - Same requirements as app icons
   - Defaults to standard folder icon

4. **Save**
   - Click "Create Folder"
   - Folder appears immediately

### Configuring Folder Display

**Display in Dock:**
- When enabled, folder appears in bottom dock
- Click to expand/collapse folder contents
- Maximum ~10 folders recommended for dock

**Display on Home:**
- When enabled, folder card appears on main page
- Shows folder icon, name, and app count
- Click to expand and see contained apps

**Example Configurations:**

```
Folder: "Favorites"
- Display in Dock: ✓ Yes
- Display on Home: ✓ Yes
→ Result: Appears in dock AND as card on home page

Folder: "Archive"
- Display in Dock: ✗ No
- Display on Home: ✗ No
→ Result: Hidden, accessible only via admin panel

Folder: "Quick Tools"
- Display in Dock: ✓ Yes
- Display on Home: ✗ No
→ Result: Only in dock, not on main page
```

### Moving Apps Between Folders

**Method 1: Edit App**
1. Edit the app in Admin Panel
2. Change "Folder" dropdown to target folder
3. Save
4. App moves to new folder

**Method 2: Drag and Drop** (coming in Phase 4)
- Drag app from one folder to another
- Drop to move

### Special Folder: "Haupt"

The "Haupt" (Main) folder has special properties:

**Characteristics:**
- **Primary folder** for main dashboard apps
- **Auto-ordering:** Apps are sequentially numbered
- **Drag & Drop:** Full reordering support
- **Cannot be deleted:** System folder
- **IDs auto-assigned:** New apps get next available ID

**How Haupt Auto-Ordering Works:**
1. When creating app in Haupt, ID is auto-assigned (1, 2, 3, ...)
2. When dragging apps, IDs update based on new position
3. Deleting app leaves gap, next new app fills lowest available ID

Example:
```
Initial: [App1 (ID:1), App2 (ID:2), App3 (ID:3)]
Delete App2: [App1 (ID:1), App3 (ID:3)]  # Gap at ID 2
Create new app: [App1 (ID:1), NewApp (ID:2), App3 (ID:3)]  # Fills gap
```

---

## Drag and Drop Reordering

### How It Works

Drag and drop allows you to reorder apps in the "Haupt" folder visually.

**Supported Actions:**
- Drag app to new position
- Swap apps
- Insert between apps
- Auto-scroll when dragging near edges

### Reordering Apps

1. **Navigate to Main Page** (/main)

2. **Locate App to Move**
   - Must be in "Haupt" folder to reorder
   - Other folders: reordering coming in Phase 4

3. **Start Dragging**
   - **Mouse:** Click and hold on app, then drag
   - **Touch:** Long-press on app (mobile), then drag

4. **Visual Feedback**
   - **Dragged app:** Semi-transparent
   - **Drop zones:** Highlighted borders
   - **Invalid zones:** Red indicators (coming soon)

5. **Drop App**
   - **Mouse:** Release mouse button
   - **Touch:** Lift finger
   - Apps reorder immediately

6. **Auto-Save**
   - Order is saved automatically to server
   - No manual save needed
   - Success notification appears

### Tips for Smooth Dragging

**Performance:**
- Drag slowly for better precision
- Wait for animation to complete before next drag
- Avoid rapid consecutive drags

**Mobile:**
- Use long-press to initiate drag
- Drag with single finger
- Don't use pinch-zoom while dragging

**Troubleshooting Drag & Drop:**

**App won't drag:**
- Ensure it's in "Haupt" folder
- Check browser console for errors
- Try refreshing page

**Drop doesn't save:**
- Check network connection
- Verify server is running
- Check browser console for API errors

**Apps jump back:**
- Indicates server save failed
- Check server logs
- May be race condition (reload page and try again)

---

## Using the App Store

The App Store provides quick installation of pre-configured apps.

### Accessing the App Store

1. **Main Page** → Click "App Store" button
2. Or navigate to /main and click app store icon

### Browsing Apps

**Categories:**
- All (default view)
- Popular
- Utilities
- Development
- Social
- Productivity
- Entertainment

**Filtering:**
- Click category to filter
- Search bar (coming soon)

### Installing an App from Store

1. **Find App**
   - Browse categories or search
   - Click on app card for details

2. **View Details**
   - App name and description
   - Icon preview
   - Category
   - Link destination

3. **Install**
   - Click "Install" button
   - App is automatically added to "Haupt" folder
   - ID is auto-assigned
   - Icon is copied to local storage

4. **Access Installed App**
   - Return to main page
   - App appears at end of grid
   - Can be reordered via drag & drop

### Managing App Store Content

(Admin only)

Edit `config/app-store.json`:

```json
{
  "apps": [
    {
      "id": 1,
      "name": "GitHub",
      "description": "Code hosting and collaboration",
      "icon": "src/shared/images/icons/github.png",
      "link": "https://github.com",
      "category": "Development",
      "popular": true
    }
  ]
}
```

---

## Settings Configuration

### Accessing Settings

1. Main Page → Click gear icon (coming soon)
2. Or Admin Panel → Settings section

### Available Settings

**Layout:**
- Compact: Dense grid, small icons
- Standard: Balanced spacing
- Spacious: Large icons, generous spacing

**Theme:** (Coming in Phase 2)
- Dark (default)
- Light
- Auto (follows system preference)

**Preferences:**
- **Auto-save Order:** Save app order automatically after drag & drop
- **Animations:** Enable/disable UI animations
- **Notifications:** Show success/error notifications

**Advanced:**
- **Reset to Defaults:** Restore original configuration
- **Export Configuration:** Download apps.json backup
- **Import Configuration:** Upload backup file

### Backup and Restore

**Creating a Backup:**

```bash
# Backup apps configuration
cp src/shared/config/apps.json backup-apps-$(date +%Y%m%d).json

# Backup all config files
tar -czf config-backup-$(date +%Y%m%d).tar.gz src/shared/config/
```

**Restoring from Backup:**

```bash
# Restore apps configuration
cp backup-apps-20250116.json src/shared/config/apps.json

# Restart server
npm start
```

---

## Admin Panel Guide

### Overview

The admin panel provides centralized management for all QuantomOS features.

**Access:** http://localhost:3022/admin

**Sections:**
1. Apps Management
2. Folders Management
3. Server Configurations
4. Settings
5. System Info (coming soon)

### Apps Management Section

**Features:**
- **List View:** All apps with ID, name, link, folder
- **Search:** Filter apps by name or ID
- **Sort:** By ID, name, folder
- **Bulk Actions:** Select multiple apps (coming soon)

**Actions:**
- **Create:** Add new app
- **Edit:** Modify existing app
- **Delete:** Remove app
- **Move:** Change folder
- **Replace Icon:** Upload new icon

### Folders Management Section

**Features:**
- **List View:** All folders with ID, name, app count
- **Configuration:** Display settings (Dock, Home)

**Actions:**
- **Create:** Add new folder
- **Edit:** Modify folder properties
- **Delete:** Remove folder (if empty)
- **Reorder:** Change folder display order (coming soon)

### Tips for Efficient Admin Work

**Keyboard Navigation:**
- Tab through form fields
- Enter to submit forms
- Escape to close dialogs

**Batch Operations:**
1. Select multiple items (coming soon)
2. Apply action to all selected
3. Confirm in single dialog

**Quick Edits:**
- Double-click to edit inline (coming soon)
- Right-click for context menu (coming soon)

---

## Server Configuration Management

### Viewing Server Configs

1. **Navigate to Admin Panel** → Server Configurations

2. **Config List Shows:**
   - Configuration filename
   - Server type (Nginx/Apache2)
   - Domain/Server name
   - Port number
   - SSL status
   - Document root or proxy target

3. **Click Config** to view full configuration file

### Creating Nginx Configuration

1. **Click "Create Config"**

2. **Fill in Details:**

   **Name:**
   - Configuration filename (e.g., `example.com`)
   - No extension needed

   **Type:**
   - Select "Nginx" or "Apache2"

   **Port:**
   - HTTP: 80 (default)
   - HTTPS: 443
   - Custom: any valid port

   **Domain:**
   - Full domain (e.g., `example.com`)
   - Supports subdomains (e.g., `app.example.com`)

   **Document Root:** (Optional)
   - Absolute path to website files
   - Example: `/var/www/example.com/html`

   **Proxy Pass:** (Optional)
   - Backend server URL
   - Example: `http://localhost:3000`
   - Useful for Node.js/Python/etc. apps

   **SSL:**
   - Checkbox: Enable HTTPS
   - Requires SSL certificates in `/etc/ssl/`

3. **Save**
   - Configuration file created in `/etc/nginx/sites-enabled/` or `/etc/apache2/sites-enabled/`
   - **Important:** Reload web server to apply:
     ```bash
     sudo systemctl reload nginx
     # or
     sudo systemctl reload apache2
     ```

### Example Configurations

**Static Website:**
```
Name: myblog.com
Type: Nginx
Port: 80
Domain: myblog.com
Root: /var/www/myblog.com/public
Proxy: (empty)
SSL: No
```

**Reverse Proxy for Node.js App:**
```
Name: myapp.com
Type: Nginx
Port: 80
Domain: myapp.com
Root: (empty)
Proxy: http://localhost:3000
SSL: Yes
```

**Apache2 with SSL:**
```
Name: secure-site.com
Type: Apache2
Port: 443
Domain: secure-site.com
Root: /var/www/secure-site/html
Proxy: (empty)
SSL: Yes
```

### Deleting Server Config

1. **Locate Config** in list
2. **Click Delete** icon
3. **Confirm** deletion
4. **Reload Web Server:**
   ```bash
   sudo systemctl reload nginx
   ```

**Warning:** Deleting config may break website. Backup first.

---

## Keyboard Shortcuts

(Coming in Phase 4)

**Global:**
- `Ctrl + K` or `Cmd + K`: Open command palette
- `Ctrl + /` or `Cmd + /`: Open search
- `Escape`: Close dialogs/modals

**Navigation:**
- `G then H`: Go to Home
- `G then A`: Go to Admin
- `G then S`: Go to Settings

**Admin Panel:**
- `N`: Create new app
- `Ctrl + S` or `Cmd + S`: Save changes
- `Ctrl + F` or `Cmd + F`: Search apps

**App Management:**
- `E`: Edit selected app
- `Delete` or `Backspace`: Delete selected app (with confirmation)
- Arrow keys: Navigate app list

---

## Tips and Tricks

### Performance Tips

**1. Optimize Icons:**
```bash
# Convert PNG to WebP for smaller file size
cwebp input.png -q 80 -o output.webp

# Resize large icons
convert input.png -resize 512x512 output.png
```

**2. Limit Apps in Haupt:**
- Keep Haupt folder under 50 apps for best performance
- Use folders to organize more apps

**3. Clear Browser Cache:**
- Hard refresh: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
- Clear cache regularly for latest updates

### Organization Tips

**1. Use Descriptive Folder Names:**
```
Good: "Work Tools", "Social Media", "Development"
Bad: "Folder1", "Misc", "Stuff"
```

**2. Icon Consistency:**
- Use same icon size and style
- Prefer PNG or WebP
- Use transparent backgrounds

**3. Naming Convention:**
- Keep app names short (under 15 characters)
- Use title case: "GitHub" not "github"
- Avoid special characters

### Workflow Optimization

**1. Quick Access Setup:**
- Add frequently used apps to Haupt folder
- Create "Favorites" folder in dock
- Use App Store for quick installs

**2. Regular Backups:**
```bash
# Weekly backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
tar -czf ~/backups/quantomos-$DATE.tar.gz \
    src/shared/config/ \
    src/shared/images/icons/
```

**3. Custom Layouts:**
- Compact: For power users with many apps
- Standard: For balanced experience
- Spacious: For touch-screen devices

---

## Troubleshooting

### Server Issues

**Problem: Server won't start**

```bash
# Check if port is in use
lsof -i :3022

# Kill process using port
kill -9 <PID>

# Try different port
PORT=3023 npm start
```

**Problem: Cannot access server**

```bash
# Check if server is running
ps aux | grep node

# Check firewall
sudo ufw status

# Allow port through firewall
sudo ufw allow 3022
```

### App Issues

**Problem: Apps not displaying**

1. Check `src/shared/config/apps.json` is valid JSON
2. Verify file permissions: `chmod 644 src/shared/config/apps.json`
3. Check browser console for errors
4. Hard refresh: `Ctrl + Shift + R`

**Problem: Icons not showing**

1. Check icon file exists: `ls src/shared/images/icons/`
2. Verify icon path in apps.json matches actual file
3. Check file permissions: `chmod 644 src/shared/images/icons/*`
4. Try default icon path: `src/shared/images/icons/template.svg`

**Problem: Drag and drop not working**

1. Verify app is in "Haupt" folder
2. Disable browser extensions (some may interfere)
3. Try different browser
4. Check browser console for JavaScript errors
5. Refresh page and try again

### Upload Issues

**Problem: File upload fails**

1. **Check file size:** Must be under 5MB
   ```bash
   ls -lh src/shared/images/icons/your-icon.png
   ```

2. **Check file type:** WebP, PNG, JPG only
   ```bash
   file src/shared/images/icons/your-icon.png
   ```

3. **Check directory permissions:**
   ```bash
   ls -ld src/shared/images/icons/
   chmod 755 src/shared/images/icons/
   ```

4. **Check disk space:**
   ```bash
   df -h
   ```

**Problem: Upload succeeds but icon not visible**

1. Hard refresh browser
2. Check icon path in apps.json
3. Verify icon file exists
4. Check file permissions

### Configuration Issues

**Problem: Settings not saving**

1. Check localStorage is enabled in browser
2. Verify browser console for errors
3. Try different browser
4. Clear browser cache and cookies

**Problem: Configuration lost after restart**

1. Ensure apps.json is writable:
   ```bash
   chmod 644 src/shared/config/apps.json
   ```

2. Check for file system errors:
   ```bash
   dmesg | grep error
   ```

3. Verify no disk space issues:
   ```bash
   df -h
   ```

### Network Issues

**Problem: CORS errors**

1. Check server.js CORS configuration
2. Add your domain to ALLOWED_ORIGINS in .env
3. Verify origin header in browser DevTools
4. Try disabling browser CORS temporarily (dev only)

**Problem: API requests failing**

1. Check server is running: `curl http://localhost:3022/api/apps`
2. Verify network tab in browser DevTools
3. Check server logs for errors
4. Verify API endpoints are correct

---

## FAQ

**Q: Can I use custom domains instead of localhost?**

A: Yes! Configure your web server (Nginx/Apache2) to proxy to QuantomOS:

```nginx
server {
    listen 80;
    server_name quantomos.example.com;

    location / {
        proxy_pass http://localhost:3022;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Q: How do I change the default port (3022)?**

A: Set the PORT environment variable:
```bash
PORT=8080 npm start
```

Or create a `.env` file:
```env
PORT=8080
```

**Q: Can I deploy this to production?**

A: Not yet. Complete security fixes from Phase 1.9 first:
- Implement authentication
- Fix XSS vulnerabilities
- Add input validation
- Use environment variables

**Q: Does this work on mobile devices?**

A: Yes! QuantomOS is fully responsive. Access from mobile browser. Native mobile app planned for future.

**Q: Can I have multiple users?**

A: Currently single-user system. Multi-user support with authentication coming in Phase 2.

**Q: How do I backup my configuration?**

A: Copy the entire `src/shared/config/` directory:
```bash
cp -r src/shared/config/ backup-$(date +%Y%m%d)/
```

**Q: Can I customize the appearance?**

A: Yes! Edit CSS variables in `src/shared/css/variables.css`:
```css
:root {
    --accent-color: #26bd6c; /* Change to your color */
    --bg-primary: #0a0d0d;
    --text-primary: #f5f5f5;
}
```

**Q: How do I add my own commands to the terminal?**

A: Edit `config/commands.json`:
```json
{
  "commands": [
    {
      "id": 1,
      "name": "mycommand",
      "description": "My custom command",
      "code": "echo 'Hello from my command!'"
    }
  ]
}
```

**Q: Can I integrate with external APIs?**

A: Yes! Add API calls in JavaScript files. Example:
```javascript
// Fetch external data
const response = await fetch('https://api.example.com/data');
const data = await response.json();
```

**Q: How do I report bugs or request features?**

A: Create an issue on GitHub or contact maintainers. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

**Q: Is there a mobile app?**

A: Not yet. PWA support exists (install to home screen). Native app planned for Phase 4.

**Q: Can I contribute to the project?**

A: Yes! We welcome contributions. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Q: What's the difference between Haupt and other folders?**

A: "Haupt" is the main folder with special auto-ordering and drag & drop support. Other folders are regular organizational folders.

**Q: How often should I backup?**

A: Recommended:
- Daily: If actively developing/modifying
- Weekly: For personal use
- After major changes: Always

**Q: Can I use this behind a firewall?**

A: Yes, as it's a local application. For external access, configure your firewall to allow traffic on the chosen port.

---

## Need More Help?

- **Documentation:** Check [README.md](README.md)
- **Contributing:** See [CONTRIBUTING.md](CONTRIBUTING.md)
- **Issues:** Report on GitHub
- **Contact:** contact@example.com

---

**Last Updated:** 2025-10-16
**Version:** 1.0.0
