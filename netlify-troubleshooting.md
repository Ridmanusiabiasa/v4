# Netlify Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. Blank Page with Title Only

**Problem**: You see the page title "RidChat AI" but the page content is blank.

**Cause**: Wrong publish directory configuration.

**Solution**:
1. Go to your Netlify dashboard
2. Navigate to **Site Settings** → **Build & deploy** → **Build settings**
3. Ensure **Publish directory** is set to: `dist/public` (not just `dist`)
4. Redeploy your site

### 2. 404 Error on Page Refresh

**Problem**: Direct URLs (like `/admin`) show 404 error when accessed directly.

**Solution**: The `netlify.toml` file includes redirect rules to fix this. Ensure the file is in your repository root.

### 3. API Calls Failing / Admin Login Issues

**Problem**: Chat functionality not working, API errors in console, or admin login showing "Invalid credentials".

**Troubleshooting**:
1. Check the Functions tab in Netlify dashboard
2. Look for build errors in the deploy log
3. Verify environment variables are set
4. Check function logs for errors
5. For admin login issues:
   - Open browser developer tools (F12)
   - Check Console tab for error messages
   - Verify you're using correct credentials: username: `admin`, password: `082254730892`
   - Check Network tab to see if login request is reaching the server

### 4. Build Failures

**Common build errors and solutions**:

#### Node.js Version Issues
```
Error: The engine "node" is incompatible with this module
```
**Solution**: Ensure `NODE_VERSION = "20"` is set in `netlify.toml`

#### Dependency Issues
```
Error: Cannot resolve dependency
```
**Solution**: 
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` locally
3. Commit the updated `package-lock.json`

#### Build Command Issues
```
Error: Command failed with exit code 1
```
**Solution**: Check that build command is `npm run build` (not `npm build`)

### 5. Environment Variables

**Setting up environment variables in Netlify**:
1. Go to **Site Settings** → **Environment variables**
2. Add your variables:
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = your database URL (if using)
   - `ADMIN_USERNAME` = `admin` (optional, defaults to "admin")
   - `ADMIN_PASSWORD` = `082254730892` (optional, defaults to "082254730892")

### 6. Function Cold Starts

**Problem**: First API call after inactivity is slow.

**Solution**: This is normal behavior for serverless functions. Consider upgrading to a paid plan for faster cold starts.

### 7. Large Bundle Size

**Problem**: Build warnings about large bundle size.

**Solution**: The app is optimized with code splitting. Large bundle warnings can usually be ignored for this application.

## Deployment Checklist

Before deploying to Netlify:

- [ ] Repository is connected to Netlify
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist/public`
- [ ] Node version: 20 (set in netlify.toml)
- [ ] Environment variables configured (if needed)
- [ ] netlify.toml file is in repository root

## Manual Deployment Steps

If automatic deployment fails:

1. **Build locally**:
   ```bash
   npm install
   npm run build
   ```

2. **Check build output**:
   - Ensure `dist/public` directory contains `index.html`
   - Verify assets are in `dist/public/assets`

3. **Deploy manually**:
   - Drag and drop the `dist/public` folder to Netlify
   - Or use Netlify CLI: `netlify deploy --prod --dir=dist/public`

## Testing Your Deployment

After deployment:

1. **Test main page**: Visit your Netlify URL
2. **Test admin panel**: Visit `your-site.netlify.app/#admin`
3. **Test API**: Try sending a chat message (requires API key setup)
4. **Test routing**: Refresh the page on different routes

## Getting Help

If issues persist:

1. **Check Netlify docs**: https://docs.netlify.com/
2. **Review deploy logs**: Netlify dashboard → Deploys → [specific deploy] → Deploy log
3. **Check function logs**: Netlify dashboard → Functions → [function name] → Logs
4. **Test locally**: Ensure the app works with `npm run build && npm start`

## Performance Tips

- **Custom domain**: Add your own domain for better performance
- **CDN**: Netlify automatically provides CDN
- **Caching**: Static assets are cached automatically
- **Compression**: Enable Brotli compression in Netlify settings