# Docker Deployment Guide

## Supported Platforms

QuantomOS Docker images are built for the following platforms:
- **linux/amd64** - Intel/AMD 64-bit systems
- **linux/arm64** - ARM 64-bit systems (Raspberry Pi 3/4/5 with 64-bit OS)

## Quick Start

### For Intel/AMD Systems

```bash
docker compose up -d
```

### For Raspberry Pi

**Option 1: Use the Raspberry Pi specific compose file**
```bash
docker compose -f docker-compose.rpi.yml up -d
```

**Option 2: Modify the standard docker-compose.yml**

Edit `docker-compose.yml` and uncomment this line:
```yaml
platform: linux/arm64
```

## Troubleshooting

### Error: "no matching manifest for linux/arm/v8"

This error occurs on Raspberry Pi when Docker incorrectly identifies the platform.

**Solution:** Use one of the Raspberry Pi options above to explicitly set the platform to `linux/arm64`.

**Why this happens:**
- ARM 64-bit CPUs are technically "ARMv8" architecture
- Docker uses the platform name `linux/arm64` (not `linux/arm/v8`)
- Some Docker versions on Raspberry Pi may incorrectly request `linux/arm/v8`
- Setting `platform: linux/arm64` explicitly fixes this issue

### Error: "manifest unknown"

The image hasn't been pulled yet. Pull it manually:
```bash
docker pull ghcr.io/quantomdevs/quantomos:latest
```

### Verifying Your Platform

Check what platform Docker detects:
```bash
docker info | grep -i arch
```

For Raspberry Pi, you should see: `Architecture: aarch64` or `Architecture: arm64`

## Updates

To update to the latest version:
```bash
docker compose pull
docker compose up -d
```

Or with Watchtower (automatic updates):
```bash
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  --interval 3600 \
  --cleanup
```
