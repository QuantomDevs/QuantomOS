# Iframe Widget

Embed external web content directly in your dashboard.

## Overview

The Iframe Widget allows you to embed any external website or web application directly into your dashboard. Perfect for integrating third-party tools, dashboards, and services that don't have dedicated widgets.

## Use Cases

- Embed monitoring dashboards (Grafana, Kibana)
- Display security camera web interfaces
- Integrate third-party tools
- Show documentation pages
- Embed custom web applications
- Display network device interfaces

## Configuration Options

| Setting | Description | Default | Required |
|---------|-------------|---------|----------|
| **URL** | Full URL to embed | None | Yes |
| **Interactive** | Allow interaction with content | Yes | No |
| **Refresh Interval** | Auto-reload interval (seconds) | 0 (never) | No |
| **Show Border** | Display iframe border | Yes | No |

## Setup Instructions

1. Add "Iframe" widget from selector
2. Enter full URL (must include `http://` or `https://`)
3. Configure interactivity:
   - **Interactive**: Users can click, scroll, interact
   - **Display Only**: Content visible but not clickable
4. Set refresh interval if needed
5. Position and resize widget

## URL Requirements

### Format

URLs must be complete and valid:
- **Good**: `https://example.com/dashboard`
- **Good**: `http://192.168.1.100:3000`
- **Bad**: `example.com` (missing protocol)
- **Bad**: `localhost` (may not work in all contexts)

### Protocol

- **HTTPS**: Recommended for external sites
- **HTTP**: OK for local network resources
- **Protocol Matching**: Some sites require matching protocol (HTTPS QuantomOS → HTTPS iframe)

## Interactive Mode

### Interactive (Enabled)

- Users can click buttons
- Forms are functional
- Links can be followed
- Full interaction enabled
- Scrolling works

**Use for**: Functional dashboards, tools, applications

### Display Only (Disabled)

- Content visible but frozen
- No clicking or interaction
- Scrolling may be limited
- Pointer events blocked

**Use for**: Status displays, read-only dashboards, monitoring screens

## Common Embed Use Cases

### Grafana Dashboard

```
URL: https://grafana.local:3000/d/dashboard-id
Interactive: Yes
Refresh: 60 seconds
```

### Home Assistant

```
URL: http://homeassistant.local:8123
Interactive: Yes
Refresh: 0 (manual only)
```

### Router Interface

```
URL: http://192.168.1.1
Interactive: Yes (for management)
```

### Security Camera

```
URL: http://camera.local/live
Interactive: No (display only)
Refresh: 30 seconds
```

### Documentation

```
URL: https://docs.example.com/manual
Interactive: Yes (for navigation)
```

## Security Considerations

### Same-Origin Policy

- Some sites prevent embedding (X-Frame-Options)
- Banking and sensitive sites often block iframes
- Test URL in iframe before deploying

### Mixed Content

- HTTPS QuantomOS cannot embed HTTP content (browser security)
- Either use HTTPS for everything or HTTP for everything
- Use reverse proxy to add HTTPS to HTTP services

### Authentication

- Embedded sites may require separate login
- Session cookies may not persist
- Consider using service-specific widgets instead

### Content Security Policy (CSP)

- Some sites have strict CSP preventing embedding
- Check browser console for CSP errors
- No workaround - use alternative integration

## Responsive Sizing

### Widget Size

- **Minimum**: 3x2 grid cells
- **Recommended**: 4x3 or larger
- **Full Screen**: Use largest size for complex interfaces

### Scaling

Embedded content scales with widget:
- Content remains at original size
- Scrolling enabled for overflow
- Some sites adapt to iframe size
- Others have fixed dimensions

## Refresh Options

### Auto-Refresh

Set interval to automatically reload:
- **0**: Manual refresh only
- **30-60 seconds**: Monitoring dashboards
- **300+ seconds**: Less critical content

### Manual Refresh

- Click widget menu → Refresh
- Reloads iframe content
- Clears cached version

## Limitations

### Cannot Embed

These sites typically block embedding:
- **Google**: Most Google services
- **Banking Sites**: Security restrictions
- **Social Media**: Facebook, Instagram (except embeds)
- **Streaming**: Most video streaming services

### Browser Restrictions

- Cross-origin content limitations
- Cookie and storage restrictions
- Security policy enforcement

## Troubleshooting

### "Refused to Connect" Error

**Cause**: Site blocks iframe embedding (X-Frame-Options)

**Solutions**:
- Check if site has embed API or widget
- Look for dedicated widget alternative
- Contact service provider for embed permission
- Use reverse proxy with header modification (advanced)

### Blank White Screen

**Causes**:
- URL incorrect or inaccessible
- Site requires authentication
- JavaScript errors in embedded content

**Solutions**:
1. Test URL in regular browser tab
2. Check browser console for errors
3. Verify authentication/login
4. Try different URL or page

### Mixed Content Warning

**Cause**: HTTPS dashboard embedding HTTP content

**Solutions**:
- Use HTTPS for embedded content
- Or use HTTP for entire QuantomOS (not recommended)
- Set up reverse proxy with SSL

### Content Doesn't Fit

**Solutions**:
- Increase widget size
- Check if embedded site has mobile/compact view
- Look for URL parameters to adjust layout
- Some sites have `?embed=true` or similar

### Can't Interact with Content

**Solutions**:
- Enable "Interactive" mode in widget settings
- Check if display-only mode is active
- Verify JavaScript is enabled
- Test in regular browser first

## Advanced Configuration

### URL Parameters

Add parameters for customization:
- **Grafana**: `?kiosk=tv` for fullscreen
- **Home Assistant**: `?embed=1` for clean view
- **Custom Apps**: Check documentation for embed parameters

### Custom Styling

Some embedded content can be styled:
- Look for theme parameter in URL
- Check for dark/light mode options
- Some services have embed-specific styling

## Examples

### Monitoring Dashboard

```
Widget: Iframe
URL: https://grafana.local/d/overview?kiosk=tv&theme=dark
Interactive: No
Refresh: 60s
Size: 6x4
```

### Home Automation

```
Widget: Iframe
URL: http://homeassistant:8123/lovelace/dashboard
Interactive: Yes
Refresh: 0
Size: 8x6
```

### Network Device

```
Widget: Iframe
URL: http://192.168.1.1/status
Interactive: No (monitoring only)
Refresh: 300s
Size: 4x3
```

### Documentation

```
Widget: Iframe
URL: https://docs.local/getting-started
Interactive: Yes
Refresh: 0
Size: 6x5
```

## Alternatives to Iframe Widget

If iframe doesn't work:
1. **Dedicated Widgets**: Check if specific widget exists
2. **Custom Extension**: Create custom widget with API
3. **Bookmark**: Simple link instead of embed
4. **External Link**: Open in new tab/window

## Performance Impact

- Each iframe loads separate webpage
- Multiple iframes can slow dashboard
- Auto-refresh multiplies load
- Consider:
  - Limit number of iframe widgets
  - Increase refresh intervals
  - Use lightweight embedded content

## Related Widgets

- [Video Stream](./video-stream.md): For video content
- [Bookmarks](./bookmarks.md): For simple links
- [Custom Extension](./custom-extension.md): For API integration
