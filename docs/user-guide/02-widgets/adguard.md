# AdGuard Home Widget

Monitor your AdGuard Home DNS ad-blocking and privacy protection statistics.

## Overview

The AdGuard Home Widget provides real-time statistics from AdGuard Home, showing blocked queries, protection status, and DNS query metrics.

## Use Cases

- Monitor ad and tracker blocking
- View DNS query statistics
- Enable/disable protection
- Track blocked requests
- Monitor AdGuard health

## Configuration Options

| Setting | Description | Required |
|---------|-------------|----------|
| **AdGuard URL** | Base URL of AdGuard Home | Yes |
| **Username** | Admin username | Yes |
| **Password** | Admin password | Yes |
| **Refresh Interval** | Update frequency | No |

## Setup Instructions

### 1. Find AdGuard URL

**Default Installation**:
- `http://adguard.local`
- `http://192.168.1.x:3000`

**Docker**:
- `http://adguardhome:3000`
- Use container name or host IP

### 2. Get Credentials

Use your AdGuard Home admin credentials:
- Set during initial setup
- Or found in AdGuard Home configuration

### 3. Configure Widget

1. Add "AdGuard Home" widget
2. Enter AdGuard URL
3. Provide username and password
4. Set refresh interval
5. Save and position

## Statistics Displayed

- **Queries Processed**: Total DNS requests
- **Blocked Requests**: Number of blocked queries
- **Blocking Percentage**: Protection effectiveness
- **Safe Browsing**: Malware/phishing blocks
- **Parental Control**: Filtered queries
- **Average Processing Time**: DNS query speed

## Features

### Protection Controls

- **Enable/Disable Protection**: Toggle all filtering
- **Safe Browsing**: Malware and phishing protection
- **Parental Control**: Content filtering
- **Safe Search**: Force safe search on search engines

### Statistics Display

- Real-time query metrics
- Blocked domains count
- Top blocked domains
- Top queried domains
- Client statistics

## Tips

1. **Minimum Size**: 3x2 for basic stats
2. **Credentials**: Store securely, encrypted by QuantomOS
3. **Refresh Rate**: 30-60 seconds
4. **Compare with Pi-hole**: Run both for redundancy

## Troubleshooting

**Authentication Failed**: Verify username and password in AdGuard settings

**Connection Refused**: Check URL and port, ensure AdGuard is running

**Statistics Not Loading**: Verify API access is enabled

**Slow Updates**: Increase refresh interval or check network latency
