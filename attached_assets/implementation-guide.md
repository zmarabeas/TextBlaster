## Future Expansion Considerations

1. **AI Integration**
   - Design message data model to support future AI training
   - Create abstraction layer for message processing
   - Plan for metadata storage for message classification

2. **Additional Communication Channels**
   - Design messaging architecture to support multiple channels
   - Implement adapter pattern for different message providers
   - Create unified inbox for multi-channel support

3. **Advanced Analytics**
   - Plan for data warehouse integration
   - Design event tracking for detailed analytics
   - Consider implementing A/B testing framework# TextBlaster CRM Implementation Guide

This technical guide details the implementation approach for the TextBlaster CRM system, focusing on simplicity and direct value for small businesses.

## System Architecture Overview

TextBlaster CRM follows a straightforward web application architecture using Next.js with Supabase as the backend service provider.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   Client (Browser/Mobile)                │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                       Next.js App                        │
│  ┌─────────────┐    ┌──────────────┐    ┌────────────┐  │
│  │  Pages &    │    │  API Routes   │    │ Server-Side│  │
│  │ Components  │    │              │    │  Functions │  │
│  └─────────────┘    └──────────────┘    └────────────┘  │
└───────────┬───────────────────────┬──────────────┬──────┘
            │                       │              │
┌───────────▼───────────┐ ┌─────────▼────────┐ ┌──▼─────────────┐
│  Supabase Services    │ │   Twilio API     │ │  Stripe API     │
│ ┌──────────────────┐ │ │                   │ │                 │
│ │    Auth          │ │ └───────────────────┘ └─────────────────┘
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │   Database       │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │   Storage        │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │   Realtime       │ │
│ └──────────────────┘ │
└───────────────────────┘
```

### Technology Stack Details

#### Frontend
- **Framework**: Next.js with App Router
- **UI Library**: React
- **Styling**: Tailwind CSS with minimal custom components
- **State Management**: React Context API for simple global state
- **Form Handling**: React Hook Form for simple validation

#### Backend
- **API Routes**: Next.js API Routes
- **Database**: Supabase PostgreSQL
- **Realtime**: Supabase Realtime for messaging
- **Authentication**: Supabase Auth (email/password)
- **SMS Integration**: Twilio API
- **Payment Processing**: Stripe integration

#### Development Tools
- **Language**: TypeScript
- **Linting**: ESLint
- **Formatting**: Prettier
- **Testing**: Basic Jest tests for core functionality

## Data Model

### Core Entities

#### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT UNIQUE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### Clients
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT,
  tags TEXT[],
  notes TEXT,
  last_contacted TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, phone)
);
```

#### Messages
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users NOT NULL,
  client_id UUID REFERENCES clients NOT NULL,
  direction TEXT CHECK (direction IN ('inbound', 'outbound')),
  content TEXT NOT NULL,
  twilio_sid TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### MessageCredits
```sql
CREATE TABLE message_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users NOT NULL,
  amount INTEGER NOT NULL,
  balance INTEGER NOT NULL,
  reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### CreditPackages
```sql
CREATE TABLE credit_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  credit_amount INTEGER NOT NULL,
  price INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### Clients
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT,
  tags TEXT[],
  notes TEXT,
  status TEXT DEFAULT 'active',
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(organization_id, phone)
);
```

#### Messages
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations NOT NULL,
  client_id UUID REFERENCES clients NOT NULL,
  user_id UUID REFERENCES users,
  direction TEXT CHECK (direction IN ('inbound', 'outbound')),
  content TEXT NOT NULL,
  media_urls TEXT[],
  status TEXT DEFAULT 'sent',
  twilio_sid TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### Forms
```sql
CREATE TABLE forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  fields JSONB NOT NULL,
  active BOOLEAN DEFAULT true,
  form_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### FormSubmissions
