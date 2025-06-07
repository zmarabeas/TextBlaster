# TextBlaster CRM Project Structure

This document outlines the recommended folder and file organization for the TextBlaster CRM project, based on Next.js best practices and the project requirements.

## Root Directory Structure

```
textblaster-crm/
├── .github/               # GitHub Actions workflows and configuration
├── .vscode/               # VSCode settings for consistent development
├── app/                   # Next.js App Router directory (main application code)
├── components/            # Shared React components
├── config/                # Application configuration
├── docs/                  # Project documentation
├── lib/                   # Utility functions and shared code
├── public/                # Static assets
├── scripts/               # Build and maintenance scripts
├── styles/                # Global styles and Tailwind configuration
├── supabase/              # Supabase schema, migrations, and seed data
├── tests/                 # Testing infrastructure
├── types/                 # TypeScript type definitions
├── .env.example           # Example environment variables
├── .eslintrc.js           # ESLint configuration
├── .gitignore             # Git ignore configuration
├── .prettierrc            # Prettier formatting configuration
├── jest.config.js         # Jest testing configuration
├── next.config.js         # Next.js configuration
├── package.json           # NPM package definition
├── README.md              # Project overview
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## Next.js App Directory Structure

The `app/` directory follows Next.js 13+ App Router conventions:

```
app/
├── (auth)/                  # Authentication-related routes (grouped)
│   ├── login/               # Login page
│   │   └── page.tsx         # Login page component
│   ├── register/            # Registration page
│   │   └── page.tsx         # Registration page component
│   ├── forgot-password/     # Password reset
│   │   └── page.tsx
│   └── layout.tsx           # Layout for auth pages
│
├── (dashboard)/             # Protected dashboard routes
│   ├── dashboard/           # Main dashboard
│   │   └── page.tsx
│   ├── clients/             # Client management
│   │   ├── [id]/            # Dynamic route for individual client
│   │   │   └── page.tsx
│   │   └── page.tsx         # Client listing page
│   ├── messaging/           # Messaging functionality
│   │   ├── [clientId]/      # Conversation with specific client
│   │   │   └── page.tsx
│   │   ├── mass/            # Mass messaging functionality
│   │   │   └── page.tsx     
│   │   └── page.tsx         # Messaging overview
│   ├── applications/        # Form applications
│   │   ├── [id]/            # View/edit specific application
│   │   │   └── page.tsx
│   │   ├── templates/       # Application templates
│   │   │   └── page.tsx
│   │   └── page.tsx         # Applications listing
│   ├── analytics/           # Analytics dashboard
│   │   └── page.tsx
│   ├── settings/            # User and org settings
│   │   └── page.tsx
│   ├── payments/            # Payment and subscription management
│   │   ├── subscription/    # Subscription management
│   │   │   └── page.tsx
│   │   ├── tokens/          # Token purchase
│   │   │   └── page.tsx
│   │   ├── history/         # Payment history
│   │   │   └── page.tsx
│   │   └── page.tsx         # Payment overview
│   └── layout.tsx           # Layout for dashboard pages (includes nav)
│
├── (super-admin)/           # Super admin protected routes
│   ├── organizations/       # Organization management
│   │   ├── [id]/            # Individual organization management
│   │   │   └── page.tsx
│   │   └── page.tsx         # Organizations listing
│   ├── users/               # User management across organizations
│   │   ├── [id]/            # Individual user management
│   │   │   └── page.tsx
│   │   └── page.tsx         # Users listing
│   ├── analytics/           # System-wide analytics
│   │   └── page.tsx
│   ├── tokens/              # Token allocation management
│   │   └── page.tsx
│   ├── payments/            # Payment management and reporting
│   │   └── page.tsx
│   ├── logs/                # System logs and error monitoring
│   │   ├── [id]/            # Detailed log view
│   │   │   └── page.tsx
│   │   └── page.tsx         # Log explorer interface
│   ├── settings/            # System-wide settings
│   │   ├── subscription-plans/ # Subscription plan management
│   │   │   └── page.tsx
│   │   ├── token-packages/  # Token package management
│   │   │   └── page.tsx
│   │   └── page.tsx         # Settings overview
│   ├── audit/               # Security audit logs
│   │   └── page.tsx
│   └── layout.tsx           # Layout for super admin pages
│
├── api/                     # API routes
│   ├── auth/                # Auth-related endpoints
│   │   ├── [...nextauth]/
│   │   │   └── route.ts
│   │   ├── mfa/
│   │   │   └── route.ts
│   │   └── super-admin/
│   │       └── route.ts
│   ├── webhooks/            # External service webhooks
│   │   ├── twilio/
│   │   │   └── route.ts
│   │   ├── stripe/
│   │   │   └── route.ts
│   │   └── [...]/
│   ├── payments/            # Payment processing endpoints
│   │   ├── subscription/
│   │   │   └── route.ts
│   │   ├── tokens/
│   │   │   └── route.ts
│   │   └── receipts/
│   │       └── route.ts
│   ├── tokens/              # Token management endpoints
│   │   ├── allocate/
│   │   │   └── route.ts
│   │   ├── validate/
│   │   │   └── route.ts
│   │   └── transactions/
│   │       └── route.ts
│   ├── admin/               # Super admin endpoints
│   │   ├── organizations/
│   │   │   └── route.ts
│   │   ├── users/
│   │   │   └── route.ts
│   │   └── analytics/
│   │       └── route.ts
│   └── [...]/               # Other API endpoints
│
├── error.tsx                # Global error component
├── layout.tsx               # Root layout
├── loading.tsx              # Global loading component
├── not-found.tsx            # 404 page
└── page.tsx                 # Homepage
```

## Components Directory Structure

The `components/` directory is organized by component type and functionality:

```
components/
├── auth/                  # Authentication components
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── ...
│
├── clients/               # Client-related components
│   ├── ClientCard.tsx
│   ├── ClientForm.tsx
│   ├── ClientList.tsx
│   └── ...
│
├── common/                # Common UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   └── ...
│
├── forms/                 # Form builder components
│   ├── FormBuilder.tsx
│   ├── FormField.tsx
│   ├── FormPreview.tsx
│   └── ...
│
├── layout/                # Layout components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Footer.tsx
│   └── ...
│
├── messaging/             # Messaging components
│   ├── Conversation.tsx
│   ├── MessageBubble.tsx
│   ├── MessageInput.tsx
│   ├── MassMessageForm.tsx
│   ├── MessageTemplate.tsx
│   ├── TokenDisplay.tsx
│   ├── TokenUsageChart.tsx
│   └── ...
│
├── payments/              # Payment components
│   ├── SubscriptionPlans.tsx
│   ├── TokenPackages.tsx
│   ├── CheckoutForm.tsx
│   ├── PaymentHistory.tsx
│   ├── TokenPurchaseForm.tsx
│   ├── ReceiptView.tsx
│   └── ...
│
├── admin/                # Super admin components
│   ├── OrganizationList.tsx
│   ├── OrganizationDetail.tsx
│   ├── UserManagement.tsx
│   ├── TokenAllocation.tsx
│   ├── SystemAnalytics.tsx
│   ├── AuditLogs.tsx
│   └── ...
│
├── pdf/                   # PDF generation components
│   ├── PDFDocument.tsx
│   ├── PDFForm.tsx
│   └── ...
│
└── ui/                    # Base UI components
    ├── Avatar.tsx
    ├── Badge.tsx
    ├── Dropdown.tsx
    ├── Table.tsx
    └── ...
