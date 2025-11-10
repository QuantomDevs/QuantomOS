# Bookmarks Widget

Quick access to your favorite websites, applications, and services.

## Overview

The Bookmarks Widget displays a collection of links to your frequently accessed websites and applications. It supports multiple layout styles, custom icons, and flexible organization.

## Use Cases

- Quick access to homelab services
- Favorite websites and tools
- Internal application links
- Documentation shortcuts
- Frequently used dashboards

## Configuration Options

| Setting | Description | Default |
|---------|-------------|---------|
| **Title** | Widget title | "Bookmarks" |
| **Layout** | Display style | Vertical |
| **Hide Title** | Show/hide bookmark titles | No |
| **Hide Icons** | Show/hide bookmark icons | No |
| **Hide Hostnames** | Show/hide URLs | No |
| **Open in New Tab** | Open links in new tab | Yes |
| **Bookmarks** | List of bookmark items | Empty |

## Layout Options

### Vertical Layout
- Stack bookmarks vertically
- Full-width items
- Best for detailed view with all info

### Horizontal Layout
- Horizontal scrolling row
- Compact icons
- Best for icon-only view

### Grid Layout
- Responsive grid
- Balanced spacing
- Best for medium number of bookmarks

### Grid Horizontal Layout
- Grid that prioritizes horizontal filling
- Compact and organized
- Best for many bookmarks

## Adding Bookmarks

### Method 1: Manual Entry

1. Edit Bookmarks widget
2. Click "Add Bookmark"
3. Enter details:
   - **Name**: Display name
   - **URL**: Full URL including `http://` or `https://`
   - **Icon**: Auto-fetched from website or custom
4. Save bookmark

### Method 2: From Existing Apps

1. Edit Bookmarks widget
2. Click "Select from Apps"
3. Choose from configured applications
4. Bookmarks auto-populate with app details

## Icon Handling

### Automatic Icons (Favicons)

Icons are automatically fetched from:
- Website's favicon
- Google Favicon Service
- Domain root `/favicon.ico`

### Custom Icons

Upload custom icons:
1. Edit bookmark
2. Click "Upload Icon"
3. Choose image file (PNG, JPG, SVG)
4. Icon replaces favicon

### Fallback Icons

If icon fails to load:
- Generic globe icon shown
- Customize fallback in settings

## Organizing Bookmarks

### Reordering

1. Edit Bookmarks widget
2. Drag bookmark handles to reorder
3. Changes save automatically

### Categories

Create multiple Bookmark widgets for categories:
- **Services**: Homelab applications
- **Media**: Plex, Jellyfin, etc.
- **Monitoring**: Grafana, Uptime Kuma
- **Documentation**: Wiki, docs

## Display Customization

### Show/Hide Elements

Control what's displayed:
- **Icons**: Visual identification
- **Titles**: Bookmark names
- **Hostnames**: URL domains
- **Descriptions**: Optional detail text

### Examples

**Icon Only**:
- Hide titles, hostnames
- Compact grid layout
- Minimal space usage

**Full Detail**:
- Show all elements
- Vertical or grid layout
- Maximum information

**Balanced**:
- Icons + titles
- Hide hostnames
- Clean, informative

## Setup Examples

### Homelab Services

**Bookmarks**:
- Plex (`http://plex.local:32400`)
- qBittorrent (`http://downloads.local:8080`)
- Pi-hole (`http://pi.hole/admin`)
- Portainer (`http://portainer.local:9000`)

**Layout**: Grid
**Settings**: Show icons and titles, hide hostnames

### Documentation Links

**Bookmarks**:
- QuantomOS Docs
- Docker Documentation
- Nginx Docs
- Linux Command Reference

**Layout**: Vertical
**Settings**: Show all information

### Quick Access

**Bookmarks**:
- Gmail
- GitHub
- Reddit
- YouTube

**Layout**: Horizontal
**Settings**: Icons only, open in new tab

## Tips and Best Practices

1. **Logical Grouping**: Organize by function or category
2. **Consistent Naming**: Use clear, recognizable names
3. **Icon Consistency**: Favicons provide visual consistency
4. **Layout Choice**: Match layout to number of bookmarks
5. **Multiple Widgets**: Create separate widgets for different categories
6. **New Tab**: Enable for external links, disable for same-site navigation

## Advanced Features

### Smart Links

Some links have special handling:
- Internal apps: May show status indicators
- Monitored services: Show online/offline status

### Keyboard Navigation

- Tab through bookmarks
- Enter to open
- Arrow keys to navigate (vertical layout)

### Context Menu

Right-click bookmarks (desktop) for:
- Edit bookmark
- Remove bookmark
- Copy URL
- Open in new window

## Troubleshooting

### Icons Not Loading

**Solutions**:
- Check URL is correct and accessible
- Verify website has a favicon
- Try uploading custom icon
- Check network connectivity

### Links Not Opening

**Solutions**:
- Verify URL includes `http://` or `https://`
- Check URL is correct and accessible
- Disable popup blocker if using new tab
- Test URL in browser address bar

### Bookmarks Not Saving

**Solutions**:
- Check for errors in browser console
- Verify QuantomOS has write permissions
- Ensure disk space available

### Layout Looks Wrong

**Solutions**:
- Try different layout style
- Adjust widget size
- Hide unnecessary elements
- Check number of bookmarks (too many for layout)

## Widget Sizing

### Minimum Sizes

- **Vertical**: 2x2 minimum
- **Horizontal**: 3x1 minimum
- **Grid**: 3x2 minimum

### Recommended Sizes

- **Few Bookmarks (1-6)**: 3x2
- **Medium (7-15)**: 4x3
- **Many (16+)**: 4x4 or larger

## Privacy and Security

- Bookmarks stored in QuantomOS configuration
- Encrypted with other sensitive data
- Not shared externally
- Favicons fetched via public services (Google Favicon API)

## Related Widgets

- [Apps/Shortcuts](./apps.md): Alternative for application links
- [Notes](./notes.md): Store URLs with context in notes
- [Custom Extensions](./custom-extension.md): Create advanced link widgets

## Export/Import

Bookmarks can be exported/imported via:
1. Settings → Backup & Data
2. Export Configuration
3. Bookmarks included in backup

Restore bookmarks by importing configuration backup.
