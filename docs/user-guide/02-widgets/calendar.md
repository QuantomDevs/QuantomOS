# Calendar Widget

Display monthly calendar with events from iCal feeds and media managers.

## Overview

The Calendar Widget provides a visual month view with event integration from iCal sources and media automation tools. Track upcoming events, releases, and appointments directly on your dashboard.

## Use Cases

- View monthly calendar at a glance
- Track upcoming media releases (Radarr/Sonarr)
- Import events from calendar services
- Monitor scheduled tasks
- Plan based on upcoming dates

## Configuration Options

| Setting | Description | Required |
|---------|-------------|----------|
| **Enable iCal** | Import iCal calendar feeds | No |
| **iCal URL** | URL to .ics calendar file | If iCal enabled |
| **Media Integration** | Import from Radarr/Sonarr | No |
| **Default View** | Month or week view | No |

## Setup Instructions

### Basic Setup

1. Add "Calendar" widget from selector
2. Widget displays current month by default
3. Use arrows to navigate months
4. Click dates to view events

### iCal Integration

1. Get iCal URL from your calendar service:
   - **Google Calendar**: Calendar Settings → Secret address in iCal format
   - **Outlook**: Export calendar, get public URL
   - **Apple Calendar**: Share calendar, copy webcal URL (change to http/https)
   - **Nextcloud**: Calendar Settings → Download
2. Edit Calendar widget
3. Toggle "Enable iCal"
4. Paste iCal URL
5. Save (events import automatically)

### Media Integration

Connect with Radarr/Sonarr to show:
- Movie theatrical releases
- Movie digital releases
- TV episode air dates
- Series premiere dates

1. Edit Calendar widget
2. Enable "Media Integration"
3. Calendar automatically fetches from configured Radarr/Sonarr widgets
4. Events appear on release dates

## Calendar Display

### Month View

```
     November 2024
Mo Tu We Th Fr Sa Su
             1  2  3
 4  5  6  7  8  9 10
11 12 13 14 15 16 17
18 19 20 21 22 23 24
25 26 27 28 29 30
```

**Features**:
- Current day highlighted
- Days with events underlined
- Weekend days in accent color
- Previous/next month navigation

### Day Events

Click any date with events to view:
- Event title
- Event time (if specified)
- Event description
- Event source (iCal, Radarr, Sonarr)

### Visual Indicators

- **Underline**: Day has events
- **Dots**: Multiple events (color-coded)
- **Bold**: Current day
- **Accent Color**: Weekends (Saturday/Sunday)

## Event Types

### iCal Events

Display any iCalendar event:
- All-day events
- Timed events
- Recurring events (daily, weekly, monthly)
- Multi-day events

### Media Events

**From Radarr**:
- Theatrical release dates
- Digital/Physical release dates
- Monitoring upcoming movies

**From Sonarr**:
- Episode air dates
- Season premieres
- Series finales

## iCal Sources

### Google Calendar

1. Open Google Calendar
2. Settings → Your calendar → Integrate calendar
3. Copy "Secret address in iCal format"
4. Use in Calendar widget

**URL Format**: `https://calendar.google.com/calendar/ical/...`

### Outlook/Office 365

1. Calendar.live.com → Settings
2. Shared calendars → Publish calendar
3. Copy ICS link
4. Use in Calendar widget

### Apple iCloud Calendar

1. iCloud.com → Calendar
2. Click share icon next to calendar
3. Enable "Public Calendar"
4. Copy link (change `webcal://` to `https://`)

### Nextcloud

1. Nextcloud Calendar app
2. Click share icon
3. Copy public link
4. Append `/download` to URL

### Other Services

Most calendar services support iCal export:
- Look for "Subscribe" or "Export" options
- Get public iCal/ICS URL
- Paste into widget configuration

## Customization

### Visual Appearance

All colors use theme system:
- Weekend highlighting
- Event indicators
- Current day marker
- Navigation elements

Customize in Settings → Colors

### Size Requirements

- **Minimum**: 3x3 grid cells
- **Recommended**: 4x4 for comfortable viewing
- **Larger Sizes**: More space for event details

### Event Filtering

Filter events by:
- Source (iCal vs media)
- Event type
- Date range

## Tips and Best Practices

1. **iCal URL**: Use read-only public URLs, not edit URLs
2. **Multiple Calendars**: Merge multiple iCal feeds or use multiple widgets
3. **Privacy**: Be aware iCal URLs grant access to calendar contents
4. **Caching**: Events cache for 15-30 minutes to reduce API calls
5. **Recurring Events**: Ensure iCal source includes recurrence rules

## Advanced Features

### Event Reminders

- Visual indicators for upcoming events
- Optional notifications (if enabled)

### Multi-Calendar Support

Combine events from:
- Personal iCal calendar
- Work calendar
- Media release calendar
- Custom event sources

### Timezone Handling

- Events display in your local timezone
- Automatic daylight saving time adjustment
- Configure timezone in widget settings

## Troubleshooting

### iCal Events Not Loading

**Solutions**:
- Verify iCal URL is accessible (test in browser)
- Check URL format (should start with `http://` or `https://`)
- Ensure calendar is publicly accessible
- Try different iCal source
- Check browser console for CORS errors

### Media Events Not Showing

**Solutions**:
- Verify Radarr/Sonarr widgets are configured
- Check that media services have upcoming releases
- Enable media integration in calendar settings
- Refresh calendar widget

### Wrong Timezone

**Solutions**:
- Check browser timezone settings
- Manually set timezone in widget settings
- Verify iCal events have correct timezone data

### Recurring Events Not Working

**Solutions**:
- Ensure iCal feed includes RRULE (recurrence rule)
- Check event source exports recurring events
- Test with simpler recurring event

### Calendar Looks Cramped

**Solutions**:
- Increase widget size
- Hide event count indicators
- Use week view instead of month view
- Reduce number of event sources

## Performance

### Caching

- iCal feeds cached for 15-30 minutes
- Media events refresh with Radarr/Sonarr
- Manual refresh available

### API Limits

- iCal fetches subject to source's rate limits
- Minimize fetch frequency
- Use caching effectively

## Privacy and Security

- iCal URLs may contain private information
- Use read-only public URLs when possible
- iCal contents visible to anyone with URL
- QuantomOS doesn't share calendar data
- Calendar data cached locally

## Examples

### Personal Dashboard

- Google Calendar integration
- Upcoming birthdays and appointments
- Work schedule
- Reminders and tasks

### Media Calendar

- Radarr movie releases
- Sonarr episode air dates
- Streaming service releases
- Theater premiere dates

### Homelab Maintenance

- Server maintenance schedule
- Backup schedules
- SSL certificate renewals
- Update reminders

## Related Widgets

- [Date & Time](./datetime.md): Current date/time display
- [Radarr](./radarr.md): Movie release tracking
- [Sonarr](./sonarr.md): TV show tracking
- [Notes](./notes.md): Event notes and planning

## Version History

- **v1.2.0**: Added media integration support
- **v1.1.0**: Recurring event support
- **v1.0.0**: Initial iCal integration
