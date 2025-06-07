### Example: Supabase Client Setup

```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';### Form Builder Example

```
Component: FormBuilder
Purpose: Allow administrators to create custom forms for different business types
Props:
- initialFormData: FormDefinition | null
- onSave: (formDefinition: FormDefinition) => void
- formTypes: string[] - Available form types
Dependencies:
- React DnD for drag-and-drop interface
- FormFieldEditor component
- FormPreview component
Special requirements:
- Support for different field types (text, number, select, etc.)
- Conditional logic for showing/hiding fields
- Form validation rules
- Field ordering via drag and drop
```### Payment System

```
Task: Implement the payment system with Stripe integration for subscriptions and token purchases.

Expected output:
- Subscription plan management
- Token package purchasing
- Secure payment processing
- Receipt generation
- Payment history and reporting
- Automatic account provisioning
```# TextBlaster CRM LLM Development Guide

This document provides optimized instructions for AI agents to assist in developing the TextBlaster CRM application. It's structured to help with specific development tasks, code generation, and troubleshooting.

## Project Overview for AI Agents

TextBlaster CRM is a lightweight, modular CRM system with advanced messaging capabilities built with Next.js, Tailwind CSS, and Supabase. The application allows businesses to manage customer relationships, send individual and mass text messages, generate custom forms, and analyze customer interactions.

### Key Technologies

- **Frontend**: Next.js with App Router, React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, Auth, Storage, Realtime)
- **Messaging**: Twilio API integration
- **Data Handling**: TypeScript, React Query
- **PDF Generation**: React-PDF

## Development Tasks by Category

### Next.js Setup and Configuration

```
Task: Generate the basic configuration files for a Next.js 13+ project with App Router, TypeScript, and Tailwind CSS.

Expected output:
- next.config.js
- tsconfig.json
- tailwind.config.js
- postcss.config.js
- Required package.json dependencies
```

### Super Admin Dashboard

```
Task: Implement the super admin dashboard with complete access to all organizations, analytics, and administration functions.

Expected output:
- Authentication with MFA for super admin
- Organization management components
- Cross-organization analytics
- User management across organizations
- Token allocation management
- Audit logging and security monitoring
```

### Token System Implementation

```
Task: Create a token-based messaging system to control message volume and costs.

Expected output:
- Token balance tracking and display
- Token usage validation for mass messaging
- Token transaction history
- Token analytics and reporting
- Token allocation management for admin
```

### Error Handling and Logging System

```
Task: Implement a comprehensive error handling and logging system for the TextBlaster CRM application.

Expected output:
- Structured logger implementation
- Global error handling middleware
- React error boundary components
- Database schema for log storage
- Log viewer interface for super admin
- Error notification system
```

### Supabase Integration

```
Task: Create the Supabase client setup with authentication, database, and realtime subscriptions for the TextBlaster CRM.

Expected output:
- Supabase client configuration
- Database schema for users, organizations, clients, messages, forms, and form submissions
- Authentication setup with Row Level Security policies
- Realtime subscription setup for the messaging system
```

### Authentication System

```
Task: Implement a complete authentication flow with Supabase Auth for TextBlaster CRM.

Expected output:
- Login component
- Registration component
- Password reset flow
- Protected routes implementation
- User session management
```

### Messaging System

```
Task: Create the messaging system components for TextBlaster CRM including individual and mass text functionality integrated with Twilio.

Expected output:
- Conversation component
- Message input and display components
- Mass messaging interface
- Twilio integration for sending and receiving messages
- Message template system
```

### Client Database Management

```
Task: Implement the client database management components for TextBlaster CRM.

Expected output:
- Client listing with filtering and search
- Client profile view
- Client import functionality
- Client tagging system
- Interaction history display
```

### Form Builder System

```
Task: Create a dynamic form builder system for TextBlaster CRM that allows creating custom application forms for different business types.

