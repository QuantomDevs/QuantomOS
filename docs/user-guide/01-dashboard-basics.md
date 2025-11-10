# Dashboard Basics

Welcome to QuantomOS! This guide will help you understand and master the dashboard interface.

## Table of Contents

- [Dashboard Overview](#dashboard-overview)
- [Navigation and Header](#navigation-and-header)
- [Adding Widgets](#adding-widgets)
- [Managing Widgets](#managing-widgets)
- [Working with Pages](#working-with-pages)
- [Edit Mode](#edit-mode)
- [Keyboard Shortcuts](#keyboard-shortcuts)

---

## Dashboard Overview

The QuantomOS dashboard is your command center for monitoring and managing your homelab. The interface is designed to be intuitive, customizable, and responsive across all devices.

### Main Components

1. **Header Bar**: Navigation, search, and quick actions
2. **Widget Grid**: Customizable area where all your widgets live
3. **Page Selector**: Switch between different dashboard pages
4. **Add Widget Button**: Quickly add new widgets
5. **Settings**: Customize appearance and configure the dashboard

### Responsive Design

QuantomOS adapts to your screen size:
- **Desktop**: Full grid layout with drag-and-drop
- **Tablet**: Adaptive grid with touch gestures
- **Mobile**: Optimized single-column layout

Desktop and mobile layouts are managed separately, allowing you to create different arrangements for each device type.

---

## Navigation and Header

The header bar provides quick access to essential features:

### Header Elements

**Left Side**:
- **Logo/Title**: Dashboard branding (customizable in settings)
- **Search Bar**: Quick search using your preferred search engine (optional)

**Center**:
- **Page Selector**: Buttons to switch between dashboard pages
- **Internet Indicator**: Shows connection status (optional)

**Right Side**:
- **Add Widget Button** (`+`): Opens the widget selector
- **Settings Button**: Access dashboard configuration
- **Profile Menu**: User profile and logout

### Search Functionality

Enable search in Settings → General → Search:
1. Toggle "Enable Search"
2. Select your preferred search provider:
   - Google
   - DuckDuckGo
   - Bing
   - Custom URL

Type your query and press Enter to search.

---

## Adding Widgets

Add widgets to your dashboard in just a few clicks:

### Step-by-Step Guide

1. **Click the `+` button** in the header (or press `A` key)

2. **Choose widget category**:
   - **Widgets**: All built-in widgets
   - **Apps**: Application shortcuts
   - **Custom Extensions**: User-created widgets
   - **Dual Widget**: Combine two widgets
   - **Group**: Container for organizing widgets

3. **Select your widget**:
   - Browse available widgets in grid or list view
   - Use the search bar to find specific widgets
   - Toggle between grid and list view with the view switcher

4. **Configure the widget**:
   - Fill in required settings (URL, API key, etc.)
   - Customize appearance options
   - Set widget size and position preferences

5. **Add to dashboard**:
   - Click "Add" or "Save"
   - Widget appears on your active page
   - Adjust position by dragging (desktop)

### Widget Categories

**Monitoring**:
- System Monitor: CPU, RAM, disk usage
- Disk Monitor: Individual disk statistics
- Network Monitor: Network usage and stats

**Services**:
- Media Servers: Plex, Jellyfin, Emby
- Download Clients: qBittorrent, Transmission, SABnzbd
- Arr Stack: Sonarr, Radarr, Lidarr, Prowlarr
- Ad Blockers: Pi-hole, AdGuard Home

**Utilities**:
- Weather: Current weather and forecast
- Date & Time: Clock and calendar
- Notes: Markdown note-taking
- Bookmarks: Quick access links
- Calendar: iCal integration with events

**Content**:
- Iframe: Embed external web content
- Video Stream: Display video feeds and cameras

**Organizational**:
- Dual Widget: Split view for two widgets
- Group Widget: Container for multiple widgets

For detailed information on each widget, see the [Widgets Guide](./02-widgets/).

---

## Managing Widgets

Once widgets are on your dashboard, you can customize their layout and appearance.

### Moving Widgets (Desktop)

1. **Enable Edit Mode**:
   - Click the edit icon in the header
   - Or press `E` on your keyboard

2. **Drag to Move**:
   - Click and hold the widget's drag handle (top area)
   - Drag to desired position
   - Release to place

3. **Grid Snapping**:
   - Widgets automatically snap to the grid
   - Adjust grid size in Settings → Grid Customization

### Resizing Widgets (Desktop)

1. **Enable Edit Mode** (if not already active)

2. **Find Resize Handle**:
   - Located at the bottom-right corner of each widget
   - Appears as a small handle icon

3. **Drag to Resize**:
   - Click and drag the resize handle
   - Widget resizes to fit the grid
   - Some widgets have minimum size requirements

### Editing Widget Settings

1. **Open Widget Menu**:
   - Hover over a widget (desktop)
   - Click the menu icon (three dots) in the top-right

2. **Select "Edit"**:
   - Opens the configuration dialog
   - Modify widget settings
   - Changes save automatically or when you click "Save"

3. **Available Options** (varies by widget):
   - Connection settings (URL, API key)
   - Display preferences
   - Refresh intervals
   - Visual customization

### Deleting Widgets

1. **Open Widget Menu** (three dots icon)

2. **Select "Delete"**:
   - Confirmation dialog appears
   - Click "Delete" to confirm
   - Widget is removed immediately

**Note**: Deleted widgets can be re-added, but configurations are lost unless backed up.

### Mobile Gestures

On mobile devices:
- **Tap and hold**: Open widget menu
- **Swipe**: Navigate between pages
- **Tap edit button**: Enter edit mode

---

## Working with Pages

Organize your dashboard across multiple pages for better organization.

### Page Selector

Page buttons appear in the header:
- Click a page button to switch to that page
- Active page is highlighted
- Each page has its own widget layout

### Creating Pages

1. **Open Settings**
2. **Navigate to General → Pages Management**
3. **Click "Add Page"**
4. **Enter page name** (e.g., "Home", "Monitoring", "Media")
5. **Click "Create"**

New pages start empty. Add widgets to populate them.

### Renaming Pages

1. **Settings → General → Pages Management**
2. **Click the edit icon** next to the page name
3. **Enter new name**
4. **Save changes**

### Deleting Pages

1. **Settings → General → Pages Management**
2. **Click the delete icon** next to the page name
3. **Confirm deletion**

**Warning**: Deleting a page removes all widgets on that page. This action cannot be undone.

### Page Organization Tips

Organize pages by purpose:
- **Home**: Most important widgets and shortcuts
- **Monitoring**: System stats and service health
- **Media**: Media servers and download clients
- **Network**: Network tools and statistics
- **Smart Home**: Home automation widgets

---

## Edit Mode

Edit mode enables drag-and-drop functionality for rearranging your dashboard.

### Entering Edit Mode

**Desktop**:
- Click the edit icon in the header
- Press `E` on your keyboard

**Mobile**:
- Tap the edit button in the header

### In Edit Mode

While in edit mode:
- **Drag widgets** to reposition them
- **Resize widgets** using corner handles (desktop)
- **Grid highlights** show available positions
- **Changes auto-save** as you make them

### Exiting Edit Mode

- Click the edit icon again
- Press `E` on your keyboard
- Changes are saved automatically

### Auto-Save

QuantomOS automatically saves all changes:
- Widget positions
- Widget sizes
- Widget configurations
- No manual save button needed

---

## Keyboard Shortcuts

Speed up your workflow with keyboard shortcuts:

| Shortcut | Action | Description |
|----------|--------|-------------|
| `A` | Add Widget | Opens the widget selector |
| `E` | Edit Mode | Toggles edit mode on/off |
| `S` | Settings | Opens the settings modal |
| `/` | Search | Focus the search bar |
| `Esc` | Close | Closes open modals and dialogs |
| `1-9` | Switch Page | Jump to page 1-9 |

### Customizing Shortcuts

Keyboard shortcuts can be viewed in:
- Settings → Keyboard Shortcuts

Currently, shortcuts are fixed but may be customizable in future versions.

### Operating System Specific

**macOS**:
- Use `Cmd` instead of `Ctrl` where applicable

**Windows/Linux**:
- Standard `Ctrl` key combinations

---

## Tips and Best Practices

### Organization

1. **Group related widgets**: Use pages or group widgets for logical organization
2. **Prioritize important info**: Put critical widgets on the home page
3. **Consistent layout**: Maintain similar widget sizes for visual harmony

### Performance

1. **Limit widgets per page**: Too many widgets can slow down the page
2. **Adjust refresh rates**: Increase intervals for widgets you check less frequently
3. **Use groups**: Organize multiple small widgets in a group widget

### Customization

1. **Experiment with layouts**: Try different arrangements to find what works
2. **Use backgrounds**: Add custom backgrounds in Settings → Background & Icons
3. **Adjust grid spacing**: Fine-tune spacing in Settings → Grid Customization
4. **Theme colors**: Customize colors in Settings → Colors

### Backup

1. **Regular backups**: Export your configuration regularly
2. **Settings → Backup & Data**: Use the backup feature
3. **Save to cloud**: Store backups in cloud storage for safety

---

## Next Steps

Now that you understand the basics:
- [Explore available widgets](./02-widgets/) to add to your dashboard
- [Configure settings](./03-settings.md) to customize appearance
- [Create custom extensions](../developer-guide/02-extension-structure.md) for advanced functionality

---

## Troubleshooting

### Widgets Not Loading

- Check internet connection
- Verify widget configuration (API keys, URLs)
- Check service status (is the target service running?)

### Can't Drag Widgets

- Ensure edit mode is enabled
- Check if you're on a mobile device (limited drag support)
- Try refreshing the page

### Changes Not Saving

- Ensure you're logged in
- Check browser console for errors
- Verify sufficient disk space on server

### Layout Looks Wrong

- Clear browser cache
- Try the "Desktop to Mobile" sync in Settings → Backup & Data
- Reset layout if needed (Settings → Backup & Data)

For more help, see [GitHub Issues](https://github.com/QuantomDevs/quantomos/issues).
