# RidChat AI - Deployment Guide

This guide covers deploying RidChat AI to various platforms. The app is a full-stack React/Express application with optional PostgreSQL database support.

## Platform-Specific Deployment

### 🚀 Netlify (Recommended)
**Best for**: Static sites with serverless functions
**Cost**: Free tier available

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
3. Add environment variables in Netlify dashboard
4. Deploy automatically on every push

**Pros**: Easy setup, generous free tier, built-in CDN
**Cons**: Cold start delays for functions

### ⚡ Vercel
**Best for**: Full-stack applications with edge functions
**Cost**: Free tier available

1. Connect your GitHub repository to Vercel
2. Configure project settings:
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. Add environment variables in Vercel dashboard
4. Deploy with automatic preview deployments

**Pros**: Excellent performance, preview deployments, edge functions
**Cons**: Limited function execution time on free tier

### 🚂 Railway
**Best for**: Full-stack apps with persistent storage
**Cost**: Usage-based pricing

1. Connect your GitHub repository to Railway
2. Railway auto-detects Node.js and configures build
3. Add environment variables:
   - `PORT=5000`
   - `NODE_ENV=production`
4. Optional: Add PostgreSQL database service
5. Deploy with automatic deploys on push

**Pros**: Simple setup, built-in database options, generous free tier
**Cons**: Newer platform, smaller community

### 🎨 Render
**Best for**: Full-stack applications with databases
**Cost**: Free tier available (with limitations)

1. Connect your GitHub repository to Render
2. Create a new Web Service:
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
3. Add environment variables in Render dashboard
4. Optional: Add PostgreSQL database service

**Pros**: Free tier includes databases, easy setup
**Cons**: Free tier has limitations (spin down after inactivity)

### 🔥 Heroku
**Best for**: Quick prototypes and MVPs
**Cost**: No free tier (paid plans start at $5/month)

1. Create a new Heroku app
2. Connect your GitHub repository
3. Add Node.js buildpack
4. Configure environment variables
5. Deploy via Git push or GitHub integration

**Pros**: Mature platform, extensive add-ons
**Cons**: No free tier, can be expensive

### 🖥️ Self-hosted VPS (DigitalOcean, Linode, AWS EC2)
**Best for**: Full control, custom configurations
**Cost**: $5-20/month depending on specs

1. Create a VPS with Ubuntu 20.04+
2. Install Node.js 18+ and npm
3. Clone your repository
4. Install dependencies: `npm install`
5. Build the app: `npm run build`
6. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start npm --name "ridchat-ai" -- start
   pm2 startup
   pm2 save
   ```
7. Configure nginx as reverse proxy
8. Setup SSL with Let's Encrypt

**Pros**: Full control, cost-effective for high traffic
**Cons**: Requires server management knowledge

### 🎛️ aaPanel (宝塔面板)
**Best for**: Chinese users, VPS with GUI management
**Cost**: Free (aaPanel is free, VPS costs apply)

1. Install aaPanel on your VPS
2. Install Node.js 18+ and PM2 through aaPanel interface
3. Upload or clone your project to `/www/wwwroot/ridchat-ai`
4. Configure PM2 process management
5. Set up Nginx reverse proxy through aaPanel
6. Enable SSL with Let's Encrypt

See `aapanel-setup.md` for detailed step-by-step instructions.

**Pros**: GUI management, easy SSL setup, popular in China
**Cons**: Requires VPS management, mainly Chinese documentation

## Environment Variables

All platforms require these environment variables:

```bash
# Optional - Database URL (uses in-memory storage if not set)
DATABASE_URL=your_postgresql_url

# Environment
NODE_ENV=production

# Port (usually auto-detected by hosting platforms)
PORT=5000
```

## Database Options

### In-Memory Storage (Default)
- No setup required
- Data resets on every deployment
- Good for testing and demos

### PostgreSQL (Recommended for Production)
- Persistent data storage
- Better for production use
- Available on most hosting platforms

Popular PostgreSQL providers:
- **Neon**: Serverless PostgreSQL (free tier)
- **Supabase**: Open-source Firebase alternative
- **PlanetScale**: MySQL-compatible serverless database
- **Railway**: Built-in PostgreSQL service

## Performance Optimization

### Client-Side
- Vite build with tree-shaking
- Code splitting for better loading
- Tailwind CSS purging

### Server-Side
- Express.js with minimal middleware
- In-memory caching for API responses
- Efficient database queries

## Security Best Practices

1. **Environment Variables**: Store sensitive data in environment variables
2. **API Keys**: Manage through admin panel, not in code
3. **CORS**: Configured for production domains
4. **Rate Limiting**: Consider adding for production
5. **HTTPS**: Always use HTTPS in production

## Monitoring

Consider adding these monitoring tools:
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **New Relic**: Application monitoring
- **Uptime Robot**: Uptime monitoring

## Support

For deployment issues:
1. Check the logs in your hosting platform
2. Verify all environment variables are set
3. Test locally with `npm run build && npm start`
4. Check the GitHub repository for updates

## Migration Between Platforms

To migrate from one platform to another:
1. Export your database (if using PostgreSQL)
2. Set up the new platform with same environment variables
3. Import your database
4. Update DNS records if using custom domain
5. Test thoroughly before switching traffic