```

## Lib Directory Structure

The `lib/` directory contains utility functions, hooks, and service integrations:

```
lib/
├── analytics/            # Analytics utilities
│   ├── events.ts
│   └── metrics.ts
│
├── auth/                 # Authentication utilities
│   ├── session.ts
│   └── permissions.ts
│
├── clients/              # Client data utilities
│   ├── import.ts
│   └── filter.ts
│
├── forms/                # Form utilities
│   ├── validation.ts
│   └── builder.ts
│
├── hooks/                # Custom React hooks
│   ├── useAuth.ts
│   ├── useClients.ts
│   ├── useMessages.ts
│   └── ...
│
├── pdf/                  # PDF generation utilities
│   ├── generator.ts
│   └── templates.ts
│
├── supabase/             # Supabase client and utilities
│   ├── client.ts
│   ├── queries.ts
│   └── subscriptions.ts
│
├── twilio/               # Twilio integration
│   ├── client.ts
│   ├── messages.ts
│   └── webhooks.ts
│
└── utils/                # General utilities
    ├── date.ts
    ├── formatting.ts
    ├── validation.ts
    └── ...
```

## Types Directory Structure

The `types/` directory contains TypeScript type definitions:

```
types/
├── auth.ts              # Authentication types
├── client.ts            # Client data types
├── forms.ts             # Form types
├── messages.ts          # Messaging types
├── pdf.ts               # PDF types
├── supabase.ts          # Supabase-specific types
└── ...
```

## Supabase Directory Structure

The `supabase/` directory contains database schema, migrations, and seed data:

```
supabase/
├── migrations/          # Database migrations
│   ├── 001_initial_schema.sql
│   ├── 002_auth_setup.sql
│   └── ...
│
├── seed/                # Seed data for development
│   ├── clients.sql
│   ├── forms.sql
│   └── ...
│
├── functions/           # Supabase Edge Functions
│   ├── send-message/
│   │   └── index.ts
│   └── ...
│
└── schema/              # Database schema definitions
    ├── tables.sql
    ├── views.sql
    ├── functions.sql
    └── triggers.sql
