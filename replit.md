# RidChat AI - AI Chat Interface with Admin Panel

## Overview

This is a full-stack chat application built with React, Express, and TypeScript. The application provides a ChatGPT-like interface for users to interact with an AI model through a third-party API (ai.sumopod.com), while offering administrators a comprehensive control panel for managing API keys, monitoring token usage, and configuring the system. The app is branded as "RidChat AI" and features a modern, ChatGPT-inspired design with proper code block formatting and syntax highlighting.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with custom chat-specific color variables
- **State Management**: React Query for server state, local storage for client state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: Neon Database serverless driver
- **Session Management**: In-memory storage with fallback to database
- **Development**: Custom Vite integration for hot module replacement

### Key Design Decisions

1. **Monorepo Structure**: Client and server code are organized in a single repository with shared schemas and types
2. **TypeScript Throughout**: Full type safety across the entire stack
3. **Proxy Pattern**: Backend acts as a proxy to the third-party AI API to control access and track usage
4. **Component-Based UI**: Extensive use of reusable UI components from Radix UI
5. **Real-time Updates**: Polling-based updates for admin dashboard metrics

## Key Components

### Authentication
- Simple admin authentication with hardcoded credentials
- Session-based authentication using local storage for frontend state
- No user registration - admin access only for system management

### Chat System
- **Conversation Management**: Local storage-based conversation persistence
- **Message Handling**: Real-time message streaming with loading states
- **Model Selection**: Configurable AI model selection with temperature and token limits
- **Responsive Design**: Mobile-first design with collapsible sidebar

### Admin Dashboard
- **API Key Management**: Add, view, and deactivate API keys
- **Token Usage Monitoring**: Real-time tracking of token consumption by model
- **System Status**: Health monitoring and configuration overview
- **Data Export**: JSON export functionality for usage analytics

### Data Models
- **Users**: Basic user management (currently admin-only)
- **API Keys**: Management of third-party API credentials
- **Token Usage**: Detailed tracking of API consumption with metadata

## Data Flow

1. **User Chat Flow**:
   - User enters message in chat interface
   - Message is sent to Express backend via POST to `/api/chat/completions`
   - Backend retrieves active API key and forwards request to ai.sumopod.com
   - Response is returned to client and token usage is recorded
   - Conversation is updated in local storage

2. **Admin Management Flow**:
   - Admin authenticates via login modal
   - Dashboard loads current system status and usage statistics
   - Admin can add new API keys, view usage metrics, and export data
   - All admin actions are authenticated and logged

3. **Token Tracking Flow**:
   - Every successful API call triggers token usage recording
   - Usage data includes model, token count, and metadata
   - Admin dashboard aggregates this data for reporting

## External Dependencies

### Third-Party Services
- **ai.sumopod.com**: Primary AI API endpoint for chat completions
- **Neon Database**: Serverless PostgreSQL hosting
- **Replit**: Development environment integration

### Key Libraries
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/react-***: Headless UI components
- **drizzle-orm**: Type-safe database ORM
- **wouter**: Lightweight React routing
- **tailwindcss**: Utility-first CSS framework
- **zod**: Schema validation

## Deployment Strategy

### Development
- Vite dev server with HMR for frontend
- tsx for TypeScript execution in development
- Concurrent client/server development with shared types

### Production
- Vite build for frontend static assets
- esbuild for server bundle compilation
- Single process deployment with static file serving
- Database migrations via Drizzle Kit

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment detection
- API keys managed through admin interface

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### July 07, 2025 - RidChat AI Rebranding and UI Improvements
- **App Rebranding**: Changed name from "AI Chat Assistant" to "RidChat AI"
- **Title Updates**: Updated HTML title, welcome message, and admin panel to reflect new branding
- **ChatGPT-Style Interface**: 
  - Redesigned message layout with proper avatars and spacing
  - Implemented side-by-side message layout similar to ChatGPT
  - Added proper code block formatting with syntax highlighting
  - Added copy-to-clipboard functionality for code blocks
  - Updated input field to match ChatGPT's rounded design
- **Enhanced Message Rendering**:
  - Added ReactMarkdown for rich text formatting
  - Integrated react-syntax-highlighter for code blocks
  - Added dark theme syntax highlighting (oneDark theme)
  - Improved typography with proper spacing and styling
- **UI/UX Improvements**:
  - Fixed AI message visibility with proper background colors
  - Changed AI text to white for better readability
  - Implemented auto-scroll to bottom functionality
  - Increased textarea max height for longer messages
- **Unlimited Text Features**:
  - Removed token limits for unlimited chat length
  - Set maxTokens to -1 (unlimited) by default
  - Enhanced input area to support very long messages
  - Added visual indicator for unlimited text length
- **Multi-Platform Deployment Support**:
  - Created netlify.toml configuration file
  - Added Netlify Functions support with serverless API
  - Added Vercel deployment configuration (vercel.json)
  - Added Railway deployment configuration (railway.toml)
  - Added Render deployment configuration (render.yaml)
  - Added Heroku deployment support (Procfile)
  - Added Docker support (Dockerfile, docker-compose.yml)
  - Added aaPanel deployment support (aapanel-setup.md, ecosystem.config.js)
  - Created comprehensive deployment guide (DEPLOYMENT.md)
  - Updated README.md with all deployment options
- **Bug Fixes**:
  - Fixed duplicate SystemStatus declaration error
  - Fixed duplicate ChatHeader declaration error
  - Fixed metadata type mismatch in storage.ts
  - Resolved LSP compilation errors

## Changelog

Changelog:
- July 07, 2025. Initial setup and RidChat AI rebranding with ChatGPT-style interface