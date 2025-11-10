# Settings Guide

Complete reference for configuring and customizing QuantomOS.

## Table of Contents

- [Accessing Settings](#accessing-settings)
- [General Settings](#general-settings)
- [Background & Icons](#background--icons)
- [Grid Customization](#grid-customization)
- [Color Customization](#color-customization)
- [Backup & Data](#backup--data)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Security](#security)
- [Pages Management](#pages-management)

---

## Accessing Settings

Open the Settings modal:
- Click the **Settings icon** in the header
- Press **`S`** on your keyboard
- Settings appear as a modal dialog with sidebar navigation

Settings are organized by category in the left sidebar. Click any category to view and modify those settings.

**Auto-Save**: All changes save automatically - no "Save" button needed.

---

## General Settings

Configure basic dashboard preferences and behavior.

### Custom Title

**Description**: Customize the dashboard title displayed in the header

**Options**:
- Enter custom text (e.g., "My Homelab", "Server Dashboard")
- Leave blank for default "QuantomOS"
- Supports up to 50 characters

**Use Cases**:
- Personal branding
- Identify different QuantomOS instances
- Organizational naming

### Search

**Enable Search**: Toggle search bar visibility

**Search Provider Options**:
- **Google**: Default web search
- **DuckDuckGo**: Privacy-focused search
- **Bing**: Microsoft search
- **Custom**: Enter your own search URL

**Custom Search URL Format**:
```
https://search.example.com/search?q={query}
```
Replace `{query}` with search term placeholder

**Usage**: Type in search bar and press Enter

### Internet Indicator

**Description**: Display connection status indicator in header

**Options**:
- **Enabled**: Shows green (connected) or red (disconnected) indicator
- **Disabled**: No indicator shown

**Use Cases**:
- Monitor dashboard connectivity
- Troubleshoot network issues
- Verify internet status at a glance

### Public Access

**Description**: Allow viewing dashboard without authentication

**Options**:
- **Enabled**: Dashboard viewable by anyone (read-only)
- **Disabled**: Login required to view dashboard

**When Enabled**:
- Dashboard visible without login
- All widgets display
- No editing or settings access
- Admin features require authentication

**Security Note**: Only enable on trusted networks

---

## Background & Icons

Customize visual appearance with custom backgrounds and app icons.

### Background Type

**Toggle Options**:
- **Background Image**: Use uploaded wallpaper
- **Background Color**: Use solid color

### Background Image Mode

**Upload Wallpaper**:
1. Click "Upload Background"
2. Select image file (JPG, PNG, WebP)
3. Maximum size: 10MB
4. Image uploads and appears in gallery

**Select Active Background**:
- Click any uploaded wallpaper to set as active
- Selected background applies immediately
- Check mark indicates active background

**Delete Background**:
- Click delete icon on wallpaper thumbnail
- Confirmation required
- Cannot delete currently active background

**Blur Slider**:
- **Range**: 0-20 pixels
- **0**: No blur (sharp)
- **5-10**: Subtle blur (recommended)
- **15-20**: Heavy blur
- Improves text readability over busy images

### Background Color Mode

**Color Picker**:
- Click color swatch to open picker
- Choose any color
- Color applies immediately
- Saved to theme

**Presets**:
- Quick access to common colors
- Dark theme colors
- Custom saved colors

### Custom Icons

**Upload App Icon**:
1. Click "Upload Icon"
2. Select image file
3. Assign to app or bookmark
4. Icon appears in uploads gallery

**Manage Icons**:
- View all uploaded icons
- Delete unused icons
- Replace existing icons

**Supported Formats**: PNG, JPG, SVG, ICO

---

## Grid Customization

Fine-tune widget grid layout and spacing.

### Widget Size

**Slider Controls**:
- **Width**: Horizontal size of grid cells
- **Height**: Vertical size of grid cells
- **Range**: 50-200 pixels

**Recommendations**:
- **Desktop**: 80-120 pixels
- **Tablet**: 70-100 pixels
- **Mobile**: Managed separately

**Effects**:
- Larger: Fewer widgets fit, more space
- Smaller: More widgets fit, compact layout

### Spacing

**Gap Control**:
- **Range**: 0-40 pixels
- **Default**: 10-15 pixels

**Effects**:
- Larger gaps: Airier, more separated
- Smaller gaps: Compact, dense layout
- 0: No gaps between widgets

### Border Radius

**Slider Control**:
- **Range**: 0-30 pixels
- **0**: Sharp corners
- **8-12**: Subtle rounding (recommended)
- **20+**: Very rounded corners

**Applies To**:
- All widgets
- Modal dialogs
- Buttons
- UI elements

### Live Preview

Changes apply immediately to dashboard. Adjust sliders while viewing dashboard to see real-time effect.

---

## Color Customization

Customize the dashboard color scheme to match your preferences.

### Theme Variables

**Available Colors**:
- **Primary Background**: Main dashboard background
- **Secondary Background**: Widget and panel background
- **Accent Color**: Buttons, links, highlights
- **Secondary Accent**: Secondary highlights
- **Primary Text**: Main text color
- **Secondary Text**: Subtext and labels
- **Border Color**: Widget and element borders

### Color Picker

**Using the Picker**:
1. Click color swatch for variable
2. Pick color visually or enter hex code
3. Color updates immediately
4. Changes save automatically

**Color Formats**:
- **Hex**: `#1976d2`
- **RGB**: `rgb(25, 118, 210)`
- **HSL**: `hsl(207, 79%, 46%)`

### Presets

**Default Themes**:
- Dark theme (default)
- Light theme
- High contrast
- Custom saved themes

**Create Preset**:
1. Customize colors
2. Click "Save as Preset"
3. Name your theme
4. Access later from presets

### Import/Export Theme

**Export Theme**:
1. Click "Export Theme"
2. JSON file downloads
3. Contains all color variables
4. Share or backup theme

**Import Theme**:
1. Click "Import Theme"
2. Select JSON theme file
3. Colors load immediately
4. Review and adjust as needed

### Reset to Default

Click "Reset Colors" to restore default theme. Confirmation required before resetting.

---

## Backup & Data

Export, import, and manage dashboard configuration.

### Export Configuration

**What's Included**:
- Dashboard layout
- All widget configurations
- Settings and preferences
- Custom backgrounds (references)
- Pages and organization
- User preferences

**How to Export**:
1. Click "Export Configuration"
2. JSON file downloads
3. Filename: `quantomos-backup-YYYY-MM-DD.json`
4. Store safely

**Use Cases**:
- Regular backups
- Migrate to new server
- Test configurations
- Disaster recovery

### Import Configuration

**How to Import**:
1. Click "Import Configuration"
2. Select backup JSON file
3. Confirm import
4. Dashboard reloads with imported config

**Important Notes**:
- Overwrites current configuration
- Existing layout is replaced
- API keys and credentials preserved
- Page refresh required after import

**Restore Options**:
- **Full Restore**: Everything replaced
- **Merge**: Keep existing, add new (future feature)

### Layout Sync (Desktop to Mobile)

**Description**: Copy desktop layout to mobile layout

**Use Cases**:
- Start mobile layout from desktop design
- Maintain consistency across devices
- Quick mobile setup

**How to Sync**:
1. Configure desktop layout
2. Click "Sync Desktop to Mobile"
3. Confirm sync
4. Mobile layout matches desktop (adapted for mobile)

**Note**: Sizes and positions adjusted for mobile screen

### Clear Data

**Reset Options**:
- **Clear Layout**: Remove all widgets, keep settings
- **Clear Settings**: Reset to defaults, keep layout
- **Clear All**: Full reset (requires confirmation)

**Warning**: These actions cannot be undone. Export backup first!

---

## Keyboard Shortcuts

View and reference available keyboard shortcuts.

### Available Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| `A` | Add Widget | Opens widget selector |
| `E` | Edit Mode | Toggles edit mode on/off |
| `S` | Settings | Opens settings modal |
| `/` | Search | Focuses search bar |
| `Esc` | Close | Closes modals and dialogs |
| `1-9` | Switch Page | Jumps to page 1-9 |

### Operating System

**macOS**: Shortcuts work as shown

**Windows/Linux**: Use standard modifier keys

### Future Enhancements

- Custom shortcut configuration
- Additional shortcuts
- Shortcut cheat sheet (press `?`)

---

## Security

Manage authentication, password, and profile settings.

### Change Password

**Requirements**:
- Minimum 6 characters
- Current password required
- New password confirmed

**How to Change**:
1. Enter current password
2. Enter new password
3. Confirm new password
4. Click "Change Password"
5. Confirmation message appears

**Best Practices**:
- Use strong, unique password
- Change regularly
- Don't reuse passwords
- Store securely

### Update Username

**Description**: Change display name for user account

**How to Update**:
1. Enter new username
2. Username updates immediately
3. Displayed in profile menu

**Note**: Username is for display only, authentication uses password

### Profile Picture

**Upload Picture**:
1. Click "Upload Picture"
2. Select image (JPG, PNG)
3. Max size: 5MB
4. Picture uploads and displays

**Remove Picture**:
- Click "Remove Picture"
- Confirmation required
- Reverts to default avatar

**Display Location**:
- Header profile menu
- Settings sidebar

### Sessions & Tokens

**Session Duration**: 24 hours

**Auto-Logout**: After 24 hours of inactivity (configurable)

**Active Sessions**: View and manage active sessions (future feature)

---

## Pages Management

Create, rename, and organize dashboard pages.

### Page List

View all pages:
- Page name
- Widget count
- Creation date
- Actions (edit, delete)

### Add New Page

**How to Create**:
1. Click "Add Page"
2. Enter page name
3. Click "Create"
4. Empty page created
5. Add widgets to new page

**Page Names**:
- Keep names concise (1-3 words)
- Descriptive (e.g., "Monitoring", "Media")
- Unique names preferred

### Rename Page

**How to Rename**:
1. Click edit icon next to page name
2. Enter new name
3. Press Enter or click save
4. Page name updates everywhere

### Delete Page

**How to Delete**:
1. Click delete icon
2. Confirmation dialog appears
3. Confirm deletion
4. Page and all widgets removed

**Warning**: Cannot be undone. Export backup first!

**Restrictions**:
- Cannot delete last remaining page
- Confirmation required

### Reorder Pages

**How to Reorder**:
1. Drag page using drag handle
2. Drop in new position
3. Page order updates
4. Header buttons reflect new order

**Note**: Page order affects keyboard shortcuts (1-9)

### Set Home Page

**Default Page**: First page is home (loads on dashboard open)

**Change Home Page**: Reorder pages to make desired page first

---

## Tips and Best Practices

### Performance

1. **Limit Widgets**: 10-15 widgets per page optimal
2. **Refresh Rates**: Balance freshness and performance
3. **Background Size**: Optimize images (<2MB recommended)
4. **Page Count**: Organize, but don't create excessive pages

### Organization

1. **Pages by Function**: Group related widgets
2. **Naming Convention**: Consistent page names
3. **Priority Order**: Most important pages first
4. **Backup Regularly**: Export weekly or after major changes

### Customization

1. **Theme Consistency**: Stick to cohesive color scheme
2. **Grid Spacing**: Balance density and readability
3. **Background Blur**: Improve text contrast
4. **Widget Sizes**: Maintain consistency within page

### Security

1. **Strong Password**: 12+ characters recommended
2. **Public Access**: Only on trusted networks
3. **Regular Updates**: Keep QuantomOS updated
4. **Backup Encryption**: Store backups securely

---

## Troubleshooting

### Settings Won't Save

**Solutions**:
- Check browser console for errors
- Verify disk space available
- Ensure write permissions
- Try different browser

### Import Fails

**Solutions**:
- Verify JSON file is valid
- Check file isn't corrupted
- Ensure file is from compatible version
- Review error message

### Colors Look Wrong

**Solutions**:
- Reset to default theme
- Try different browser
- Clear browser cache
- Check color picker values

### Can't Delete Page

**Reasons**:
- Last remaining page (minimum 1 required)
- Insufficient permissions

**Solution**: Create new page first, then delete

---

## Related Documentation

- [Dashboard Basics](./01-dashboard-basics.md) - Learn dashboard fundamentals
- [Widgets](./02-widgets/) - Configure individual widgets
- [Getting Started](../getting-started/03-configuration.md) - Initial setup guide

---

## Settings Privacy

**Local Storage**: All settings stored locally

**Encryption**: Sensitive data (passwords, API keys) encrypted with AES-256-CBC

**No Telemetry**: No settings data sent to external servers

**Backup Security**: Exported configs contain encrypted credentials
