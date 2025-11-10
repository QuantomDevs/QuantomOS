# Dual Widget

Combine two widgets into a single split-view container.

## Overview

The Dual Widget allows you to display two widgets side-by-side or top-to-bottom in a single container. This is perfect for creating compact, organized layouts and grouping related information.

## Use Cases

- Combine related widgets (e.g., CPU and RAM monitoring)
- Save dashboard space with compact layouts
- Create logical groupings (e.g., Pi-hole and AdGuard stats)
- Display complementary information together
- Maximize information density

## Configuration Options

| Setting | Description | Options |
|---------|-------------|---------|
| **Layout** | Split direction | Horizontal or Vertical |
| **Split Ratio** | Size ratio of widgets | 50/50, 60/40, 70/30 |
| **Left/Top Widget** | First widget | Any widget type |
| **Right/Bottom Widget** | Second widget | Any widget type |

## Setup Instructions

1. Click `+` button and select "Dual Widget"
2. Choose layout direction:
   - **Horizontal**: Side-by-side (left/right)
   - **Vertical**: Stacked (top/bottom)
3. Select split ratio (how much space each widget gets)
4. Choose first widget and configure it
5. Choose second widget and configure it
6. Position dual widget on dashboard

## Layout Options

### Horizontal Split (Side-by-Side)
```
┌─────────┬─────────┐
│ Widget  │ Widget  │
│   1     │    2    │
│         │         │
└─────────┴─────────┘
```
Best for: Widgets with similar height, comparison views

### Vertical Split (Top-Bottom)
```
┌───────────────────┐
│     Widget 1      │
├───────────────────┤
│     Widget 2      │
└───────────────────┘
```
Best for: Widgets with similar width, stacked information

## Split Ratios

- **50/50**: Equal space for both widgets
- **60/40**: More space for primary widget
- **70/30**: Prominent primary, supplementary secondary
- **40/60**: Reverse emphasis
- **30/70**: Large secondary widget

## Compatible Widgets

Most widgets work in dual containers, including:
- System monitoring widgets
- Weather and DateTime
- Notes (for smaller notes)
- Service status indicators
- Compact download client views

**Not Recommended**:
- Very large widgets with lots of content
- Widgets requiring significant horizontal/vertical space
- Other dual or group widgets (nesting not supported)

## Tips and Best Practices

1. **Complementary Widgets**: Pair widgets that relate to each other
2. **Size Appropriately**: Ensure dual widget is large enough for both sub-widgets
3. **Minimum Size**: Typically 4x2 for horizontal, 2x4 for vertical
4. **Consistent Types**: Similar widget types often look better together
5. **Test Responsiveness**: Check how widgets display at different sizes

## Example Combinations

### System Overview
- **Left**: CPU Monitor (gauge)
- **Right**: Memory Monitor (gauge)
- **Layout**: Horizontal, 50/50

### Weather Station
- **Top**: Current Weather
- **Bottom**: 5-Day Forecast
- **Layout**: Vertical, 40/60

### Download Status
- **Left**: qBittorrent Stats
- **Right**: SABnzbd Stats
- **Layout**: Horizontal, 50/50

### Ad Blocking Dashboard
- **Top**: Pi-hole Statistics
- **Bottom**: AdGuard Statistics
- **Layout**: Vertical, 50/50

### Media Monitoring
- **Left**: Plex Now Playing
- **Right**: Overseerr Requests
- **Layout**: Horizontal, 60/40

## Editing Dual Widgets

### Change Layout
1. Click widget menu (three dots)
2. Select "Edit"
3. Change layout direction or split ratio
4. Save changes

### Replace Sub-Widget
1. Edit dual widget
2. Select different widget type for left/right or top/bottom
3. Configure new widget
4. Save

### Adjust Split Ratio
1. Edit dual widget
2. Move split ratio slider
3. Preview changes
4. Save when satisfied

## Troubleshooting

### Widgets Too Cramped

**Solutions**:
- Increase dual widget size
- Adjust split ratio to give more space to cramped widget
- Choose more compact widgets
- Switch to vertical layout for more vertical space

### Sub-Widget Not Loading

**Solutions**:
- Edit and reconfigure the sub-widget
- Check sub-widget's individual connection settings
- Verify sub-widget works standalone first

### Uneven Sizing

**Solution**: Adjust split ratio to balance widget sizes

### Can't Resize Properly

**Solution**: Dual widget inherits size constraints of sub-widgets - ensure both sub-widgets support the intended size

## Alternatives

- **Group Widget**: For more than two widgets
- **Multiple Individual Widgets**: For complete flexibility
- **Tabs**: Consider using pages to organize instead

## Related Features

- [Group Widget](./group-widget.md): Container for multiple widgets
- [Dashboard Basics](../01-dashboard-basics.md): Layout fundamentals
- [Grid Customization](../03-settings.md): Adjust grid spacing
