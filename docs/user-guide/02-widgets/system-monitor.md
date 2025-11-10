# System Monitor Widget

Monitor real-time system resources including CPU, RAM, and network usage.

## Overview

The System Monitor Widget displays comprehensive system statistics from the server running QuantomOS. It provides real-time monitoring of CPU usage, memory consumption, and network activity.

## Use Cases

- Monitor server resource utilization
- Identify performance bottlenecks
- Track resource usage over time
- Alert to high CPU or memory usage
- Monitor network throughput

## Configuration Options

| Setting | Description | Default |
|---------|-------------|---------|
| **Refresh Interval** | Update frequency in seconds | 5 seconds |
| **Show CPU** | Display CPU usage | Yes |
| **Show Memory** | Display RAM usage | Yes |
| **Show Network** | Display network stats | Yes |
| **Display Style** | Gauge, Graph, or List | Gauge |

## Setup Instructions

1. Add "System Monitor" widget from the widget selector
2. Configure which metrics to display
3. Set refresh interval (balance detail vs performance)
4. Choose display style
5. Position and resize as needed

## Metrics Displayed

### CPU Usage
- **Current Usage**: Real-time CPU utilization percentage
- **Per-Core**: Individual core usage (if enabled)
- **Average**: Average usage over time
- **Temperature**: CPU temperature (if available)

### Memory Usage
- **Used Memory**: Currently used RAM
- **Total Memory**: Total available RAM
- **Usage Percentage**: Memory utilization
- **Available**: Free memory

### Network Activity
- **Upload Speed**: Current upload rate
- **Download Speed**: Current download rate
- **Total Transferred**: Cumulative data transfer

## Display Styles

### Gauge View
- Circular gauges for each metric
- Color-coded (green → yellow → red)
- Best for quick glance

### Graph View
- Line graphs showing usage over time
- Historical data (last 60 data points)
- Best for trend analysis

### List View
- Text-based list of metrics
- Most compact option
- Best for small widgets

## Permissions

**Linux**: May require elevated permissions for some metrics

**Docker**: Requires privileged mode and `/sys` volume mount

**Windows**: May need administrator access

**macOS**: Temperature monitoring requires `osx-temperature-sensor`

## Tips and Best Practices

1. **Refresh Interval**: 5-10 seconds for most use cases
2. **Placement**: Put on monitoring page or secondary page
3. **Size**: Minimum 3x2 for gauge view, 4x3 for graph view
4. **Performance**: Lower refresh rates if monitoring many widgets

## Troubleshooting

**No Data Shown**: Check that QuantomOS has permission to read system stats

**High CPU from Widget**: Increase refresh interval to reduce overhead

**Temperature Not Available**: Install temperature sensor package or check hardware support

**Network Stats Incorrect**: Verify network interface selection in settings
