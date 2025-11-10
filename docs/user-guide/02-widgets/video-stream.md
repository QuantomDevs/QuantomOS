# Video Stream Widget

Display live video streams, security cameras, and video files.

## Overview

The Video Stream Widget embeds video content directly in your dashboard. Perfect for security cameras, live streams, webcams, and video file playback.

## Use Cases

- Security camera monitoring
- Webcam surveillance
- Live stream viewing
- CCTV feeds
- Video file playback
- Baby monitor display
- Pet camera viewing

## Configuration Options

| Setting | Description | Default | Required |
|---------|-------------|---------|----------|
| **Feed URL** | Video source URL | None | Yes |
| **Autoplay** | Start playing automatically | Yes | No |
| **Muted** | Mute audio by default | Yes | No |
| **Show Controls** | Display video controls | No | No |
| **Loop** | Repeat video continuously | No | No |

## Supported Formats

### Video Files

- **MP4**: H.264 codec (widely supported)
- **WebM**: VP8/VP9 codec
- **Ogg**: Theora codec
- **MOV**: QuickTime format (limited support)

### Streaming Protocols

- **HTTP/HTTPS**: Direct video file URLs
- **HLS (M3U8)**: HTTP Live Streaming
- **MJPEG**: Motion JPEG streams (common for IP cameras)
- **RTSP**: Real Time Streaming Protocol (via conversion)

## Setup Instructions

### 1. Find Video URL

**IP Camera**:
- Check camera documentation for stream URL
- Common formats:
  - `http://camera-ip/mjpeg`
  - `http://camera-ip/video.cgi`
  - `rtsp://camera-ip:554/stream`

**Video File**:
- Host file on web server or NAS
- Get direct URL: `http://server/videos/file.mp4`

**Stream Service**:
- HLS stream: `https://server/stream.m3u8`
- DASH stream: `https://server/stream.mpd`

### 2. Configure Widget

1. Add "Video Stream" widget
2. Enter Feed URL
3. Configure playback options:
   - **Autoplay**: Enable for automatic playback
   - **Muted**: Required for autoplay to work
   - **Controls**: Enable for manual control
   - **Loop**: Enable for continuous playback
4. Position and size widget

## Autoplay Restrictions

### Browser Limitations

Browsers restrict autoplay to prevent unwanted audio:
- **Autoplay + Unmuted**: Usually blocked
- **Autoplay + Muted**: Allowed
- **User Interaction Required**: For unmuted autoplay

**Recommendation**: Enable both autoplay and muted for auto-start

### Workaround

To have sound with autoplay:
1. Load page once with user interaction (click anywhere)
2. Browser may allow unmuted autoplay afterward
3. Or manually unmute after autoplay starts

## Camera-Specific Setup

### Generic IP Camera

```
URL: http://192.168.1.100/mjpeg
Autoplay: Yes
Muted: Yes
Controls: No
```

### Wyze Cam (RTSP Firmware)

```
URL: rtsp://camera-ip:554/live
Note: Requires RTSP-to-HLS converter
```

### Ring Camera

```
Note: Ring doesn't provide direct stream URL
Alternative: Use Ring app in iframe
```

### Reolink Camera

```
URL: rtsp://admin:password@camera-ip:554/h264Preview_01_main
Note: Requires RTSP-to-HLS conversion
```

### Hikvision

```
URL: rtsp://user:pass@camera-ip:554/Streaming/Channels/101
Note: Convert to HLS for browser compatibility
```

### Amcrest

```
URL: http://admin:pass@camera-ip/cgi-bin/mjpg/video.cgi
Autoplay: Yes
Controls: No
```

## RTSP Stream Conversion

Most browsers don't support RTSP directly. Convert to HLS:

### Using FFmpeg

```bash
ffmpeg -i rtsp://camera-ip:554/stream \
  -c:v copy \
  -c:a aac \
  -f hls \
  -hls_time 2 \
  -hls_list_size 4 \
  /path/to/stream.m3u8
```

### Using frigate, go2rtc, or RTSPtoWeb

These tools convert RTSP to web-compatible formats:
1. Install conversion tool
2. Configure camera stream
3. Get HLS/WebRTC URL
4. Use in Video Stream widget

## Configuration Examples

### Security Camera Feed

```
Feed URL: http://192.168.1.100/mjpeg
Autoplay: Yes
Muted: Yes
Show Controls: No
Loop: N/A
Size: 4x3
```

### Video File

```
Feed URL: http://nas.local/videos/demo.mp4
Autoplay: No
Muted: No
Show Controls: Yes
Loop: No
Size: 6x4
```