Expected output:
- Form builder interface
- Dynamic form rendering components
- Form submission handling
- Form data storage
- JSON schema-based form definitions
```

### PDF Generation

```
Task: Implement PDF generation from form submissions in TextBlaster CRM.

Expected output:
- PDF template system
- Dynamic content generation from form data
- Download and sharing functionality
- React-PDF implementation
```

### Analytics Dashboard

```
Task: Create an analytics dashboard for TextBlaster CRM to track client engagement and messaging performance.

Expected output:
- Data visualization components
- Metrics calculation functions
- Dashboard layout
- Filtering and time range selection
```

## Code Generation Templates

### React Component Template

When asking for a React component, structure your request like this:

```
Component: [Name of Component]
Purpose: [What the component should do]
Props: [List of expected props]
Dependencies: [Required libraries or other components]
Special requirements: [Any specific behavior or styling needs]
```

### API Route Template

When asking for a Next.js API route, structure your request like this:

```
API Route: [Endpoint path]
Method: [HTTP method]
Purpose: [What the endpoint should do]
Input: [Expected request body/parameters]
Output: [Expected response format]
Authentication: [Authentication requirements]
```

### Database Query Template

When asking for database queries, structure your request like this:

```
Query purpose: [What the query should accomplish]
Tables involved: [List of database tables]
Conditions: [Any filters or conditions]
Output: [Expected result format]
Performance considerations: [Any optimization needs]
```

### Utility Function Template

When asking for utility functions, structure your request like this:

```
Function name: [Name of the function]
Purpose: [What the function should do]
Parameters: [Expected input parameters]
Return value: [Expected output]
Edge cases: [Specific situations to handle]
```

## Example Prompts for Key Features

### Super Admin Dashboard Example

```
Component: OrganizationManagement
Purpose: Allow super admin to view and manage all organizations in the system
Props:
- initialFilter: { status?: string, search?: string }
Dependencies:
- Supabase client for data fetching
- DataTable component for displaying organizations
- OrganizationModal for organization details
Special requirements:
- Filtering by status, creation date, subscription status
- Quick actions for token allocation
- Impersonation capability for support
- Detailed activity view for each organization
```

### Token System Example

```
Component: TokenManagement
Purpose: Display and manage message token balance, purchases, and usage
Props:
- organizationId: string
- isAdmin: boolean
Dependencies:
- TokenUsageChart for visualization
- TokenPackageList for purchase options
- TokenTransactionHistory for usage logs
Special requirements:
- Real-time token balance updates
- Usage projections based on history
- Low balance warnings
- One-click purchase flow for token packages
```

### Payment Integration Example

```
Component: SubscriptionCheckout
Purpose: Allow users to select and purchase a subscription plan
Props:
- organizationId: string
- availablePlans: SubscriptionPlan[]
- currentPlan?: SubscriptionPlan
Dependencies:
- Stripe Elements for secure payment
- PlanComparisonTable for plan visualization
- PaymentMethodSelector for payment options
Special requirements:
- Secure handling of payment information
- Clear presentation of plan benefits
- Support for discount codes
- Smooth transition to post-payment onboarding
```

### Messaging Component Example

```
Component: ConversationView
Purpose: Display a messaging conversation between a user and a client, with real-time updates
Props:
- clientId: string
- userId: string
Dependencies:
- Supabase client for realtime subscriptions
- MessageBubble component for rendering individual messages
Special requirements:
- Auto-scroll to newest messages
- Display typing indicator
- Show message status (sent, delivered, read)
- Support for loading previous messages when scrolling up
```

### Client Import Example

```
Function name: importClientsFromCSV
Purpose: Parse a CSV file containing client information and import it into the database
Parameters:
- file: File - The CSV file to import
- organizationId: string - The organization ID to associate clients with
- options: { checkDuplicates: boolean, sendWelcomeMessage: boolean }
Return value: { imported: number, duplicates: number, errors: number }
Edge cases:
- Handle malformed CSV data
- Detect and handle duplicate phone numbers
- Normalize phone numbers to standard format
- Validate email addresses
```

### Logging System Example

```
Component: LogViewer
Purpose: Allow super admins to explore system logs, diagnose errors, and monitor system health
Props:
- initialFilters: { level?: LogLevel[], category?: LogCategory[], timeRange?: [Date, Date] }
- defaultPageSize: number
Dependencies:
- LogFilterPanel for setting search criteria
- LogEntryTable for displaying log entries
- LogDetailView for examining specific log events
Special requirements:
- Real-time log updates for critical errors
- Advanced filtering capabilities
- JSON viewer for structured log data
- Stack trace visualization
- Export functionality for log data
```

## Troubleshooting Guidance

When helping with debugging, consider these common issues and their solutions:

### Logging and Error Handling Issues

- Check that error boundaries are properly implemented in React components
- Verify error middleware is correctly configured in Next.js routes
- Ensure database tables for logs are properly indexed for performance
- Check that log entries include sufficient context for debugging
- Verify error notifications are properly configured for critical errors

### Supabase Authentication Issues

- Check for correct API keys and URL in environment variables
- Verify Row Level Security policies are correctly configured
- Ensure JWT token handling is properly implemented
- Check for CORS issues when deployed

### Next.js App Router Issues

- Verify file naming conventions for pages and layouts
- Check for issues with nested layouts
- Ensure server components don't use client-side hooks
- Verify parallel routes are correctly configured

### Tailwind CSS Issues

- Ensure content paths are correctly configured in tailwind.config.js
- Check for proper class ordering with utilities like prettier-plugin-tailwindcss
- Verify component libraries are properly configured for Tailwind

### React Query Issues

- Check for proper cache invalidation
- Ensure query keys are correctly structured
- Verify error handling in mutation functions
- Check for race conditions in parallel queries

## Best Practices for TextBlaster CRM

When generating code or suggesting improvements, follow these best practices:

1. **TypeScript Strictness**: Use strict TypeScript with proper type definitions for all components and functions.

2. **Component Design**: Keep components focused and follow the single responsibility principle.

3. **Performance Optimization**:
   - Use React.memo for pure components
   - Implement virtualization for long lists
   - Optimize images and assets
   - Use proper React Query caching

4. **Security Practices**:
   - Sanitize all user inputs
   - Implement proper authentication checks
   - Use parameterized queries for database operations
   - Follow OWASP security guidelines

5. **Accessibility**:
   - Use semantic HTML elements
   - Include proper ARIA attributes
   - Ensure keyboard navigation
   - Maintain sufficient color contrast

6. **Responsive Design**:
   - Use Tailwind's responsive classes consistently
   - Test on multiple viewport sizes
   - Implement mobile-first design principles

7. **Error Handling**:
   - Implement proper error boundaries
   - Provide user-friendly error messages
   - Log errors for debugging
   - Handle network failures gracefully

## Implementation Examples

### Example: Super Admin Authorization

```typescript
// lib/auth/superAdminAuth.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Database } from '@/types/supabase';

