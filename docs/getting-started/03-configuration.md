# Configuration Guide

This guide covers all configuration options for QuantomOS, including environment variables, configuration files, and common setup scenarios.

## Table of Contents

- [Environment Variables](#environment-variables)
- [Configuration Files](#configuration-files)
- [Common Configuration Scenarios](#common-configuration-scenarios)
- [Security Configuration](#security-configuration)
- [Reverse Proxy Setup](#reverse-proxy-setup)
- [Troubleshooting](#troubleshooting)

---

## Environment Variables

QuantomOS uses environment variables for sensitive and environment-specific configuration.

### Required Variables

Create a `.env` file in the root directory (manual installation) or set environment variables in docker-compose.yml (Docker installation):

```bash
# Required: Secret key for JWT and encryption
SECRET=your_secret_key_here

# Optional: Server port (defaults to 2525 in development, 2022 in production)
PORT=2022

# Optional: Node environment
NODE_ENV=production
```

### Generating a Secure Secret

The `SECRET` variable is used for:
- JWT token signing
- AES-256-CBC encryption for sensitive data
- Session management

Generate a secure random secret:

```bash
# Using OpenSSL (recommended)
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Important**:
- Keep your SECRET secure and never commit it to version control
- Use a different SECRET for each environment (development, staging, production)
- Changing the SECRET will invalidate existing sessions and encrypted data

### Docker Environment Variables

In your `docker-compose.yml`:

```yaml
services:
  quantomos:
    environment:
      - SECRET=your_secret_key_here
      - PORT=2022
      - NODE_ENV=production
```

### Manual Installation .env File

Create `.env` in the project root:

```bash
SECRET=your_secret_key_here
PORT=2022
NODE_ENV=production
```

---

## Configuration Files

QuantomOS stores its configuration in JSON files located in the config directory.

### Configuration Location

- **Docker**: `/config` (mapped to host volume)
- **Manual**: `./config` (in project root)

### Main Configuration File

`config/config.json` stores:
- Dashboard layout
- Widget configurations
- User preferences
- Custom settings
- Uploaded media references

Example structure:
```json
{
  "title": "My Dashboard",
  "searchEnabled": true,
  "searchProvider": "google",
  "internetIndicator": true,
  "publicAccess": false,
  "background": {
    "type": "image",
    "value": "wallpaper-1.jpg",
    "blur": 5
  },
  "theme": {
    "primaryColor": "#1976d2",
    "accentColor": "#ff9800"
  },
  "pages": [
    {
      "id": "page-1",
      "name": "Home",
      "widgets": []
    }
  ]
}
```

### User Configuration

User credentials and settings are stored securely:
- Passwords: Hashed with bcrypt
- Sensitive data: Encrypted with AES-256-CBC
- Profile pictures: Stored in `uploads/profile/`

### Uploads Directory

User-uploaded files are stored in:
- **Docker**: `/app/public/uploads` (mapped to host volume)
- **Manual**: `./public/uploads`

Directory structure:
```
uploads/
├── wallpapers/        # Background images
├── icons/             # Custom app icons
└── profile/           # User profile pictures
```

---

## Common Configuration Scenarios

### Changing the Default Port

**Docker**:

Edit `docker-compose.yml`:
```yaml
ports:
  - 3000:2022  # Host port 3000 -> Container port 2022
```

**Manual**:

Edit `.env`:
```bash
PORT=3000
```

Or start with port override:
```bash
PORT=3000 npm start
```

### Setting Up HTTPS/SSL

QuantomOS doesn't handle SSL directly. Use a reverse proxy (recommended):

1. **Use Nginx or Apache** as reverse proxy
2. **Configure SSL certificates** (Let's Encrypt recommended)
3. **Proxy requests** to QuantomOS on port 2022

See [Reverse Proxy Setup](#reverse-proxy-setup) below for detailed instructions.

### Custom Dashboard Title

Change the dashboard title in the UI:
1. Open Settings
2. Navigate to General
3. Change "Custom Title"
4. Changes save automatically

Or edit `config/config.json`:
```json
{
  "title": "My Homelab Dashboard"
}
```

### Enabling Public Access

Public access allows viewing the dashboard without authentication (read-only):

**In Settings**:
1. Open Settings
2. Navigate to General
3. Toggle "Public Access"

**In config file**:
```json
{
  "publicAccess": true
}
```

When enabled:
- Dashboard is viewable without login
- All widgets display (read-only mode)
- Editing requires authentication
- Settings and admin features require authentication

### Background Configuration

**Upload background via UI**:
1. Settings → Background & Icons
2. Upload image
3. Select active background
4. Adjust blur level

**Or use background color**:
1. Settings → Background & Icons
2. Toggle to "Background Color"
3. Choose color with picker

---

## Security Configuration

### Authentication

QuantomOS uses JWT-based authentication:
- Tokens expire after 24 hours
- Secure httpOnly cookies
- CSRF protection enabled
- Rate limiting on auth endpoints

### Password Requirements

Default password requirements:
- Minimum 6 characters
- Can be changed during first-time setup

**Best practices**:
- Use strong, unique passwords
- Enable public access only if needed
- Keep SECRET environment variable secure

### Data Encryption

Sensitive data is encrypted using AES-256-CBC:
- API keys
- Service credentials
- Authentication tokens

Encryption key is derived from the SECRET environment variable.

### Rate Limiting

Rate limiting is automatically applied:
- Login attempts: 5 per 15 minutes
- API requests: 100 per 15 minutes
- Upload endpoints: 10 per hour

---

## Reverse Proxy Setup

Using a reverse proxy provides:
- SSL/TLS encryption
- Custom domain names
- Load balancing
- Additional security

### Nginx Configuration

Create `/etc/nginx/sites-available/quantomos`:

```nginx
server {
    listen 80;
    server_name dashboard.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dashboard.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Proxy settings
    location / {
        proxy_pass http://localhost:2022;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Increase max upload size
    client_max_body_size 50M;
}
```

Enable the configuration:
```bash
sudo ln -s /etc/nginx/sites-available/quantomos /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Apache Configuration

Create `/etc/apache2/sites-available/quantomos.conf`:

```apache
<VirtualHost *:80>
    ServerName dashboard.yourdomain.com
    Redirect permanent / https://dashboard.yourdomain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName dashboard.yourdomain.com

    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/yourdomain.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/yourdomain.com/privkey.pem

    # Proxy settings
    ProxyPreserveHost On
    ProxyRequests Off
    ProxyPass / http://localhost:2022/
    ProxyPassReverse / http://localhost:2022/

    # WebSocket support
    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/?(.*) "ws://localhost:2022/$1" [P,L]
</VirtualHost>
```

Enable required modules and site:
```bash
sudo a2enmod ssl proxy proxy_http rewrite
sudo a2ensite quantomos
sudo systemctl reload apache2
```

### Caddy Configuration

Create `Caddyfile`:

```caddy
dashboard.yourdomain.com {
    reverse_proxy localhost:2022
    encode gzip
}
```

Start Caddy:
```bash
caddy run
```

Caddy automatically handles SSL certificates via Let's Encrypt.

### SSL Certificates with Let's Encrypt

Install Certbot:
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

Obtain certificate:
```bash
sudo certbot --nginx -d dashboard.yourdomain.com
```

Auto-renewal is configured automatically. Test renewal:
```bash
sudo certbot renew --dry-run
```

---

## Troubleshooting

### Configuration Not Saving

- **Check file permissions**: Config directory must be writable
- **Docker volume**: Ensure config volume is properly mounted
- **Disk space**: Verify sufficient disk space

### Authentication Issues

- **Check SECRET**: Ensure SECRET environment variable is set
- **Clear cookies**: Delete browser cookies and try again
- **Token expiration**: Tokens expire after 24 hours

### Uploads Failing

- **Check upload directory**: Must be writable
- **File size limits**: Default max 50MB (configurable in reverse proxy)
- **Disk space**: Verify sufficient space

### Performance Issues

- **Resource limits**: Increase container memory/CPU limits
- **Database size**: Large configs may slow down load times
- **Network latency**: Check network connection to external services

### Port Conflicts

If port 2022 is already in use:
```bash
# Find process using the port
sudo lsof -i :2022

# Kill the process or change QuantomOS port
```

---

## Configuration Best Practices

1. **Keep SECRET secure**: Never commit to git or share publicly
2. **Regular backups**: Backup config directory regularly
3. **Use reverse proxy**: For SSL and additional security
4. **Monitor logs**: Check logs for errors and issues
5. **Update regularly**: Keep QuantomOS updated to latest version
6. **Limit public access**: Enable only if necessary
7. **Strong passwords**: Use strong, unique passwords
8. **Test changes**: Test configuration changes in development first

---

## Next Steps

Now that QuantomOS is configured:
- [Learn the dashboard basics](../user-guide/01-dashboard-basics.md)
- [Add and configure widgets](../user-guide/02-widgets/)
- [Customize your dashboard](../user-guide/03-settings.md)
