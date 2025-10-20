# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Next.js 15 application built with TypeScript for a doctorate certificates system ("constancias-doctorado"). The project uses a modern stack with Prisma for database management, Better Auth for authentication, and Tailwind CSS for styling.

## Development Commands

### Core Development
- `pnpm dev` - Start development server with Turbopack for faster builds
- `pnpm build` - Build the application for production with Turbopack  
- `pnpm start` - Start production server
- `pnpm lint` - Run Biome linting
- `pnpm format` - Auto-format code with Biome

### Database Operations
- `npx prisma generate` - Generate Prisma client after schema changes
- `npx prisma db push` - Push schema changes to database
- `npx prisma studio` - Open Prisma Studio for database management
- `npx prisma migrate dev` - Create and apply new migrations

## Architecture & Key Components

### Database Layer
- **Database**: PostgreSQL with Prisma ORM
- **Client Generation**: Custom output path at `src/generated/prisma`
- **Extensions**: Uses Prisma Accelerate for enhanced performance
- **Schema**: Authentication-focused with User, Session, Account, and Verification models

### Authentication
- **Provider**: Better Auth with Prisma adapter
- **Features**: Email/password authentication with Next.js cookie support
- **Configuration**: Environment-based with secrets and URL configuration

### Project Structure
```
src/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx       # Root layout with Geist fonts
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── lib/                 # Shared utilities and configurations  
│   ├── auth.ts          # Better Auth configuration
│   ├── db.ts            # Prisma client with Accelerate
│   └── utils.ts         # Tailwind utility functions
└── generated/prisma/    # Auto-generated Prisma client
```

## Technology Stack

### Core Framework
- **Next.js 15** with App Router and Turbopack
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling

### Database & Auth
- **Prisma** with PostgreSQL and Accelerate extension
- **Better Auth** for authentication management

### Development Tools
- **Biome** for linting and formatting (configured for Next.js and React)
- **shadcn/ui** components ready (New York style with Lucide icons)
- **pnpm** as package manager

## Environment Setup

Copy `env.example` to `.env` and configure:
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Authentication secret key
- `BETTER_AUTH_URL` - Application base URL
- `BETTER_AUTH_TRUST_HOST` - Set to "true" in production with HTTPS

## Code Style & Standards

### Formatting
- 2-space indentation
- Biome handles formatting and linting
- Import organization enabled
- TypeScript strict mode enabled

### Path Aliases
- `@/*` maps to `src/*`
- `@/components` for UI components
- `@/lib` for utilities and configurations
- `@/hooks` for custom hooks

## Database Schema Notes

The schema is designed around authentication with:
- User management with email verification
- Session handling with IP and user agent tracking
- Account linking for multiple auth providers
- Verification system for email confirmation

When modifying the schema, always run `npx prisma generate` to update the client and ensure the custom output path remains at `src/generated/prisma`.