export async function requireSuperAdmin() {
  const cookieStore = cookies();
  
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/super-admin/login');
  }
  
  // Verify user is super admin
  const { data: user, error } = await supabase
    .from('users')
    .select('role, is_mfa_enabled, mfa_verified_at')
    .eq('id', session.user.id)
    .single();
  
  if (error || !user || user.role !== 'super_admin') {
    redirect('/super-admin/login?error=unauthorized');
  }
  
  // Check MFA verification if enabled
  if (user.is_mfa_enabled) {
    const mfaVerifiedAt = user.mfa_verified_at ? new Date(user.mfa_verified_at) : null;
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
    
    if (!mfaVerifiedAt || mfaVerifiedAt < fourHoursAgo) {
      redirect('/super-admin/mfa-verify');
    }
  }
  
  // Log access
  await supabase.from('admin_audit_logs').insert({
    user_id: session.user.id,
    action: 'admin_access',
    resource: '/' + cookieStore.get('request_path')?.value || 'unknown',
    ip_address: cookieStore.get('client_ip')?.value || 'unknown',
    user_agent: cookieStore.get('user_agent')?.value || 'unknown'
  });
  
  return { supabase, user, session };
}
```

### Example: Token System Implementation

```typescript
// lib/tokens/tokenService.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

export class TokenService {
  private supabase;
  
