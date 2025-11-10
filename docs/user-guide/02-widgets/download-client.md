# Download Client Widgets

Monitor and control your download clients including qBittorrent, Transmission, Deluge, SABnzbd, and NZBGet.

## Overview

The Download Client widgets provide integration with popular torrent and Usenet download managers. Monitor active downloads, upload/download speeds, and manage your download queue directly from your dashboard.

## Supported Clients

- **qBittorrent**: Popular open-source torrent client
- **Transmission**: Lightweight torrent client
- **Deluge**: Feature-rich torrent client
- **SABnzbd**: Usenet binary newsreader
- **NZBGet**: Efficient Usenet downloader

## Configuration Options

| Setting | Description | Required |
|---------|-------------|----------|
| **Client URL** | Base URL of download client | Yes |
| **Username** | Authentication username | Varies |
| **Password** | Authentication password | Varies |
| **Refresh Interval** | Update frequency (seconds) | No |
| **Show Statistics** | Display speed and totals | No |

## Setup Instructions

### 1. Find Your Client URL

**Local Installation**:
- qBittorrent: `http://localhost:8080`
- Transmission: `http://localhost:9091`
- Deluge: `http://localhost:8112`
- SABnzbd: `http://localhost:8080`
- NZBGet: `http://localhost:6789`

**Docker Installation**:
- Use container name: `http://qbittorrent:8080`
- Or use host IP: `http://192.168.1.100:8080`

**Remote Access**:
- Use full URL: `http://downloads.yourdomain.com`

### 2. Get Credentials

**qBittorrent**:
- Default username: `admin`
- Default password: Set during first login
- Enable Web UI in settings

**Transmission**:
- Configure in `settings.json`
- Set `rpc-authentication-required: true`
- Add `rpc-username` and `rpc-password`

**Deluge**:
- Enable Web UI plugin
- Default password: `deluge`
- Change in Preferences → Interface

**SABnzbd**:
- API Key required (Settings → General)
- Optional username/password

**NZBGet**:
- Default username: `nzbget`
- Default password: `tegbzn6789`
- Change in Settings → Security

### 3. Add Widget

1. Click `+` button in header
2. Select your download client widget
3. Enter URL, username, and password
4. Test connection
5. Save and position widget

## Features

### Statistics Display

- **Download Speed**: Current download rate
- **Upload Speed**: Current upload rate
- **Active Downloads**: Number of active torrents/jobs
- **Queue**: Pending downloads
- **Total Downloaded**: Session or all-time stats
- **Total Uploaded**: Upload statistics

### Download Management

**Available Actions**:
- **Pause/Resume**: Control individual downloads
- **Remove**: Delete completed or failed downloads
- **Priority**: Adjust download priority
- **Open Web UI**: Quick link to full client interface

**Queue Display**:
- Download name
- Progress bar
- Size and downloaded amount
- Speed and ETA
- Status (downloading, seeding, paused, etc.)

### Visual Indicators

- **Progress Bars**: Visual download progress
- **Speed Graphs**: Historical speed charts
- **Status Icons**: Download state indicators
- **Color Coding**: Status-based colors

## Client-Specific Features

### qBittorrent

- Category filtering
- Tag support
- Detailed peer information
- Tracker management

### Transmission

- Lightweight and fast
- Simple, clean interface
- Efficient resource usage

### Deluge

- Plugin system integration
- Advanced queue management
- Label/category support

### SABnzbd

- Usenet-specific features
- Category-based processing
- Post-processing scripts
- RSS feed support

### NZBGet

- Efficient Usenet downloading
- Low resource usage
- Advanced post-processing
- Extension scripts

## Security Considerations

### Network Access

**Local Network**: Use HTTP for local-only access

**Internet Access**: Always use HTTPS with valid certificates

**VPN**: Consider VPN for remote access instead of port forwarding

### Authentication

- Always change default passwords
- Use strong, unique passwords
- Enable two-factor authentication if available
- Restrict Web UI access by IP

### API Keys

- Keep API keys secure
- Don't share in screenshots or logs
- Rotate keys periodically

## Tips and Best Practices

1. **URL Format**: Include protocol (`http://` or `https://`)
2. **Port Numbers**: Don't forget port in URL
3. **Refresh Rate**: 10-30 seconds balances freshness and load
4. **Multiple Clients**: Add separate widgets for each client
5. **Widget Size**: Minimum 3x2 for basic stats, 4x3+ for queue

## Troubleshooting

### Cannot Connect to Client

**Solutions**:
1. Verify client is running
2. Check URL and port are correct
3. Ensure Web UI is enabled in client
4. Test URL in browser first
5. Check firewall settings
6. Verify network connectivity

### Authentication Failed

**Solutions**:
1. Verify username and password
2. Check if authentication is enabled
3. Try default credentials
4. Reset password in client
5. Check API key (SABnzbd/NZBGet)

### No Downloads Showing

**Solutions**:
1. Ensure downloads are active in client
2. Check filter settings in widget
3. Refresh widget or page
4. Verify client has active torrents
5. Check client logs for errors

### Slow or No Updates

**Solutions**:
1. Reduce refresh interval
2. Check network latency
3. Verify client is responsive
4. Restart download client
5. Check server resources

### CORS Errors

**Solution**: Add QuantomOS URL to client's allowed origins

**qBittorrent**: Settings → Web UI → Bypass authentication for clients on localhost

**Transmission**: Add to `rpc-whitelist` in settings

## Integration Examples

### Complete Download Station

Combine multiple widgets:
- qBittorrent for torrents
- SABnzbd for Usenet
- Radarr/Sonarr for automation
- System Monitor for resource tracking

### Minimal Setup

Single client widget:
- Show only active downloads
- Compact size (2x2)
- Hide detailed statistics

### Power User Dashboard

Full-featured display:
- Multiple client widgets
- Detailed statistics
- Speed graphs
- Queue management

## Related Widgets

- **Radarr/Sonarr**: Automated media management
- **System Monitor**: Track download impact on system
- **Network Monitor**: Monitor bandwidth usage
