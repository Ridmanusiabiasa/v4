# RidChat AI - aaPanel Deployment Guide

This guide covers deploying RidChat AI on a VPS using aaPanel (宝塔面板).

## Prerequisites

- VPS with Ubuntu 20.04+ or CentOS 7+
- Root access to your server
- Domain name (optional but recommended)

## Step 1: Install aaPanel

### Ubuntu/Debian
```bash
wget -O install.sh http://www.aapanel.com/script/install_6.0_en.sh && sudo bash install.sh aapanel
```

### CentOS/RHEL
```bash
yum install -y wget && wget -O install.sh http://www.aapanel.com/script/install_6.0_en.sh && sh install.sh aapanel
```

After installation, note down the aaPanel URL, username, and password.

## Step 2: Configure aaPanel

1. Login to aaPanel web interface
2. Install the required software stack:
   - **Nginx** (recommended) or Apache
   - **Node.js** (version 18+)
   - **PM2** (for process management)
   - **PostgreSQL** (optional, for database)

### Install Node.js
1. Go to **App Store** → **Runtime Environment**
2. Find **Node.js** and install version 18+
3. Install **PM2** from the same section

## Step 3: Upload and Configure Application

### Method 1: Using Git (Recommended)
1. Go to **File Manager**
2. Navigate to `/www/wwwroot/`
3. Create a new directory: `ridchat-ai`
4. Open terminal and clone your repository:
   ```bash
   cd /www/wwwroot/ridchat-ai
   git clone https://github.com/yourusername/ridchat-ai.git .
   ```

### Method 2: Upload Files
1. Zip your project files
2. Upload via **File Manager**
3. Extract in `/www/wwwroot/ridchat-ai/`

## Step 4: Install Dependencies and Build

1. Open terminal in aaPanel
2. Navigate to your project directory:
   ```bash
   cd /www/wwwroot/ridchat-ai
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the application:
   ```bash
   npm run build
   ```

## Step 5: Configure Environment Variables

1. Create `.env` file in project root:
   ```bash
   nano .env
   ```
2. Add your configuration:
   ```env
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=your_database_url_here
   ```

## Step 6: Set Up PM2 Process

1. Create PM2 configuration file `ecosystem.config.js`:
   ```javascript
   module.exports = {
     apps: [{
       name: 'ridchat-ai',
       script: 'server/index.js',
       cwd: '/www/wwwroot/ridchat-ai',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       },
       instances: 1,
       exec_mode: 'cluster',
       watch: false,
       max_memory_restart: '1G',
       error_file: 'logs/err.log',
       out_file: 'logs/out.log',
       log_file: 'logs/combined.log',
       time: true
     }]
   };
   ```

2. Start the application with PM2:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

## Step 7: Configure Nginx

1. Go to **Website** → **Add Site**
2. Fill in your domain name
3. Select **Node.js** as the site type
4. Set project path to `/www/wwwroot/ridchat-ai`
5. Set startup file to `server/index.js`
6. Set port to `3000`

### Manual Nginx Configuration (if needed)
If you need to configure Nginx manually, create a configuration file:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location /dist {
        alias /www/wwwroot/ridchat-ai/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Step 8: Set Up SSL (Optional but Recommended)

1. Go to **Website** → **SSL**
2. Select your domain
3. Choose **Let's Encrypt** for free SSL
4. Apply SSL certificate

## Step 9: Configure Database (Optional)

If using PostgreSQL:

1. Go to **Database** → **PostgreSQL**
2. Create a new database: `ridchat_ai`
3. Create a user with appropriate permissions
4. Update your `.env` file with database credentials

## Step 10: Monitoring and Maintenance

### Check Application Status
```bash
pm2 status
pm2 logs ridchat-ai
```

### Update Application
```bash
cd /www/wwwroot/ridchat-ai
git pull origin main
npm install
npm run build
pm2 restart ridchat-ai
```

### Monitor Resources
- Use aaPanel's built-in monitoring tools
- Check CPU, memory, and disk usage
- Monitor error logs regularly

## Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   - Change port in `.env` and PM2 config
   - Update Nginx configuration

2. **Permission denied**
   ```bash
   chown -R www:www /www/wwwroot/ridchat-ai
   chmod -R 755 /www/wwwroot/ridchat-ai
   ```

3. **Node.js version issues**
   - Ensure Node.js 18+ is installed
   - Use `node --version` to verify

4. **Database connection issues**
   - Check database credentials in `.env`
   - Verify database is running
   - Check firewall settings

### Log Files
- Application logs: `/www/wwwroot/ridchat-ai/logs/`
- Nginx logs: `/www/wwwlogs/`
- System logs: `/var/log/`

## Security Recommendations

1. **Firewall**: Configure firewall to only allow necessary ports
2. **Regular Updates**: Keep aaPanel and system packages updated
3. **Backup**: Set up regular backups of your application and database
4. **Monitoring**: Enable security monitoring and alerts
5. **SSL**: Always use HTTPS in production

## Performance Optimization

1. **Enable Gzip**: Configure Nginx to compress responses
2. **Static Files**: Serve static files directly through Nginx
3. **PM2 Cluster**: Use cluster mode for better performance
4. **Database**: Optimize database queries and indices

## Support

For aaPanel-specific issues:
- aaPanel Documentation: https://www.aapanel.com/reference.html
- aaPanel Forums: https://forum.aapanel.com/

For RidChat AI issues:
- Check application logs
- Verify environment variables
- Test locally first