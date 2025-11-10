# Sonarr Widget

Monitor your Sonarr TV show automation and download management.

## Overview

The Sonarr Widget displays statistics and upcoming episodes from your Sonarr installation. Track wanted episodes, queue status, and series information.

## Configuration Options

| Setting | Description | Required |
|---------|-------------|----------|
| **Sonarr URL** | Base URL of Sonarr | Yes |
| **API Key** | Sonarr API key | Yes |
| **Show Queue** | Display download queue | No |
| **Show Upcoming** | Display upcoming episodes | No |

## Setup Instructions

1. Open Sonarr web interface
2. Settings → General → Security
3. Copy API Key
4. Add widget with Sonarr URL and API key
5. Configure display preferences

## Features Displayed

- **Series Count**: Total monitored series
- **Episodes**: Total/missing episodes
- **Queue**: Active downloads
- **Upcoming**: Next episodes to air
- **Disk Space**: Available storage
- **Calendar**: Upcoming releases

## Tips

- Minimum size: 3x2
- Pair with download client widgets
- Combine with Radarr for complete automation monitoring

## Troubleshooting

**Cannot Connect**: Verify Sonarr is accessible and URL is correct

**API Key Invalid**: Regenerate API key in Sonarr settings

**No Queue Items**: Check if Sonarr has active downloads
