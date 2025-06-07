# TextBlaster CRM

v0.0.1
A modern SMS marketing and client management platform built with React, Express, and PostgreSQL.

## Features

- 🚀 **SMS Marketing**: Send bulk messages to targeted client groups
- 👥 **Client Management**: Organize clients with tags and custom fields
- 📊 **Analytics**: Track message delivery and engagement
- 💳 **Stripe Integration**: Secure payment processing for credits
- 🏢 **Enterprise Features**: Custom forms, credit applications, and document management
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Wouter (routing)
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **SMS**: Twilio integration
- **Payments**: Stripe
- **Deployment**: Vercel

## Deployment to Vercel

### Prerequisites

1. Create a [Vercel account](https://vercel.com)
2. Create a [Supabase project](https://supabase.com) for PostgreSQL database
3. Set up [Stripe account](https://stripe.com) for payments
4. Set up [Twilio account](https://twilio.com) for SMS functionality

### Environment Variables

Set these environment variables in your Vercel project dashboard:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Stripe (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# Twilio (get from https://console.twilio.com)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...

# Session Secret (generate a random string)
SESSION_SECRET=your-random-session-secret
```

### Deploy Steps

1. **Clone this repository to your GitHub account**

2. **Connect to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure the environment variables above

3. **Database Setup**:
   - Your Supabase database will be automatically initialized on first deploy
   - Tables are created automatically via Drizzle migrations

4. **Domain Configuration** (Optional):
   - Add your custom domain in Vercel project settings
   - Update CORS settings if needed

## Local Development

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd textblaster-crm
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file with the same variables listed above

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Push database schema**:
   ```bash
   npm run db:push
   ```

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   └── lib/           # Utility functions
├── server/                # Express backend
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database layer
│   └── twilio/           # SMS integration
├── shared/               # Shared types and schemas
└── vercel.json          # Vercel deployment config
```

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/auth/me` - Get current user

### Clients
- `GET /api/clients` - List user's clients
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Messages
- `POST /api/messages/send` - Send single SMS
- `POST /api/messages/batch` - Send bulk SMS
- `GET /api/messages` - List message history

### Payments
- `POST /api/create-payment-intent` - Create Stripe payment
- `GET /api/credits` - Get user credit balance

## License

MIT License - see LICENSE file for details.

## Support

For enterprise features and custom integrations, contact: contact@textblaster.com
