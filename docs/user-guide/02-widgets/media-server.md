# Media Server Widget

Monitor and access your media server (Plex, Jellyfin, or Emby).

## Overview

The Media Server Widget integrates with popular media server platforms to display currently playing content, library statistics, and provide quick access to your media server's web interface.

## Supported Platforms

- **Plex Media Server**
- **Jellyfin**
- **Emby**

## Configuration Options

| Setting | Description | Required |
|---------|-------------|----------|
| **Server Type** | Plex, Jellyfin, or Emby | Yes |
| **Server URL** | Base URL of media server | Yes |
| **API Key/Token** | Authentication token | Yes |
| **Show Now Playing** | Display active streams | No |
| **Show Library Stats** | Display library counts | No |

## Setup Instructions

### Plex

1. Find your Plex server URL (e.g., `http://192.168.1.100:32400`)
2. Get Plex Token:
   - Sign in to Plex Web
   - Play any media
   - Open browser dev tools → Network
   - Find request with `X-Plex-Token` parameter
   - Or use: `https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/`
3. Add widget and enter URL and token

### Jellyfin

1. Find Jellyfin URL (e.g., `http://192.168.1.100:8096`)
2. Get API key:
   - Dashboard → API Keys
   - Create new API key
   - Name it "QuantomOS"
3. Add widget with URL and API key

### Emby

1. Find Emby URL (e.g., `http://192.168.1.100:8096`)
2. Get API key:
   - Settings → Advanced → API Keys
   - Create new key
3. Add widget with URL and API key

## Features Displayed

- **Now Playing**: Active streams and what's being watched
- **Library Stats**: Total movies, shows, episodes, music
- **Recent Additions**: Latest content added
- **Server Status**: Online/offline indicator
- **Quick Access**: Link to web interface

## Tips

1. **Minimum Size**: 3x2 for basic info
2. **Privacy**: Disable "Now Playing" if preferred
3. **Multiple Servers**: Add separate widget for each server

## Troubleshooting

**Cannot Connect**: Verify server is accessible and URL is correct

**Authentication Failed**: Regenerate API key/token

**No Data Showing**: Check API key permissions and server accessibility