  constructor(supabaseClient: ReturnType<typeof createClient<Database>>) {
    this.supabase = supabaseClient;
  }
  
  async getTokenBalance(organizationId: string): Promise<number> {
    const { data, error } = await this.supabase
      .from('organizations')
      .select('message_tokens')
      .eq('id', organizationId)
      .single();
      
    if (error) throw error;
    return data.message_tokens;
  }
  
  async validateTokensForMassMessage(
    organizationId: string, 
    recipientCount: number
  ): Promise<{ valid: boolean; balance: number; required: number }> {
    const balance = await this.getTokenBalance(organizationId);
    return {
      valid: balance >= recipientCount,
      balance,
      required: recipientCount
    };
  }
  
  async useTokens(
    organizationId: string,
    count: number,
    referenceId: string,
    referenceType: string,
    notes?: string
  ): Promise<{ success: boolean; newBalance: number }> {
    // Get current balance
    const balance = await this.getTokenBalance(organizationId);
    
    // Check if sufficient tokens
    if (balance < count) {
      throw new Error(`Insufficient tokens. Required: ${count}, Available: ${balance}`);
    }
    
    // Calculate new balance
    const newBalance = balance - count;
    
    // Start transaction
    const { data, error } = await this.supabase.rpc('use_tokens', {
      p_organization_id: organizationId,
      p_amount: count,
      p_new_balance: newBalance,
      p_reference_id: referenceId,
      p_reference_type: referenceType,
      p_notes: notes || 'Token usage'
    });
    
    if (error) throw error;
    
    return {
      success: true,
      newBalance
    };
  }
  
  async addTokens(
    organizationId: string,
    count: number,
    referenceId: string,
    referenceType: string,
    notes?: string
  ): Promise<{ success: boolean; newBalance: number }> {
    // Get current balance
    const balance = await this.getTokenBalance(organizationId);
    
    // Calculate new balance
    const newBalance = balance + count;
    
    // Start transaction
    const { data, error } = await this.supabase.rpc('add_tokens', {
      p_organization_id: organizationId,
      p_amount: count,
      p_new_balance: newBalance,
      p_reference_id: referenceId,
      p_reference_type: referenceType,
      p_notes: notes || 'Token purchase'
    });
    
    if (error) throw error;
    
    return {
      success: true,
      newBalance
    };
  }
  
  async getTokenTransactions(
    organizationId: string,
    limit = 50,
    offset = 0
  ) {
    const { data, error, count } = await this.supabase
      .from('token_transactions')
      .select('*', { count: 'exact' })
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
      
    if (error) throw error;
    
    return {
      transactions: data,
      total: count || 0
    };
  }
}
```

### Example: Payment Integration with Stripe

```typescript
// lib/payments/stripeService.ts
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

export class StripeService {
  private stripe: Stripe;
  private supabase;
  
