# Media Request Manager Widget

Monitor and manage media requests from Overseerr or Jellyseerr.

## Overview

The Media Request Manager Widget integrates with Overseerr or Jellyseerr to display pending media requests, approved requests, and availability status.

## Supported Platforms

- **Overseerr**: Request management for Plex
- **Jellyseerr**: Request management for Jellyfin

## Configuration Options

| Setting | Description | Required |
|---------|-------------|----------|
| **Platform** | Overseerr or Jellyseerr | Yes |
| **Server URL** | Base URL of request manager | Yes |
| **API Key** | Authentication API key | Yes |
| **Show Pending** | Display pending requests | Yes |
| **Show Approved** | Display approved requests | No |

## Setup Instructions

1. Open Overseerr/Jellyseerr settings
2. Navigate to **Settings → General**
3. Copy API Key
4. Add widget with URL and API key
5. Configure display preferences

## Features Displayed

- **Pending Requests**: Awaiting approval
- **Approved Requests**: Being processed
- **Available**: Already in library
- **Request Counts**: Total requests by status
- **Recent Requests**: Latest submissions

## Tips

- Minimum size: 3x2
- Pair with Radarr/Sonarr widgets
- Enable notifications for new requests

## Troubleshooting

**No Requests Shown**: Verify API key and check request history

**Authentication Error**: Regenerate API key in settings

**Connection Failed**: Check URL and network accessibility
