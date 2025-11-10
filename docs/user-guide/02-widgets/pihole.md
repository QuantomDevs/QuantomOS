# Pi-hole Widget

Monitor your Pi-hole DNS ad-blocker statistics and status.

## Overview

The Pi-hole Widget displays real-time statistics from your Pi-hole installation, including blocked queries, total queries, percentage blocked, and blocking status.

## Use Cases

- Monitor ad-blocking effectiveness
- Track DNS query statistics
- Enable/disable blocking remotely
- View top blocked domains
- Monitor Pi-hole health

## Configuration Options

| Setting | Description | Required |
|---------|-------------|----------|
| **Pi-hole URL** | Base URL of Pi-hole | Yes |
| **API Key** | Pi-hole API token | Yes |
| **Refresh Interval** | Update frequency | No |

## Setup Instructions

### 1. Find Pi-hole URL

**Standard Installation**:
- `http://pi.hole/admin`
- `http://192.168.1.x/admin`

**Custom Domain**:
- `http://pihole.yourdomain.com`

### 2. Get API Key

1. Open Pi-hole admin interface
2. Navigate to **Settings**
3. Go to **API** tab
4. Click **Show API token**
5. Copy the token
6. (Or find in `/etc/pihole/setupVars.conf`)

### 3. Configure Widget

1. Add "Pi-hole" widget
2. Enter Pi-hole URL (without `/admin/api.php`)
3. Paste API key
4. Set refresh interval (default: 30 seconds)
5. Save and position

## Statistics Displayed

- **Queries Today**: Total DNS queries
- **Blocked Today**: Number of blocked requests
- **Percent Blocked**: Blocking effectiveness
- **Domains on Blocklist**: Total blocked domains
- **Status**: Enabled/Disabled
- **Queries per Minute**: Current query rate

## Features

### Quick Actions

- **Enable/Disable Blocking**: Toggle ad-blocking on/off
- **Temporary Disable**: Disable for 30s, 5min, or custom duration
- **Flush Logs**: Clear query history
- **Update Gravity**: Refresh blocklists

### Visual Display

- Circular statistics gauges
- Color-coded blocking status
- Trend graphs (optional)
- Top blocked domains list

## Tips

1. **Minimum Size**: 2x2 grid cells
2. **API Key**: Keep secure, grants admin access
3. **Refresh Rate**: 30-60 seconds recommended
4. **Multiple Pi-holes**: Add separate widget for each instance

## Troubleshooting

**Cannot Connect**: Verify Pi-hole is accessible from QuantomOS server

**Invalid API Key**: Regenerate API key in Pi-hole settings

**Statistics Not Updating**: Check refresh interval and Pi-hole logs

**CORS Errors**: Add QuantomOS domain to Pi-hole's allowed origins
