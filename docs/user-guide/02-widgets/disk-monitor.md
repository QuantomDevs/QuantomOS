# Disk Monitor Widget

Monitor disk usage and storage capacity across all mounted drives.

## Overview

The Disk Monitor Widget displays storage information for all mounted disks and partitions. Track used and available space, monitor disk health, and identify storage bottlenecks.

## Use Cases

- Monitor storage capacity
- Identify full disks before they cause issues
- Track storage usage trends
- Manage multiple drives and partitions
- Plan storage upgrades

## Configuration Options

| Setting | Description | Default |
|---------|-------------|---------|
| **Refresh Interval** | Update frequency | 30 seconds |
| **Show All Disks** | Display all mounted disks | Yes |
| **Filter Disks** | Show only specific disks | None |
| **Display Format** | Bar, Circle, or List | Bar |
| **Show Percentages** | Display usage as percentage | Yes |

## Setup Instructions

1. Add "Disk Monitor" widget
2. Choose which disks to monitor (all or specific)
3. Select display format
4. Set refresh interval
5. Position on dashboard

## Information Displayed

For each disk:
- **Disk Name**: Mount point or drive letter
- **Total Capacity**: Total disk size
- **Used Space**: Currently used storage
- **Available Space**: Free storage remaining
- **Usage Percentage**: Utilization ratio
- **File System**: Type (ext4, NTFS, APFS, etc.)

## Display Formats

### Bar View
- Horizontal bars for each disk
- Color-coded by usage level
- Compact and clear

### Circle View
- Circular progress indicators
- Good for few disks
- Visually appealing

### List View
- Text-based table
- Most detailed information
- Best for many disks

## Color Coding

- **Green** (0-70%): Healthy disk usage
- **Yellow** (70-85%): Moderate usage, monitor
- **Orange** (85-95%): High usage, consider cleanup
- **Red** (95-100%): Critical, immediate action needed

## Permissions

**Linux**: Requires read access to `/proc/mounts` and disk info

**Docker**: Mount `/sys` volume as read-only

**Windows**: Typically no special permissions needed

**macOS**: Standard disk access permissions

## Tips

1. **Refresh Rate**: 30-60 seconds is usually sufficient
2. **Filter Disks**: Hide system partitions for cleaner display
3. **Alert Thresholds**: Monitor disks approaching 90% usage
4. **Size**: Minimum 2x2, larger for many disks

## Troubleshooting

**Disks Not Showing**: Verify mounts are accessible and permissions are correct

**Incorrect Usage**: Refresh may be needed after large file operations

**System Partitions**: Filter out unnecessary system mounts in settings

**Slow Updates**: Increase refresh interval if monitoring many large disks
