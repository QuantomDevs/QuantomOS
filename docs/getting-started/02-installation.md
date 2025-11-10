# Installation Guide

This guide covers multiple installation methods for QuantomOS. Choose the method that best suits your environment.

## Table of Contents

- [Docker Installation (Recommended)](#docker-installation-recommended)
- [Docker Compose with Portainer](#docker-compose-with-portainer)
- [Manual Installation from Source](#manual-installation-from-source)
- [PM2 Production Deployment](#pm2-production-deployment)
- [First-Time Setup](#first-time-setup)

---

## Docker Installation (Recommended)

The easiest and most reliable way to run QuantomOS is using Docker.

### Using Docker Compose

1. **Create a directory for QuantomOS**:
   ```bash
   mkdir ~/quantomos
   cd ~/quantomos
   ```

2. **Create a `docker-compose.yml` file**:
   ```yaml
   ---
   services:
     quantomos:
       container_name: quantomos
       image: ghcr.io/snenjih/quantomos:latest
       privileged: true
       # Uncomment for network monitoring stats
       # network_mode: host
       ports:
         - 2022:2022
       environment:
         - SECRET=YOUR_SECRET_KEY_HERE
       volumes:
         - /sys:/sys:ro
         - ./config:/config
         - ./uploads:/app/public/uploads
         - /var/run/docker.sock:/var/run/docker.sock
       restart: unless-stopped
       labels:
         - "com.centurylinklabs.watchtower.enable=true"
   ```

3. **Generate a secure secret key**:
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and replace `YOUR_SECRET_KEY_HERE` in the docker-compose.yml file.

4. **Start the container**:
   ```bash
   docker compose up -d
   ```

5. **Verify the container is running**:
   ```bash
   docker compose ps
   docker compose logs -f quantomos
   ```

6. **Access QuantomOS**:
   - Local machine: `http://localhost:2022`
   - Network devices: `http://192.168.x.x:2022`

### Using Docker CLI

If you prefer not to use Docker Compose:

```bash
docker run -d \
  --name quantomos \
  --privileged \
  -p 2022:2022 \
  -e SECRET=YOUR_SECRET_KEY_HERE \
  -v /sys:/sys:ro \
  -v ~/quantomos/config:/config \
  -v ~/quantomos/uploads:/app/public/uploads \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --restart unless-stopped \
  ghcr.io/snenjih/quantomos:latest
```

### Volume Explanations

- `/sys:/sys:ro` - Read-only access to system information (for monitoring widgets)
- `./config:/config` - Persistent configuration storage
- `./uploads:/app/public/uploads` - User-uploaded files (backgrounds, icons)
- `/var/run/docker.sock:/var/run/docker.sock` - Docker socket for container monitoring

---

## Docker Compose with Portainer

If you're using Portainer for container management:

1. **Navigate to Stacks** in Portainer
2. **Click "Add Stack"**
3. **Name your stack**: `quantomos`
4. **Paste the docker-compose.yml** content from above
5. **Replace the SECRET** environment variable with a secure key
6. **Click "Deploy the stack"**

### Updating via Portainer

1. Navigate to **Stacks**
2. Click on the **quantomos** stack
3. Click the **Editor** tab
4. Click **"Update the stack"**
5. Enable **"Re-pull image and redeploy"**
6. Click **"Update"**

---

## Manual Installation from Source

For development or when Docker is not available:

### 1. Clone the Repository

```bash
git clone https://github.com/QuantomDevs/quantomos.git
cd quantomos
```

### 2. Install Dependencies

```bash
npm install
```

This will automatically install dependencies for both backend and frontend.

### 3. Create Environment File

Create a `.env` file in the root directory:

```bash
SECRET=your_secret_key_here
PORT=2525
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

### 4. Build the Application

```bash
npm run build
```

This builds both backend and frontend:
- Backend: `dist/backend/`
- Frontend: `dist/frontend/`

### 5. Start the Application

**Development mode** (with hot reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The application will be available at:
- Frontend: `http://localhost:5173` (development)
- Backend API: `http://localhost:2525`
- Production: `http://localhost:2022`

---

## PM2 Production Deployment

PM2 is recommended for production deployments when not using Docker.

### 1. Install PM2 Globally

```bash
npm install -g pm2
```

### 2. Create PM2 Ecosystem File

Create `ecosystem.config.js` in the project root:

```javascript
module.exports = {
  apps: [{
    name: 'quantomos',
    script: './dist/backend/index.js',
    instances: 1,
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 2022,
      SECRET: 'your_secret_key_here'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### 3. Start with PM2

```bash
# Build the application
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

### 4. PM2 Management Commands

```bash
# View status
pm2 status

# View logs
pm2 logs quantomos

# Restart
pm2 restart quantomos

# Stop
pm2 stop quantomos

# Monitor
pm2 monit
```

### 5. Auto-Restart on File Changes

For development with auto-restart:

```bash
pm2 start ecosystem.config.js --watch
```

---

## First-Time Setup

After installation, access QuantomOS in your browser:

1. **Navigate to QuantomOS**:
   - Docker: `http://localhost:2022`
   - Manual: `http://localhost:5173` (dev) or `http://localhost:2022` (prod)

2. **Initial Setup Wizard**:
   - You'll be greeted with a setup page
   - Create your admin account:
     - Choose a secure password
     - Optionally set a custom username
     - Upload a profile picture (optional)

3. **Configure Your Dashboard**:
   - Add your first widgets
   - Customize the appearance
   - Set up backgrounds and themes

4. **Configure Services** (optional):
   - Add API credentials for integrated services (Plex, qBittorrent, etc.)
   - Configure system monitoring settings
   - Set up custom extensions

## Updating QuantomOS

### Docker Update

```bash
# Pull the latest image
docker compose pull

# Restart the container
docker compose up -d
```

### Manual Update

```bash
# Pull latest changes
git pull origin main

# Install updated dependencies
npm install

# Rebuild
npm run build

# Restart (PM2)
pm2 restart quantomos

# Or restart (direct)
npm start
```

## Troubleshooting

### Container Won't Start

Check logs:
```bash
docker compose logs -f quantomos
```

Common issues:
- Port already in use: Change port in docker-compose.yml
- Missing SECRET: Ensure environment variable is set
- Volume permissions: Check folder permissions

### Build Errors

```bash
# Clean and reinstall
npm run clean
npm install
npm run build
```

### Cannot Access Application

- Verify container is running: `docker ps`
- Check firewall settings
- Ensure port is not blocked
- Try accessing via IP: `http://192.168.x.x:2022`

## Next Steps

Once QuantomOS is installed and running:
- [Configure your environment](./03-configuration.md)
- [Learn the dashboard basics](../user-guide/01-dashboard-basics.md)
- [Customize your settings](../user-guide/03-settings.md)