  constructor(
    apiKey: string,
    supabaseClient: ReturnType<typeof createClient<Database>>
  ) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2023-10-16',
    });
    this.supabase = supabaseClient;
  }
  
  async createCheckoutSession({
    organizationId,
    customerId,
    mode,
    lineItems,
    successUrl,
    cancelUrl,
    metadata = {}
  }: {
    organizationId: string;
    customerId?: string;
    mode: 'payment' | 'subscription';
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }) {
    // Create or retrieve customer
    let customer: string | undefined = customerId;
    
    if (!customer) {
      const { data: org } = await this.supabase
        .from('organizations')
        .select('name, billing_email')
        .eq('id', organizationId)
        .single();
        
      // Create a customer in Stripe
      const stripeCustomer = await this.stripe.customers.create({
        email: org.billing_email,
        name: org.name,
        metadata: { organization_id: organizationId }
      });
      
      customer = stripeCustomer.id;
      
      // Save the customer ID
      await this.supabase
        .from('organizations')
        .update({ stripe_customer_id: customer })
        .eq('id', organizationId);
    }
    
    // Create the checkout session
    const session = await this.stripe.checkout.sessions.create({
      customer,
      mode,
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        organization_id: organizationId,
        ...metadata
      }
    });
    
    return session;
  }
  
  async handlePaymentSucceeded(event: Stripe.Event) {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const { metadata } = paymentIntent;
    
    if (!metadata?.organization_id) {
      throw new Error('Missing organization_id in metadata');
    }
    
    const organizationId = metadata.organization_id;
    
    // Create payment record
    const { data: payment, error } = await this.supabase
      .from('payments')
      .insert({
        organization_id: organizationId,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: 'completed',
        payment_method: paymentIntent.payment_method_types?.[0] || 'unknown',
        payment_processor: 'stripe',
        processor_payment_id: paymentIntent.id,
        item_type: metadata.item_type,
        item_id: metadata.item_id,
        receipt_url: null // Will be updated later
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Handle token package purchase
    if (metadata.item_type === 'token_package' && metadata.token_count) {
      const tokenCount = parseInt(metadata.token_count, 10);
      
      // Add tokens to organization
      await this.supabase.rpc('add_tokens', {
        p_organization_id: organizationId,
        p_amount: tokenCount,
        p_reference_id: payment.id,
        p_reference_type: 'payment',
        p_notes: `Purchased ${tokenCount} tokens`
      });
    }
    
    return payment;
  }
  
  async handleSubscriptionCreated(event: Stripe.Event) {
    const subscription = event.data.object as Stripe.Subscription;
    const { customer, metadata } = subscription;
    
    if (!metadata?.organization_id) {
      // Find organization by customer ID
      const { data: org } = await this.supabase
        .from('organizations')
        .select('id')
        .eq('stripe_customer_id', customer)
        .single();
        
      if (!org) throw new Error('Organization not found');
      
      metadata.organization_id = org.id;
    }
    
    const organizationId = metadata.organization_id;
    
    // Update organization subscription
    await this.supabase
      .from('organizations')
      .update({
        subscription_id: subscription.id,
        subscription_status: subscription.status,
        subscription_plan_id: metadata.plan_id,
        subscription_created_at: new Date().toISOString(),
        subscription_expires_at: new Date(subscription.current_period_end * 1000).toISOString()
      })
      .eq('id', organizationId);
      
    // Add included tokens if applicable
    if (metadata.included_tokens) {
      const tokenCount = parseInt(metadata.included_tokens, 10);
      
      await this.supabase.rpc('add_tokens', {
        p_organization_id: organizationId,
        p_amount: tokenCount,
        p_reference_id: subscription.id,
        p_reference_type: 'subscription',
        p_notes: `Included ${tokenCount} tokens with subscription`
      });
    }
  }
}
```

## Example Error Handling Implementation

```typescript
// Example of API route with robust error handling
// app/api/tokens/allocate/route.ts

import { NextRequest } from 'next/server';
import { getServerLogger, LogCategory } from '@/lib/logging/logger';
import { handleApiError } from '@/app/api/error-handler';
import { getServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    // Get logger and set request context
    const logger = await getServerLogger();
    logger.setContext({
      endpoint: 'tokens/allocate',
      requestId: req.headers.get('x-request-id') || undefined
    });
    
    // Log request received
    logger.info('Token allocation request received', undefined, LogCategory.TOKENS);
    
    // Parse request body
    const { organizationId, amount, reason } = await req.json();
    
    // Validate inputs
    if (!organizationId) {
      return handleApiError(req, 'Missing organization ID', 400, 'Organization ID is required');
    }
    
    if (typeof amount !== 'number' || amount === 0) {
      return handleApiError(req, `Invalid amount: ${amount}`, 400, 'Amount must be a non-zero number');
    }
    
    // Get supabase client
    const supabase = await getServerSupabaseClient();
    
    // Get current organization token balance
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('message_tokens')
      .eq('id', organizationId)
      .single();
      
    if (orgError) {
      return handleApiError(
        req, 
        orgError, 
        404, 
        'Organization not found'
      );
    }
    
    // Calculate new balance
    const newBalance = org.message_tokens + amount;
    
    // Prevent negative balance
    if (newBalance < 0) {
      return handleApiError(
        req,
        `Insufficient tokens. Current: ${org.message_tokens}, Requested change: ${amount}`,
        400,
        'Insufficient tokens for this operation'
      );
    }
    
    // Update token balance and record transaction
    try {
      const result = await supabase.rpc('update_token_balance', {
        p_organization_id: organizationId,
        p_amount: amount,
        p_new_balance: newBalance,
        p_reason: reason || (amount > 0 ? 'Manual allocation' : 'Manual deduction')
      });
      
      if (result.error) throw result.error;
      
      // Log successful operation
      logger.info(
        `Token balance updated for organization ${organizationId}`,
        {
          previousBalance: org.message_tokens,
          change: amount,
          newBalance,
          reason
        },
        LogCategory.TOKENS
      );
      
      // Return success response
      return Response.json({
        success: true,
        previousBalance: org.message_tokens,
        change: amount,
        newBalance
      });
    } catch (dbError) {
      // Handle database errors
      return handleApiError(
        req,
        dbError,
        500,
        'Failed to update token balance'
      );
    }
  } catch (error) {
    // Catch all unexpected errors
    return handleApiError(req, error);
  }
}
```

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Create a supabase client with the user's session for server components
export async function getServerSupabaseClient() {
  const { cookies } = await import('next/headers');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  const cookieStore = cookies();
  
  return createClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}
```