```

## Tests Directory Structure

The `tests/` directory follows the structure of the application code:

```
tests/
├── components/          # Component tests
│   ├── auth/
│   ├── clients/
│   └── ...
│
├── e2e/                 # End-to-end tests with Cypress
│   ├── auth.spec.ts
│   ├── clients.spec.ts
│   └── ...
│
├── integration/         # Integration tests
│   ├── api/
│   └── ...
│
├── lib/                 # Utility function tests
│   ├── utils/
│   └── ...
│
└── mocks/               # Mock data and services
    ├── data/
    ├── services/
    └── ...
```

## Config Directory Structure

The `config/` directory contains application configuration:

```
config/
├── constants.ts         # Application constants
├── environment.ts       # Environment configuration
├── features.ts          # Feature flags
├── menu.ts              # Navigation menu configuration
└── ...
```

## Styles Directory Structure

The `styles/` directory contains global styles and Tailwind configuration:

```
styles/
├── components/          # Component-specific styles
│   ├── buttons.css
│   ├── forms.css
│   └── ...
│
├── globals.css          # Global CSS
└── tailwind/            # Tailwind customizations
    ├── colors.js
    ├── typography.js
    └── ...
```

## Key Files

### Next.js Configuration

```javascript
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['supabase.co', 'your-storage-url.supabase.co'],
  },
  experimental: {
    serverActions: true,
  },
  // Add other configurations as needed
};

module.exports = nextConfig;
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/styles/*": ["./styles/*"],
      "@/types/*": ["./types/*"],
      "@/config/*": ["./config/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Tailwind Configuration

```javascript
// tailwind.config.js
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
        secondary: colors.gray,
        // Add custom colors for your application
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        // Add custom fonts as needed
      },
      // Extend other theme settings
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Add other plugins as needed
  ],
};
```

### Environment Variables

```
# .env.example
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Twilio
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Best Practices for this Structure

1. **Component Organization**:
   - Keep components focused on a single responsibility
   - Use composition to build complex components
   - Create reusable UI components in the `ui` directory

2. **Code Sharing**:
   - Place shared business logic in the `lib` directory
   - Use custom hooks for reusing stateful logic
   - Keep utility functions pure and well-tested

3. **Type Definitions**:
   - Define types for all data structures
   - Use interfaces for objects that represent entities
   - Export types from a central location to avoid duplication

4. **API Organization**:
   - Group API routes by functionality
   - Use middleware for common operations like authentication
   - Keep route handlers focused on a single responsibility

5. **State Management**:
   - Use React Context for global state when appropriate
   - Leverage React Query for server state management
   - Keep state as local as possible

6. **Testing**:
   - Mirror the application structure in the tests directory
   - Focus on behavior, not implementation details
   - Use mock data that closely resembles production data

This project structure provides a solid foundation for the TextBlaster CRM application, with a focus on maintainability, scalability, and developer experience.
