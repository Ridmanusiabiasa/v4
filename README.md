# RidChat AI - AI Chat Interface

A modern, ChatGPT-style AI chat application with admin panel for API key management and token usage monitoring.

## Features

- 🤖 ChatGPT-style interface with unlimited text length
- 🎨 Modern dark theme with proper code syntax highlighting
- 🔧 Admin panel for API key and token usage management
- 📱 Responsive design that works on all devices
- 🚀 Ready for Netlify deployment
- ⚡ Real-time chat with auto-scroll
- 📊 Token usage analytics and monitoring

## Quick Start

### Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open http://localhost:5000

### Deployment Options

#### 1. Netlify (Recommended)
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist/public`
4. Deploy!

**Note**: If you see a blank page, make sure the publish directory is set to `dist/public` (not just `dist`).

#### 2. Vercel
1. Connect your repository to Vercel
2. Framework preset: Other
3. Build command: `npm run build`
4. Output directory: `dist`
5. Install command: `npm install`

#### 3. Railway
1. Connect your repository to Railway
2. Add environment variable: `PORT=5000`
3. Railway will auto-detect and deploy

#### 4. Render
1. Connect your repository to Render
2. Environment: Node
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Add environment variables as needed

#### 5. Heroku
1. Create a Heroku app
2. Add Node.js buildpack
3. Set environment variables
4. Deploy via Git push

#### 6. Self-hosted VPS
1. Clone repository to your server
2. Install Node.js 18+
3. Run: `npm install && npm run build`
4. Start with: `npm start`
5. Use PM2 for process management

#### 7. aaPanel (宝塔面板)
1. Install aaPanel on your VPS
2. Install Node.js 18+ and PM2 through aaPanel
3. Upload/clone your project to `/www/wwwroot/ridchat-ai`
4. Configure PM2 with provided `ecosystem.config.js`
5. Set up Nginx reverse proxy
6. Enable SSL with Let's Encrypt

See `aapanel-setup.md` for detailed instructions.

All platforms support the same environment variables and configuration.

## Environment Variables

Create a `.env` file based on `.env.example`:

- `DATABASE_URL`: Your Neon Database connection string (optional - uses in-memory storage by default)
- `NODE_ENV`: Set to `production` for production builds

## Admin Panel

Access the admin panel by adding `#admin` to your URL (e.g., `https://yoursite.netlify.app/#admin`)

Default admin credentials:
- Username: `admin`
- Password: `admin`

**⚠️ Important: Change these credentials in production!**

## API Key Setup

1. Go to the admin panel
2. Add your AI API key (get one from ai.sumopod.com)
3. Start chatting!

## Features

- **Unlimited Chat Length**: No character limits on input or output
- **Code Highlighting**: Automatic syntax highlighting for code blocks
- **Copy to Clipboard**: Easy code copying functionality
- **Auto Scroll**: Messages automatically scroll to latest
- **Model Selection**: Choose between different AI models
- **Token Tracking**: Monitor API usage and costs
- **Responsive Design**: Works perfectly on mobile and desktop

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL (Neon) with in-memory fallback
- **Deployment**: Netlify with serverless functions
- **Styling**: Dark theme with custom chat variables

## License

MIT License - feel free to use this project for personal or commercial purposes.