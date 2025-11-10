# Prerequisites

Before installing QuantomOS, ensure your system meets the following requirements.

## System Requirements

### Supported Operating Systems

QuantomOS can run on any platform that supports Node.js and Docker:

- **Linux** (Ubuntu, Debian, CentOS, Fedora, Arch, etc.)
- **Windows** 10/11 or Windows Server
- **macOS** 10.15 (Catalina) or later
- **Container Platforms** (Docker, Kubernetes, Portainer)

### Hardware Requirements

**Minimum Requirements:**
- **CPU**: 1 core / 1 vCPU
- **RAM**: 512 MB
- **Disk Space**: 500 MB for application + space for uploads and backups
- **Network**: Active internet connection (for widgets that fetch external data)

**Recommended Requirements:**
- **CPU**: 2 cores / 2 vCPUs or more
- **RAM**: 1 GB or more
- **Disk Space**: 2 GB or more
- **Network**: Stable internet connection

## Software Requirements

### For Docker Installation (Recommended)

- **Docker**: Version 20.10.0 or higher
- **Docker Compose**: Version 2.0.0 or higher (optional but recommended)

Check your Docker version:
```bash
docker --version
docker compose version
```

Install Docker if not already installed:
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (Windows/macOS)
- [Docker Engine](https://docs.docker.com/engine/install/) (Linux)

### For Manual Installation (From Source)

- **Node.js**: Version 18.x or higher (LTS recommended)
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For cloning the repository

Check your versions:
```bash
node --version   # Should be v18.x or higher
npm --version    # Should be 9.x or higher
git --version
```

Install Node.js if not already installed:
- [Official Node.js Downloads](https://nodejs.org/)
- Use a version manager: [nvm](https://github.com/nvm-sh/nvm) (Linux/macOS) or [nvm-windows](https://github.com/coreybutler/nvm-windows) (Windows)

### Optional: PM2 for Production

PM2 is a production process manager for Node.js applications:

```bash
npm install -g pm2
```

PM2 provides:
- Auto-restart on crashes
- Load balancing
- Log management
- System startup scripts

## Browser Compatibility

QuantomOS is compatible with modern web browsers:

| Browser | Minimum Version | Recommended Version |
|---------|----------------|---------------------|
| **Chrome** | 90+ | Latest |
| **Firefox** | 88+ | Latest |
| **Safari** | 14+ | Latest |
| **Edge** | 90+ | Latest |
| **Opera** | 76+ | Latest |

**Note**: Internet Explorer is not supported.

### Progressive Web App (PWA) Support

QuantomOS can be installed as a PWA on:
- **Chrome**: Desktop (Windows, macOS, Linux) and Android
- **Edge**: Desktop (Windows, macOS, Linux) and Android
- **Safari**: iOS and iPadOS (via "Add to Home Screen")

## Network Requirements

### Ports

QuantomOS requires the following ports to be available:

- **Port 2022**: Default application port (configurable)
- **Port 2525**: Backend API port (development only)

Ensure these ports are not in use by other applications:
```bash
# Check if port is in use (Linux/macOS)
lsof -i :2022
lsof -i :2525

# Check if port is in use (Windows)
netstat -ano | findstr :2022
netstat -ano | findstr :2525
```

### Firewall Configuration

If using a firewall, allow incoming connections on port 2022 (or your configured port):

**Linux (ufw):**
```bash
sudo ufw allow 2022/tcp
```

**Linux (firewalld):**
```bash
sudo firewall-cmd --add-port=2022/tcp --permanent
sudo firewall-cmd --reload
```

**Windows Firewall:**
Use Windows Defender Firewall settings to allow the application.

## Optional Dependencies

### For System Monitoring Widgets

Some system monitoring features require elevated permissions:

- **Linux**: Run with `sudo` or grant specific permissions
- **Windows**: Run as Administrator (for certain metrics)
- **macOS**: Grant necessary permissions in System Preferences

### For macOS Temperature Monitoring

On macOS, temperature monitoring requires an optional dependency:
```bash
npm install --save-optional osx-temperature-sensor
```

This is automatically included when installing from source.

### For Docker Socket Access

To monitor Docker containers, QuantomOS needs access to the Docker socket:

- **Linux**: Add user to `docker` group or mount socket with appropriate permissions
- **Docker Compose**: Mount `/var/run/docker.sock`

## Next Steps

Once you've verified all prerequisites are met, proceed to:
- [Installation Guide](./02-installation.md)
