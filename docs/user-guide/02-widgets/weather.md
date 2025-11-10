# Weather Widget

Display current weather conditions and forecasts for your location.

## Overview

The Weather Widget provides real-time weather information including temperature, conditions, humidity, wind speed, and multi-day forecasts. It automatically detects your location or allows you to specify a custom location.

## Use Cases

- Monitor current weather conditions at a glance
- View upcoming weather forecasts
- Track weather at multiple locations (add multiple widgets)
- Plan outdoor activities based on forecast data
- Monitor weather for remote locations (vacation homes, family members, etc.)

## Configuration Options

| Setting | Description | Type | Default | Required |
|---------|-------------|------|---------|----------|
| **Location** | City name or coordinates | Text | Auto-detected | No |
| **Units** | Temperature units | Dropdown | Fahrenheit | No |
| **Refresh Interval** | How often to update weather data | Number | 30 minutes | No |
| **Show Forecast** | Display multi-day forecast | Toggle | Enabled | No |
| **Forecast Days** | Number of days to show in forecast | Number | 5 | No |

### Location Options

You can specify location in several formats:
- **City name**: `New York`, `London`, `Tokyo`
- **City, State**: `Austin, TX`, `Portland, OR`
- **City, Country**: `Paris, France`, `Toronto, Canada`
- **Coordinates**: `40.7128,-74.0060` (latitude,longitude)
- **Auto-detect**: Leave blank to use your current location

### Units

- **Fahrenheit**: Temperature in °F, wind in mph
- **Celsius**: Temperature in °C, wind in km/h
- **Kelvin**: Temperature in K (scientific)

## Setup Instructions

### Basic Setup

1. **Add the Widget**:
   - Click the `+` button in the header
   - Select "Weather" from the widget list
   - Click "Add"

2. **Configure Location**:
   - Enter your city name or leave blank for auto-detection
   - Select your preferred temperature units
   - Click "Save"

3. **Position the Widget**:
   - Drag to your desired location
   - Resize as needed (minimum 2x2 grid cells)

### Advanced Configuration

**Multiple Locations**:
- Add multiple weather widgets for different locations
- Useful for tracking weather in multiple cities
- Each widget configured independently

**Refresh Interval**:
- Default: 30 minutes
- Minimum: 10 minutes (to avoid API rate limits)
- Maximum: 120 minutes
- Lower intervals consume more API calls

**Forecast Display**:
- Toggle forecast on/off
- Adjust number of days (1-7)
- Larger forecasts require more widget height

## Features

### Current Weather

Displays:
- **Temperature**: Current temperature
- **Conditions**: Weather description (Sunny, Cloudy, Rainy, etc.)
- **Feels Like**: Apparent temperature
- **Humidity**: Relative humidity percentage
- **Wind Speed**: Wind velocity and direction
- **Weather Icon**: Visual representation of conditions

### Forecast

Shows upcoming weather:
- **Daily Forecast**: High/low temperatures
- **Conditions**: Expected weather
- **Icons**: Visual forecast indicators
- **Day Labels**: Day of week

### Visual Indicators

- **Weather Icons**: Intuitive visual representations
- **Temperature Gradient**: Color-coded temperatures
- **Condition Animations**: Dynamic weather effects (optional)

## Tips and Best Practices

### Accuracy

1. **Specific Locations**: Use city + state/country for accuracy
2. **Coordinates**: Most accurate for exact locations
3. **Update Frequency**: Balance freshness with API limits

### Layout

1. **Minimum Size**: 2x2 grid cells for basic info
2. **Recommended Size**: 3x2 or 4x2 for full forecast
3. **Placement**: Put on home page for quick reference

### Performance

1. **Refresh Interval**: Use 30-60 minutes for most use cases
2. **Forecast Days**: Limit to 5 days to save space
3. **Multiple Widgets**: Each widget makes separate API calls

### Customization

1. **Units**: Match your local preference
2. **Forecast**: Enable/disable based on needs
3. **Size**: Resize to balance detail and space

## Troubleshooting

### Widget Shows "Loading..."

**Possible Causes**:
- No internet connection
- Weather API is down
- Invalid location

**Solutions**:
1. Check internet connectivity
2. Verify location spelling
3. Try coordinates instead of city name
4. Check browser console for error messages

### Location Not Found

**Solutions**:
1. Use more specific location (add state/country)
2. Try alternative location format
3. Use coordinates: Find on Google Maps
4. Leave blank to auto-detect

### Weather Data Outdated

**Causes**:
- Long refresh interval
- Widget hasn't refreshed yet

**Solutions**:
1. Manually refresh the page
2. Reduce refresh interval in widget settings
3. Check that widget hasn't been paused

### Incorrect Temperature Units

**Solution**:
1. Edit widget settings
2. Change units dropdown
3. Save changes

### Forecast Not Showing

**Solutions**:
1. Enable "Show Forecast" in settings
2. Increase widget height (forecast needs vertical space)
3. Check that forecast days > 0

## API Information

The Weather Widget uses a public weather API:
- **Rate Limits**: Typically 60 calls/hour on free tier
- **Data Source**: Aggregated from multiple weather services
- **Update Frequency**: Data updates every 10-15 minutes
- **Coverage**: Global coverage for most locations

### API Limits

To avoid hitting rate limits:
- Set refresh interval to 30+ minutes
- Limit number of weather widgets
- Avoid refreshing page too frequently

## Privacy

- **Location Data**: Only sent to weather API, not stored
- **Auto-detect**: Uses browser geolocation (requires permission)
- **No Tracking**: No personal data collected or shared

## Related Widgets

- **Date & Time**: Complements weather with time/date info
- **Calendar**: Plan events based on weather forecast

## Examples

### Home Dashboard
- Location: Your home city
- Units: Local preference
- Forecast: 5 days
- Refresh: 30 minutes

### Travel Planning
- Multiple widgets for destination and home
- 7-day forecast enabled
- Celsius for international travel

### Outdoor Activities
- Detailed current conditions
- Hourly forecast (if available)
- Wind speed prominent for sailing/flying

## Version History

- **v1.3.0**: Added forecast support
- **v1.2.0**: Auto-location detection
- **v1.1.0**: Multiple unit support
- **v1.0.0**: Initial release
