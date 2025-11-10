# Widgets Guide

Complete reference for all QuantomOS widgets.

## Widget Categories

### Monitoring & System
- [Weather Widget](./weather.md) - Weather conditions and forecasts
- [Date & Time Widget](./datetime.md) - Clock and calendar display
- [System Monitor Widget](./system-monitor.md) - CPU, RAM, and network monitoring
- [Disk Monitor Widget](./disk-monitor.md) - Storage and disk usage

### Download Management
- [Download Client Widgets](./download-client.md) - qBittorrent, Transmission, Deluge, SABnzbd, NZBGet

### Media Management
- [Media Server Widget](./media-server.md) - Plex, Jellyfin, Emby integration
- [Media Request Manager Widget](./media-request-manager.md) - Overseerr/Jellyseerr
- [Sonarr Widget](./sonarr.md) - TV show automation
- [Radarr Widget](./radarr.md) - Movie automation

### Network & Security
- [Pi-hole Widget](./pihole.md) - DNS ad-blocking statistics
- [AdGuard Home Widget](./adguard.md) - Ad-blocking and privacy protection

### Utilities
- [Notes Widget](./notes.md) - Markdown note-taking
- [Bookmarks Widget](./bookmarks.md) - Quick access links
- [Calendar Widget](./calendar.md) - Monthly calendar with iCal integration

### Content Display
- [Iframe Widget](./iframe.md) - Embed external web content
- [Video Stream Widget](./video-stream.md) - Live video feeds and cameras

### Organization
- [Dual Widget](./dual-widget.md) - Two widgets in one container
- [Group Widget](./group-widget.md) - Multiple widgets in organized container

## Quick Reference

### Widget Sizing Guide

| Widget | Minimum Size | Recommended Size |
|--------|--------------|------------------|
| Weather | 2x2 | 3x2 or 4x2 |
| DateTime | 2x1 | 2x1 or 3x1 |
| System Monitor | 3x2 | 4x3 |
| Disk Monitor | 2x2 | 3x3 |
| Download Client | 3x2 | 4x3 |
| Pi-hole/AdGuard | 2x2 | 3x2 |
| Media Server | 3x2 | 4x3 |
| Notes | 2x2 | Variable |
| Bookmarks | 2x2 | 3x2 or 4x3 |
| Calendar | 3x3 | 4x4 |
| Iframe | 3x2 | 4x3+ |
| Video Stream | 3x2 | 4x3+ |
| Dual Widget | 4x2 | Variable |
| Group Widget | 4x3 | Variable |

### Common Refresh Intervals

| Widget Type | Recommended Interval |
|-------------|---------------------|
| System Monitoring | 5-10 seconds |
| Disk Usage | 30-60 seconds |
| Weather | 30-60 minutes |
| Download Clients | 10-30 seconds |
| Media Servers | 30-60 seconds |
| Ad Blockers | 30-60 seconds |
| Calendar | Manual/on load |

## Getting Started

1. **Add a Widget**: Click the `+` button in the header
2. **Select Category**: Choose from widgets, apps, extensions, etc.
3. **Configure**: Fill in required settings (URLs, API keys, etc.)
4. **Position**: Drag to desired location
5. **Resize**: Adjust size using corner handles (desktop)

For detailed instructions, see [Dashboard Basics](../01-dashboard-basics.md).

## Configuration Best Practices

### API Keys and Credentials

- Store securely (QuantomOS encrypts sensitive data)
- Use read-only API keys when possible
- Never share keys in screenshots
- Regenerate keys if compromised

### Performance

- Balance refresh rates (don't refresh too frequently)
- Limit number of widgets per page (10-15 recommended)
- Use appropriate widget sizes
- Disable auto-refresh for rarely-used widgets

### Organization

- Group related widgets together
- Use pages to categorize by function
- Employ dual/group widgets for compact layouts
- Maintain consistent widget sizes for visual harmony

### Security

- Use HTTPS for external connections
- Keep services on isolated network segments
- Use authentication for all services
- Monitor access logs regularly

## Troubleshooting

### Common Issues

**Widget Shows "Loading..."**:
- Check internet/network connectivity
- Verify service is running and accessible
- Check API key/credentials
- Review browser console for errors

**Cannot Connect to Service**:
- Verify URL is correct (include `http://` or `https://`)
- Check port numbers
- Ensure service is accessible from QuantomOS server
- Test URL in browser first

**Authentication Failed**:
- Verify credentials are correct
- Regenerate API key/token
- Check if service requires special permissions
- Ensure authentication is enabled in service

**Data Not Updating**:
- Check refresh interval settings
- Verify service is returning data
- Look for rate limiting
- Check network connectivity

For widget-specific troubleshooting, see individual widget documentation.

## Creating Custom Widgets

Can't find the widget you need? Create your own!

- [Custom Extensions](../../developer-guide/02-extension-structure.md) - Build custom widgets with JSON
- [Extension Documentation](../../extensions/) - Complete extension development guide

## Need Help?

- [GitHub Issues](https://github.com/QuantomDevs/quantomos/issues) - Report bugs or request features
- [Dashboard Basics](../01-dashboard-basics.md) - Learn the fundamentals
- [Settings Guide](../03-settings.md) - Customize your dashboard