```sql
CREATE TABLE form_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID REFERENCES forms NOT NULL,
  client_id UUID REFERENCES clients,
  data JSONB NOT NULL,
  status TEXT DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Database Relationships

- **Users** belong to **Organizations**
- **Clients** belong to **Organizations**
- **Messages** belong to **Clients** and optionally to **Users**
- **Forms** belong to **Organizations**
- **FormSubmissions** belong to **Forms** and optionally to **Clients**

## Key Implementation Approaches

### Authentication System with Supabase

A comprehensive yet simple authentication system built on Supabase Auth:

1. Email/password authentication using Supabase Auth
2. Password reset functionality using Supabase Auth APIs
3. Session management with Supabase JWT tokens
4. Data security using Supabase Row Level Security (RLS) policies

```typescript
// Example auth configuration
// lib/supabase/auth.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

// Sign up function with Supabase Auth
export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  });
  
  if (error) throw error;
  
  // Create user profile in database after successful auth signup
  if (data.user) {
    await supabase.from('users').insert({
      id: data.user.id,
      email: email,
      full_name: fullName,
      created_at: new Date().toISOString()
    });
  }
  
  return data;
}

// Sign in function with Supabase Auth
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

// Password reset with Supabase Auth
export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  if (error) throw error;
  return data;
}

// Sign out function with Supabase Auth
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Get current user session with Supabase Auth
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}
```

```typescript
// Example middleware for protected routes
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect to login if no session and the route is protected
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/clients/:path*', '/messaging/:path*'],
};
```

```sql
-- Example RLS policies for client data
-- These would be added in Supabase dashboard or migrations

-- Allow users to only see their own clients
CREATE POLICY "Users can view their own clients"
ON clients FOR SELECT
USING (user_id = auth.uid());

-- Allow users to insert clients only for themselves
CREATE POLICY "Users can insert their own clients"
ON clients FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Allow users to update only their own clients
CREATE POLICY "Users can update their own clients"
ON clients FOR UPDATE
USING (user_id = auth.uid());
```

### Client Management

A focused approach to client management with only essential features:

1. Simple client database with basic fields
2. Client tagging for organization
3. Basic search and filtering
4. CSV import functionality

```typescript
// Example client creation function
// lib/clients/clientService.ts
import { supabase } from '../supabase/client';

export interface ClientData {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address?: string;
  tags?: string[];
  notes?: string;
}

