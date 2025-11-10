# Radarr Widget

Monitor your Radarr movie automation and download management.

## Overview

The Radarr Widget displays statistics from your Radarr installation. Track wanted movies, queue status, and library information.

## Configuration Options

| Setting | Description | Required |
|---------|-------------|----------|
| **Radarr URL** | Base URL of Radarr | Yes |
| **API Key** | Radarr API key | Yes |
| **Show Queue** | Display download queue | No |
| **Show Upcoming** | Display upcoming releases | No |

## Setup Instructions

1. Open Radarr web interface
2. Settings → General → Security
3. Copy API Key
4. Add widget with Radarr URL and API key
5. Configure display options

## Features Displayed

- **Movie Count**: Total monitored movies
- **Available**: Movies in library
- **Missing**: Wanted movies
- **Queue**: Active downloads
- **Disk Space**: Available storage
- **Upcoming**: Theatrical/digital releases

## Tips

- Minimum size: 3x2
- Pair with download client and Plex widgets
- Use with Sonarr for complete media automation

## Troubleshooting

**Connection Error**: Verify Radarr is running and accessible

**Invalid API Key**: Generate new API key in Radarr

**Statistics Not Updating**: Check refresh interval and Radarr logs