### Example: Client Component with Supabase Realtime

```typescript
// components/messaging/Conversation.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Message } from '@/types/messages';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

interface ConversationProps {
  clientId: string;
  userId: string;
}

export default function Conversation({ clientId, userId }: ConversationProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial messages
  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: true })
        .limit(50);
        
      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data || []);
      }
      
      setLoading(false);
    }
    
    fetchMessages();
  }, [clientId]);
  
  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`client-messages-${clientId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `client_id=eq.${clientId}` 
        }, 
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [clientId]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending a new message
  const handleSendMessage = async (content: string) => {
    const newMessage = {
      client_id: clientId,
      user_id: userId,
      content,
      direction: 'outbound',
      status: 'pending'
    };
    
    const { data, error } = await supabase
      .from('messages')
      .insert(newMessage)
      .select()
      .single();
      
    if (error) {
      console.error('Error sending message:', error);
    }
    
    // Actual SMS sending would be handled by a server function
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center p-4">
            <span className="animate-spin h-6 w-6 border-4 border-blue-500 rounded-full border-t-transparent"></span>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOutbound={message.direction === 'outbound'}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
```

## Final Development Notes

1. The core feature set should be completed first before adding advanced features.

2. Follow incremental development patterns - get a minimal viable product working and then enhance it.

3. When requesting help on specific features, provide context about:
   - How it fits into the overall application
   - What components it interacts with
   - Any specific requirements or constraints

4. When facing issues, provide:
   - Clear error messages
   - Relevant code snippets
   - Steps to reproduce the problem
   - Expected vs. actual behavior

5. The project has a 2-3 week timeline, so focus on maintainability and clean architecture rather than premature optimization.