export async function createClient(userId: string, clientData: ClientData) {
  // Format the phone number
  const formattedPhone = formatPhoneNumber(clientData.phone);
  
  // Check if client already exists
  const { data: existingClient } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', userId)
    .eq('phone', formattedPhone)
    .single();
    
  if (existingClient) {
    throw new Error('A client with this phone number already exists');
  }
  
  // Create the client
  const { data, error } = await supabase
    .from('clients')
    .insert({
      user_id: userId,
      first_name: clientData.firstName,
      last_name: clientData.lastName,
      email: clientData.email,
      phone: formattedPhone,
      address: clientData.address,
      tags: clientData.tags || [],
      notes: clientData.notes
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// Helper function to format phone numbers
function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Ensure it has 10 digits
  if (digitsOnly.length !== 10) {
    throw new Error('Phone number must have 10 digits');
  }
  
  // Format as +1XXXXXXXXXX
  return `+1${digitsOnly}`;
}
```

### Messaging System

A straightforward messaging system focused on client communication:

1. Twilio integration for SMS sending and receiving
2. Conversation view with chronological messages
3. Message templates for common responses
4. Credit-based system for cost control

```typescript
// Example message sending function
// lib/messaging/messageService.ts
import { Twilio } from 'twilio';
import { supabase } from '../supabase/client';

export async function sendMessage(userId: string, clientId: string, content: string) {
  // Check message credit balance
  const { data: creditData, error: creditError } = await supabase
    .from('message_credits')
    .select('balance')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
    
  if (creditError) throw new Error('Could not verify message credits');
  
  if (creditData.balance <= 0) {
    throw new Error('Insufficient message credits. Please purchase additional credits.');
  }
  
  // Get client phone number
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('phone')
    .eq('id', clientId)
    .single();
    
  if (clientError) throw new Error('Client not found');
  
  // Get user's Twilio credentials
  const { data: user, error: userError } = await supabase
    .from('user_settings')
    .select('twilio_sid, twilio_token, twilio_phone')
    .eq('user_id', userId)
    .single();
    
  if (userError) throw new Error('Twilio settings not found');
  
  // Create message record first (optimistic)
  const { data: message, error: messageError } = await supabase
    .from('messages')
    .insert({
      user_id: userId,
      client_id: clientId,
      content,
      direction: 'outbound'
    })
    .select()
    .single();
    
  if (messageError) throw messageError;
  
  try {
    // Send via Twilio
    const twilioClient = new Twilio(user.twilio_sid, user.twilio_token);
    const twilioMessage = await twilioClient.messages.create({
      body: content,
      from: user.twilio_phone,
      to: client.phone
    });
    
    // Update message with Twilio ID
    await supabase
      .from('messages')
      .update({
        twilio_sid: twilioMessage.sid
      })
      .eq('id', message.id);
    
    // Deduct credit
    await supabase.rpc('deduct_message_credit', {
      user_id: userId,
      amount: 1,
      reference: `Message to ${client.phone}`
    });
    
    return message;
  } catch (error) {
    // Update message to reflect failure
    await supabase
      .from('messages')
      .update({
        error_message: error.message
      })
      .eq('id', message.id);
      
    throw error;
  }
}
```

### Basic Analytics

Simple analytics focused on actionable insights:

1. Track client engagement metrics
2. Identify clients requiring attention
3. Monitor message credit usage
4. Provide basic insights in a dashboard format

```typescript
// Example analytics dashboard data function
// lib/analytics/dashboardService.ts
import { supabase } from '../supabase/client';

export async function getDashboardData(userId: string) {
  // Get total clients
  const { count: totalClients } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
    
  // Get clients requiring attention (not contacted in 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { data: needsAttention, count: needsAttentionCount } = await supabase
    .from('clients')
    .select('id, first_name, last_name, phone', { count: 'exact' })
    .eq('user_id', userId)
    .lt('last_contacted', thirtyDaysAgo.toISOString())
    .order('last_contacted', { ascending: true })
    .limit(10);
    
  // Get message activity for last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { data: messageActivity } = await supabase
    .from('messages')
    .select('direction, created_at')
    .eq('user_id', userId)
    .gte('created_at', sevenDaysAgo.toISOString());
    
  // Get credit balance
  const { data: creditData } = await supabase
    .from('message_credits')
    .select('balance')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  // Calculate basic metrics
  const messagesSent = messageActivity?.filter(m => m.direction === 'outbound').length || 0;
  const messagesReceived = messageActivity?.filter(m => m.direction === 'inbound').length || 0;
  const responseRate = messagesSent > 0 ? (messagesReceived / messagesSent * 100).toFixed(1) : '0';
  
  return {
    totalClients,
    needsAttention,
    needsAttentionCount,
    messagesSent,
    messagesReceived,
    responseRate,
    creditBalance: creditData?.balance || 0
  };
}
```

### Payment Integration

A simple credit purchase system with Stripe:

1. Credit packages for message sending
2. Secure payment processing
3. Credit balance tracking
4. Purchase history

```typescript
// Example credit purchase function
// lib/payments/creditService.ts
import Stripe from 'stripe';
import { supabase } from '../supabase/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

export async function createCreditPurchase(
  userId: string,
  packageId: string,
  paymentMethodId: string
) {
  // Get credit package details
  const { data: creditPackage, error: packageError } = await supabase
    .from('credit_packages')
    .select('*')
    .eq('id', packageId)
    .eq('is_active', true)
    .single();
    
  if (packageError) throw new Error('Credit package not found or inactive');
  
  // Get user details
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('email, full_name')
    .eq('id', userId)
    .single();
    
  if (userError) throw new Error('User not found');
  
  try {
    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: creditPackage.price,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      metadata: {
        user_id: userId,
        package_id: packageId,
        credit_amount: creditPackage.credit_amount.toString()
      },
      receipt_email: user.email
    });
    
    if (paymentIntent.status !== 'succeeded') {
      throw new Error(`Payment failed: ${paymentIntent.status}`);
    }
    
    // Get current credit balance
    const { data: currentCredit } = await supabase
      .from('message_credits')
      .select('balance')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    const currentBalance = currentCredit?.balance || 0;
    const newBalance = currentBalance + creditPackage.credit_amount;
    
    // Record credit purchase
    const { data: credit, error: creditError } = await supabase
      .from('message_credits')
      .insert({
        user_id: userId,
        amount: creditPackage.credit_amount,
        balance: newBalance,
        reference: `Purchase: ${creditPackage.name}`
      })
      .select()
      .single();
      
    if (creditError) throw creditError;
    
    return {
      success: true,
      credit,
      newBalance
    };
  } catch (error) {
    console.error('Credit purchase error:', error);
    throw error;
  }
}
```

### Modular Form System

The form system will be implemented as:

1. A form builder interface for administrators
2. JSON schema-based form definitions stored in the database
3. Dynamic form rendering components
4. Form submission handling and storage
5. PDF generation from form submissions

```typescript
// Example form rendering component
function DynamicForm({ formId, clientId, onSubmit }) {
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  
  useEffect(() => {
    // Fetch form definition
    async function loadForm() {
      const { data } = await supabase
        .from('forms')
        .select('*')
        .eq('id', formId)
        .single();
      
      setForm(data);
      
      // Pre-populate with client data if available
      if (clientId) {
        const { data: client } = await supabase
          .from('clients')
          .select('*')
          .eq('id', clientId)
          .single();
        
        // Map client data to form fields
        const initialData = mapClientDataToForm(client, data.fields);
        setFormData(initialData);
      }
    }
    
    loadForm();
  }, [formId, clientId]);
  
  // Form change handler
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Submit handler
  const handleSubmit = async () => {
    // Validate data
    const validationResult = validateFormData(formData, form.fields);
    
    if (!validationResult.valid) {
      return { error: validationResult.errors };
    }
    
    // Save submission
    const { data, error } = await supabase
      .from('form_submissions')
      .insert({
        form_id: formId,
        client_id: clientId,
        data: formData
      })
      .select()
      .single();
      
    if (error) return { error };
    
    onSubmit(data);
    return { data };
  };
  
  if (!form) return <Loading />;
  
  return (
    <div className="form-container">
      {form.fields.map(field => (
        <FormField
          key={field.id}
          field={field}
          value={formData[field.id]}
          onChange={(value) => handleChange(field.id, value)}
        />
      ))}
      
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

### Analytics System

The analytics system will be implemented using:

1. Database triggers to record analytics events
2. Materialized views for efficient analytics queries
3. React components for data visualization
4. Scheduled jobs for aggregating analytics data

```sql
-- Example materialized view for message analytics
CREATE MATERIALIZED VIEW message_analytics AS
SELECT
  date_trunc('day', created_at) AS day,
  organization_id,
  COUNT(*) FILTER (WHERE direction = 'outbound') AS sent_count,
  COUNT(*) FILTER (WHERE direction = 'inbound') AS received_count,
  COUNT(DISTINCT client_id) AS unique_clients
FROM messages
GROUP BY 1, 2
ORDER BY 1 DESC;

-- Refresh function
CREATE OR REPLACE FUNCTION refresh_message_analytics()
RETURNS TRIGGER LANGUAGE PLPGSQL
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW message_analytics;
  RETURN NULL;
END $$;

-- Trigger to refresh analytics
CREATE TRIGGER refresh_message_analytics_trigger
AFTER INSERT OR UPDATE OR DELETE ON messages
FOR EACH STATEMENT
EXECUTE PROCEDURE refresh_message_analytics();
```

## Performance Considerations

1. **Database Indexing**
   - Create appropriate indexes on frequently queried columns
   - Use composite indexes for multi-column filters

2. **Caching Strategy**
   - Implement React Query for client-side query caching
   - Use Supabase edge functions for API caching where appropriate
   - Consider implementing Redis for high-traffic deployments

3. **Real-time Performance**
   - Limit real-time subscriptions to active views
   - Implement pagination for large data sets
   - Use optimistic UI updates for better perceived performance

4. **Image and Media Optimization**
   - Implement lazy loading for images
   - Use Supabase Storage with transformation for responsive images
   - Compress media attachments before upload

## Security Implementation

1. **Authentication Security**
   - Configure appropriate password policies
   - Implement MFA for sensitive operations
   - Use short-lived JWT tokens

2. **Data Security**
   - Implement Row Level Security for all database tables
   - Encrypt sensitive fields (like Twilio credentials)
   - Sanitize all user inputs

3. **API Security**
   - Rate limit API endpoints
   - Implement CSRF protection
   - Set up appropriate CORS policies

4. **Infrastructure Security**
   - Use edge functions for sensitive operations
   - Implement regular security scanning
   - Set up monitoring and alerting for suspicious activities

## Deployment Strategy

1. **CI/CD Pipeline**
   - Set up GitHub Actions for automated testing and deployment
   - Configure staging and production environments
   - Implement automated database migrations

2. **Infrastructure**
   - Deploy Next.js application on Vercel
   - Use Supabase managed database
   - Set up monitoring with appropriate tools

3. **Scaling Considerations**
   - Design with horizontal scaling in mind
   - Implement database connection pooling
   - Set up CDN for static assets

## Testing Strategy

1. **Unit Testing**
   - Test utility functions and hooks
   - Use Jest and React Testing Library

2. **Integration Testing**
   - Test key user flows
   - Test API integrations with mock servers

3. **End-to-End Testing**
   - Use Cypress for critical user journeys
   - Test on multiple browsers and devices

## Monitoring and Maintenance

1. **Error Tracking**
   - Implement error logging and tracking
   - Set up alerts for critical errors

2. **Performance Monitoring**
   - Monitor page load times
   - Track API response times
   - Monitor database performance

3. **User Analytics**
   - Implement usage tracking
   - Monitor conversion rates
   - Track feature adoption

## User Interface Implementation

The UI will focus on simplicity and ease of use:

### Dashboard

A simple, informative dashboard that provides:
- Message credit balance
- Clients requiring attention
- Recent message activity
- Quick access to core functions

```tsx
// components/Dashboard.tsx
import React from 'react';
import { useRouter } from 'next/router';
import { useDashboardData } from '@/lib/hooks/useDashboardData';

export default function Dashboard() {
  const router = useRouter();
  const { data, isLoading, error } = useDashboardData();
  
  if (isLoading) return <div className="p-4">Loading dashboard...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading dashboard data</div>;
  
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-6">Dashboard</h1>
      
      {/* Credit Balance */}
      <div className="bg-white rounded-lg p-4 shadow mb-4">
        <h2 className="font-semibold mb-2">Message Credits</h2>
        <div className="flex items-center">
          <span className="text-2xl font-bold">{data.creditBalance}</span>
          <button 
            className="ml-auto bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => router.push('/credits')}
          >
            Buy More
          </button>
        </div>
      </div>
      
      {/* Clients Needing Attention */}
      <div className="bg-white rounded-lg p-4 shadow mb-4">
        <h2 className="font-semibold mb-2">Clients Needing Attention</h2>
        {data.needsAttention.length === 0 ? (
          <p className="text-gray-500">All clients are up to date</p>
        ) : (
          <ul className="divide-y">
            {data.needsAttention.map(client => (
              <li key={client.id} className="py-2">
                <button 
                  className="w-full text-left flex justify-between items-center"
                  onClick={() => router.push(`/clients/${client.id}`)}
                >
                  <span>{client.first_name} {client.last_name}</span>
                  <span className="text-blue-500">Contact</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Message Activity */}
      <div className="bg-white rounded-lg p-4 shadow">
        <h2 className="font-semibold mb-2">Recent Activity</h2>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Messages Sent</p>
            <p className="text-xl font-bold">{data.messagesSent}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Messages Received</p>
            <p className="text-xl font-bold">{data.messagesReceived}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Client Management

A clean interface for managing clients:
- Simple listing with essential information
- Client tagging
- Conversation view
- Quick actions

```tsx
// components/ClientList.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useClients } from '@/lib/hooks/useClients';

export default function ClientList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const { clients, isLoading, error } = useClients();
  
  if (isLoading) return <div className="p-4">Loading clients...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading clients</div>;
  
  // Filter clients based on search term
  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    return (
      client.first_name?.toLowerCase().includes(searchLower) ||
      client.last_name?.toLowerCase().includes(searchLower) ||
      client.phone?.includes(searchTerm) ||
      client.email?.toLowerCase().includes(searchLower)
    );
  });
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Clients</h1>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={() => router.push('/clients/new')}
        >
          Add Client
        </button>
      </div>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search clients..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ul className="divide-y">
          {filteredClients.map(client => (
            <li key={client.id} className="hover:bg-gray-50">
              <button
                className="w-full p-3 text-left"
                onClick={() => router.push(`/clients/${client.id}`)}
              >
                <div className="flex justify-between">
                  <span className="font-medium">
                    {client.first_name} {client.last_name}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {formatPhoneForDisplay(client.phone)}
                  </span>
                </div>
                {client.tags && client.tags.length > 0 && (
                  <div className="mt-1 flex gap-1">
                    {client.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            </li>
          ))}
          
          {filteredClients.length === 0 && (
            <li className="p-3 text-center text-gray-500">
              {searchTerm ? 'No clients match your search' : 'No clients yet'}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

function formatPhoneForDisplay(phone) {
  if (!phone) return '';
  
  // Remove the +1 prefix
  const cleaned = phone.replace('+1', '');
  
  // Format as (XXX) XXX-XXXX
  return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
}
```

## Error Handling and Logging System

The application will implement a comprehensive error handling and logging system to improve reliability, aid in debugging, and enhance user experience:

1. **Structured Logging**
   - Implement a centralized logging service
   - Use structured log format with consistent fields
   - Log different severity levels (info, warn, error, critical)
   - Include contextual information in all logs

2. **Error Handling Strategy**
   - Implement global error boundary for React components
   - Create API middleware for catching and handling errors
   - Provide user-friendly error messages
   - Preserve technical details for admin diagnosis

3. **Log Storage and Management**
   - Store logs in database for structured queries
   - Implement log rotation and archiving
   - Set up log retention policies
   - Create admin interface for log exploration

4. **Monitoring and Alerts**
   - Create critical error notification system
   - Set up dashboard for system health
   - Implement log analysis for trend detection
   - Configure alerts for unusual activity

```typescript
// lib/logging/logger.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export enum LogCategory {
  AUTH = 'auth',
  MESSAGING = 'messaging',
  PAYMENT = 'payment',
  TOKENS = 'tokens',
  SYSTEM = 'system',
  API = 'api',
  DATABASE = 'database',
  FRONTEND = 'frontend'
}

export interface LogEntry {
  level: LogLevel;
  category: LogCategory;
  message: string;
  details?: Record<string, any>;
  user_id?: string;
  organization_id?: string;
  request_id?: string;
  stack_trace?: string;
  source_location?: string;
}

export class Logger {
  private supabase;
  private context: Record<string, any> = {};
  
  constructor(
    supabaseClient: ReturnType<typeof createClient<Database>>,
    defaultContext: Record<string, any> = {}
  ) {
    this.supabase = supabaseClient;
    this.context = defaultContext;
  }
  
  setContext(context: Record<string, any>) {
    this.context = { ...this.context, ...context };
    return this;
  }
  
  private async writeLog(entry: LogEntry) {
    // Enrich with context
    const enrichedEntry = {
      ...entry,
      details: { ...entry.details, ...this.context },
      created_at: new Date().toISOString()
    };
    
    try {
      // Write to database
      await this.supabase.from('system_logs').insert(enrichedEntry);
      
      // Console output for development
      if (process.env.NODE_ENV === 'development') {
        const logMethod = entry.level === LogLevel.ERROR || entry.level === LogLevel.CRITICAL 
          ? console.error 
          : entry.level === LogLevel.WARN 
            ? console.warn 
            : console.log;
            
        logMethod(
          `[${entry.level.toUpperCase()}] [${entry.category}] ${entry.message}`,
          entry.details
        );
      }
      
      // Send critical alerts
      if (entry.level === LogLevel.CRITICAL) {
        await this.sendCriticalAlert(enrichedEntry);
      }
    } catch (error) {
      // Fallback for logging failures
      console.error('Logging failure:', error);
      console.error('Original log entry:', enrichedEntry);
    }
  }
  
  private async sendCriticalAlert(entry: LogEntry) {
    // Get admin users
    const { data: admins } = await this.supabase
      .from('users')
      .select('id, email')
      .eq('role', 'super_admin');
      
    if (!admins || admins.length === 0) return;
    
    // Send notification (implementation depends on notification system)
    // This could be email, SMS, or a push notification
    // ...
  }
  
  debug(message: string, details?: Record<string, any>, category: LogCategory = LogCategory.SYSTEM) {
    return this.writeLog({ level: LogLevel.DEBUG, category, message, details });
  }
  
  info(message: string, details?: Record<string, any>, category: LogCategory = LogCategory.SYSTEM) {
    return this.writeLog({ level: LogLevel.INFO, category, message, details });
  }
  
  warn(message: string, details?: Record<string, any>, category: LogCategory = LogCategory.SYSTEM) {
    return this.writeLog({ level: LogLevel.WARN, category, message, details });
  }
  
  error(message: string, error?: Error, details?: Record<string, any>, category: LogCategory = LogCategory.SYSTEM) {
    return this.writeLog({
      level: LogLevel.ERROR,
      category,
      message,
      details,
      stack_trace: error?.stack,
      source_location: this.getErrorLocation(error)
    });
  }
  
  critical(message: string, error?: Error, details?: Record<string, any>, category: LogCategory = LogCategory.SYSTEM) {
    return this.writeLog({
      level: LogLevel.CRITICAL,
      category,
      message,
      details,
      stack_trace: error?.stack,
      source_location: this.getErrorLocation(error)
    });
  }
  
  private getErrorLocation(error?: Error): string | undefined {
    if (!error?.stack) return undefined;
    
    const stackLines = error.stack.split('\n');
    // Get first non-Error construction line
    const locationLine = stackLines.find(line => 
      line.includes('.ts:') || line.includes('.js:') || line.includes('.tsx:')
    );
    
    return locationLine?.trim() || undefined;
  }
}

// Create a global logger instance
let globalLogger: Logger | null = null;

export function createLogger(
  supabaseClient: ReturnType<typeof createClient<Database>>,
  defaultContext: Record<string, any> = {}
) {
  if (!globalLogger) {
    globalLogger = new Logger(supabaseClient, defaultContext);
  }
  return globalLogger;
}

// Helper for server components/API routes
export async function getServerLogger() {
  const { cookies } = await import('next/headers');
  const { createServerClient } = await import('@supabase/ssr');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  const cookieStore = cookies();
  
  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  
  return new Logger(supabase);
}
```

```typescript
// middleware/errorHandling.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getServerLogger, LogCategory } from '@/lib/logging/logger';

export async function errorHandlingMiddleware(
  request: NextRequest,
  next: () => Promise<NextResponse>
) {
  try {
    // Generate unique request ID for tracing
    const requestId = crypto.randomUUID();
    
    // Clone the request and add the request ID
    const requestWithId = new NextRequest(request, {
      headers: {
        ...Object.fromEntries(request.headers.entries()),
        'x-request-id': requestId
      }
    });
    
    // Pass to next middleware or route handler
    const response = await next();
    
    // Add request ID to response headers for client-side correlation
    response.headers.set('x-request-id', requestId);
    
    return response;
  } catch (error) {
    const logger = await getServerLogger();
    
    // Log the error
    await logger.error(
      'Unhandled API error',
      error instanceof Error ? error : new Error(String(error)),
      {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers.entries())
      },
      LogCategory.API
    );
    
    // Create user-friendly error response
    const errorId = crypto.randomUUID();
    
    // Don't expose internal error details to client
    return NextResponse.json({
      error: {
        message: 'An unexpected error occurred',
        errorId: errorId,
        // Only include technical details in development
        ...(process.env.NODE_ENV === 'development' ? {
          stack: error instanceof Error ? error.stack : undefined,
          details: String(error)
        } : {})
      }
    }, { status: 500 });
  }
}
```

```typescript
// components/ErrorBoundary.tsx
'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { createClientLogger, LogCategory } from '@/lib/logging/logger';
import { supabase } from '@/lib/supabase/client';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode | ((error: Error, resetError: () => void) => ReactNode);
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    const logger = createClientLogger(supabase);
    
    await logger.error(
      'React component error',
      error,
      {
        componentStack: errorInfo.componentStack,
        url: window.location.href
      },
      LogCategory.FRONTEND
    );
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error!, this.resetError);
      }
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

```typescript
// app/api/error-handler.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerLogger, LogCategory } from '@/lib/logging/logger';

export async function handleApiError(
  req: NextRequest,
  error: unknown,
  status = 500,
  userMessage = 'An unexpected error occurred'
) {
  const logger = await getServerLogger();
  
  // Generate an error ID for tracking
  const errorId = crypto.randomUUID();
  
  // Log the error
  await logger.error(
    `API Error: ${String(error)}`,
    error instanceof Error ? error : new Error(String(error)),
    {
      url: req.url,
      method: req.method,
      errorId
    },
    LogCategory.API
  );
  
  // Create a user-friendly response
  return NextResponse.json(
    {
      error: {
        message: userMessage,
        errorId,
        // Only include technical details in development
        ...(process.env.NODE_ENV === 'development' ? {
          details: String(error),
          stack: error instanceof Error ? error.stack : undefined
        } : {})
      }
    },
    { status }
  );
}
```

### Database Schema for Logging

```sql
CREATE TABLE system_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level TEXT NOT NULL CHECK (level IN ('debug', 'info', 'warn', 'error', 'critical')),
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  user_id UUID REFERENCES auth.users,
  organization_id UUID REFERENCES organizations,
  request_id TEXT,
  stack_trace TEXT,
  source_location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for efficient queries
CREATE INDEX idx_logs_level ON system_logs (level);
CREATE INDEX idx_logs_category ON system_logs (category);
CREATE INDEX idx_logs_created_at ON system_logs (created_at);
CREATE INDEX idx_logs_user_id ON system_logs (user_id);
CREATE INDEX idx_logs_org_id ON system_logs (organization_id);

-- Create view for critical errors
CREATE VIEW critical_errors AS
SELECT * FROM system_logs
WHERE level = 'critical'
ORDER BY created_at DESC;

-- Create function to clean up old logs
CREATE OR REPLACE FUNCTION clean_old_logs(retention_days INTEGER)
RETURNS INTEGER AS $
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM system_logs
  WHERE created_at < (CURRENT_DATE - retention_days);
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$ LANGUAGE plpgsql;
```

### Super Admin Log Viewer Interface

The super admin dashboard will include a comprehensive log viewer that allows:

1. Filtering logs by:
   - Severity level
   - Category
   - Time range
   - Organization
   - User

2. Searching logs by:
   - Message content
   - Error details
   - Request information

3. Analyzing trends and patterns:
   - Error frequency visualization
   - Common error types
   - System health indicators

4. Taking action on critical issues:
   - Creating support tickets
   - Notifying affected users
   - Implementing temporary workarounds
