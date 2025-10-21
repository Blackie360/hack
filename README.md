# LockIn

![LockIn]

## Overview

**LockIn** is a secure, web-based platform that lets developers and teams safely store, manage, and share environment variables from anywhere. Whether you're switching machines or building fast during a hackathon, LockIn keeps your `.env` keys organized, encrypted, and instantly accessible across devices.

### Key Features

- 🔐 **End-to-End Encryption** - Your secrets are encrypted before leaving your device
- 🌐 **Cross-Device Sync** - Access your environment variables from any device, anywhere
- 👥 **Team Workspaces** - Collaborate securely with fine-grained access controls
- 🔑 **Smart Key Management** - Organize API keys by project, environment, and team
- ⏰ **Auto-Expiring Secrets** - Set expiration dates for temporary keys and tokens
- ⚡ **Lightning Fast** - Built for speed with optimized infrastructure

## Tech Stack

- **Framework**: Next.js 15
- **Authentication**: Better Auth
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database (or Neon serverless PostgreSQL)
- Google OAuth credentials (optional, for social login)

### Installation

1. Clone the repository and install dependencies:

```bash
pnpm install
```

2. Create a `.env.local` file in the root directory:

```bash
# Better Auth Configuration
BETTER_AUTH_SECRET="your-better-auth-secret"
BETTER_AUTH_URL="http://localhost:3000"

# Database Configuration
DATABASE_URL="your-postgresql-database-url"

# OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email (Optional - for invitations and password reset)
EMAIL_FROM="noreply@yourdomain.com"
RESEND_API_KEY="your-resend-api-key"

# Cron Job Security (Required for Vercel Cron)
CRON_SECRET="your-secure-random-secret"
```

3. Run database migrations:

```bash
pnpm drizzle-kit push
```

4. Start the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see LockIn in action!

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Protected dashboard pages
│   └── auth/              # Authentication pages
├── components/            # React components
│   ├── forms/            # Form components
│   ├── ui/               # shadcn/ui components
│   └── emails/           # Email templates
├── db/                    # Database schema and configuration
├── lib/                   # Utility functions and configurations
│   ├── auth/             # Authentication utilities
│   └── auth.ts           # Better Auth configuration
├── server/               # Server-side logic
└── migrations/           # Database migrations
```

## Features

### Authentication & Authorization
- Email/Password authentication
- Google OAuth integration
- Email verification
- Password reset functionality
- Role-based access control (RBAC)

### Organization Management
- Create and manage organizations
- Invite team members via email
- Set member roles and permissions
- Organization switching

### Security
- End-to-end encryption for sensitive data
- Secure session management
- Rate limiting on API endpoints
- CSRF protection
- SQL injection prevention

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:push` - Push database schema changes
- `pnpm db:studio` - Open Drizzle Studio

### Environment Variables

Make sure to set all required environment variables in your `.env.local` file. Never commit this file to version control.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard (including `CRON_SECRET`)
4. Deploy!

**Important**: The project includes a Vercel Cron Job that pings the database every Sunday at 12:00 PM UTC to prevent Supabase from deactivating inactive databases. Make sure to set the `CRON_SECRET` environment variable in Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/lockin)

### Database Keep-Alive

LockIn includes an automated cron job to keep your Supabase database active:

- **Endpoint**: `/api/cron/keep-alive`
- **Schedule**: Every Sunday at 12:00 PM UTC
- **Configuration**: See `vercel.json`
- **Security**: Protected by `CRON_SECRET` environment variable

To test the cron job manually:
```bash
curl -X GET "https://your-deployment-url.vercel.app/api/cron/keep-alive" \
  -H "Authorization: Bearer your-cron-secret"
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is built using Better Auth starter template and is available under the MIT License.

## Support

For support, email support@lockin.dev or open an issue on GitHub.

---

Built with ❤️ for developers who value security