### Live Stream

```
Feed URL: https://stream.example.com/live.m3u8
Autoplay: Yes
Muted: Yes
Show Controls: Yes
Loop: N/A
Size: 8x5
```

## Widget Sizing

### Aspect Ratios

Common camera ratios:
- **16:9** (HD): 4x2.25, 6x3.375, 8x4.5
- **4:3** (Standard): 4x3, 6x4.5, 8x6
- **1:1** (Square): 3x3, 4x4

Adjust widget size to match source aspect ratio for best appearance.

### Minimum Size

- **Minimum**: 3x2 grid cells
- **Recommended**: 4x3 or larger
- **Multi-camera**: Use smaller sizes (3x2) in grid

## Multi-Camera Setup

Display multiple cameras:

1. Add separate Video Stream widget for each camera
2. Arrange in grid (e.g., 2x2 grid for 4 cameras)
3. Configure each:
   - Autoplay: Yes
   - Muted: Yes
   - Controls: No
   - Size: 3x2 or 4x3 each

### Grid Layout Example

```
┌─────────┬─────────┐
│ Camera 1│ Camera 2│
├─────────┼─────────┤
│ Camera 3│ Camera 4│
└─────────┴─────────┘
```

## Troubleshooting

### Video Not Playing

**Causes & Solutions**:
1. **Incorrect URL**: Verify URL in browser first
2. **Unsupported Format**: Convert to MP4 or HLS
3. **Network Issue**: Check camera/server accessibility
4. **CORS Error**: Configure CORS headers on video server
5. **Browser Compatibility**: Try different browser

### Black Screen

**Solutions**:
- Check camera is online and accessible
- Verify URL format is correct
- Test URL in VLC or browser
- Check camera credentials if required
- Ensure camera stream is active

### Autoplay Not Working

**Solutions**:
- Enable "Muted" option (required for autoplay)
- Check browser autoplay policy
- Interact with page first (click anywhere)
- Verify browser allows autoplay

### Stream Keeps Buffering

**Causes**:
- Network bandwidth insufficient
- Camera stream bitrate too high
- Server overloaded

**Solutions**:
- Reduce camera stream quality
- Use lower resolution stream
- Check network bandwidth
- Increase buffer size (if configurable)

### RTSP Stream Won't Display

**Solution**: Browsers don't support RTSP natively
1. Install RTSP-to-HLS converter
2. Convert stream to HLS or WebRTC
3. Use converted stream URL in widget

### No Audio

**Solutions**:
- Unmute widget controls
- Check camera has audio capabilities
- Verify audio codec is supported
- Browser may require user interaction for audio

## Performance Considerations

### Multiple Streams

- Each stream consumes bandwidth
- Limit active streams based on network capacity
- Use lower resolution for multi-camera setups
- Consider using snapshots instead of live feed

### Resource Usage

- Video decoding uses CPU/GPU
- Multiple HD streams can slow dashboard
- Use hardware acceleration if available
- Balance quality vs performance

### Bandwidth

- HD stream: 1-4 Mbps
- SD stream: 0.5-1 Mbps
- MJPEG: 0.5-2 Mbps
- Multiple streams multiply bandwidth usage

## Privacy and Security

### Authentication

Many cameras require authentication:
- **URL Format**: `http://user:pass@camera-ip/stream`
- **Security**: URL contains credentials (visible in config)
- **Best Practice**: Use read-only camera account

### Network Security

- Keep cameras on isolated VLAN
- Don't expose directly to internet
- Use VPN for remote access
- Change default camera passwords

### Privacy

- Disable streams when not needed
- Be aware of what's being recorded/streamed
- Comply with local surveillance laws
- Inform household members of cameras

## Advanced Features

### Recording

- Use browser's picture-in-picture
- External recording via NVR software
- Snapshot capture via controls

### Overlays

Some streams support overlays:
- Timestamp
- Camera name
- Motion detection zones

Configure in camera settings.

## Related Widgets

- [Iframe](./iframe.md): For camera web interfaces
- [Bookmarks](./bookmarks.md): Quick links to camera apps
- [Group Widget](./group-widget.md): Organize multiple camera feeds

## Example Setups

### Home Security Dashboard

- 4 camera feeds in grid (3x2 each)
- All autoplay, muted, no controls
- Full page dedicated to cameras
- Quick monitoring view

### Baby Monitor

- Single camera feed (6x4)
- Autoplay, unmuted, controls visible
- Large size for detail
- Placement on home page

### Pet Cam

- Camera feed (4x3)
- Autoplay, muted initially
- Controls for interaction
- Paired with notes widget for feeding log
