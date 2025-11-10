# Group Widget

Organize multiple widgets in a single container with custom layouts.

## Overview

The Group Widget acts as a container for multiple widgets, allowing you to organize related widgets together with flexible layouts. Perfect for creating organized sections on your dashboard.

## Use Cases

- Group related monitoring widgets
- Create themed sections (media, downloads, system)
- Organize services by function
- Build modular dashboard sections
- Create portable widget groups

## Configuration Options

| Setting | Description |
|---------|-------------|
| **Group Title** | Optional title for the container |
| **Layout** | Grid, List, or Custom |
| **Widgets** | Collection of widgets in the group |
| **Border** | Show/hide group border |
| **Background** | Group background color/style |

## Setup Instructions

1. Add "Group Widget" from widget selector
2. Set group title (optional)
3. Choose layout style
4. Add widgets to the group
5. Arrange widgets within the group
6. Position group widget on dashboard

## Layout Styles

### Grid Layout
- Widgets arranged in a grid
- Auto-sizing based on content
- Flexible and responsive
- Best for mixed widget types

### List Layout
- Vertical list of widgets
- Equal width for all widgets
- Compact presentation
- Best for similar widget types

### Custom Layout
- Manually position each widget
- Full control over placement
- Complex arrangements possible
- Best for specific designs

## Managing Widgets in Groups

### Adding Widgets
1. Edit group widget
2. Click "Add Widget"
3. Select widget type
4. Configure widget
5. Widget appears in group

### Removing Widgets
1. Edit group widget
2. Click remove icon on widget
3. Confirm removal

### Reordering Widgets
1. Edit group widget
2. Enter edit mode
3. Drag widgets to reorder
4. Save changes

## Group Customization

### Title Bar
- Enable/disable title
- Customize title text
- Choose title alignment

### Styling
- Border on/off
- Border color
- Background color
- Padding and spacing

### Size
- Groups can be resized like regular widgets
- Minimum size depends on content
- Auto-adjust to fit widgets

## Example Group Configurations

### System Monitoring Group
**Widgets**:
- CPU Monitor
- RAM Monitor
- Disk Usage
- Network Stats

**Layout**: Grid 2x2

### Media Server Group
**Widgets**:
- Plex Status
- Radarr Stats
- Sonarr Stats
- Download Client

**Layout**: Grid 2x2 or List

### Network Services Group
**Widgets**:
- Pi-hole Stats
- AdGuard Stats
- Router Status
- VPN Status

**Layout**: Grid or List

### Download Management Group
**Widgets**:
- qBittorrent
- SABnzbd
- Radarr Queue
- Sonarr Queue

**Layout**: Grid 2x2

## Tips and Best Practices

1. **Logical Grouping**: Group related widgets together
2. **Consistent Sizes**: Use similarly-sized widgets in a group
3. **Title Usage**: Use titles to identify group purpose
4. **Layout Choice**: Match layout to widget types and content
5. **Minimum Size**: Ensure group is large enough for all widgets
6. **Nesting**: Avoid putting groups inside groups (not supported)

## Advanced Features

### Collapsible Groups
- Click title to collapse/expand (if enabled)
- Save space on busy dashboards
- Remember state across sessions

### Templates
- Save group configurations as templates
- Reuse common layouts
- Share group setups

### Styling
- Match group style to dashboard theme
- Use borders to separate sections
- Custom backgrounds for visual hierarchy

## Troubleshooting

### Widgets Overlapping

**Solutions**:
- Increase group widget size
- Switch to list layout
- Remove some widgets
- Adjust spacing in settings

### Group Too Large

**Solutions**:
- Split into multiple groups
- Use dual widgets for some content
- Remove less important widgets

### Can't Add More Widgets

**Solution**: Check if group has widget limit (typically 10-20)

### Layout Looks Wrong

**Solutions**:
- Try different layout style
- Manually adjust widget positions (custom layout)
- Resize group widget

## Comparison with Dual Widget

| Feature | Dual Widget | Group Widget |
|---------|-------------|--------------|
| **Widget Count** | Exactly 2 | Multiple (10+) |
| **Layout** | Split view | Grid/List/Custom |
| **Complexity** | Simple | More complex |
| **Use Case** | Quick pairing | Full organization |
| **Customization** | Limited | Extensive |

## Performance Considerations

- Groups with many widgets may impact performance
- Each widget makes its own API calls
- Consider refresh rates of grouped widgets
- Use groups judiciously on mobile

## Related Features

- [Dual Widget](./dual-widget.md): Simpler two-widget container
- [Dashboard Basics](../01-dashboard-basics.md): Layout fundamentals
- [Pages](../01-dashboard-basics.md#working-with-pages): Alternative organization method
