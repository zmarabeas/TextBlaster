# TextBlaster CRM

A lightweight, human-centered CRM with simple messaging capabilities designed for small businesses to maintain personal connections with clients.

## Overview

TextBlaster CRM helps small businesses manage client relationships through an intuitive interface and straightforward messaging tools. The system focuses on what matters most - maintaining personal connections with clients without complex features or steep learning curves.

## Core Features

- **Simple Client Management**: Store essential contact information with easy lookup
- **Direct Messaging**: Send individual and mass text messages with minimal clicks
- **Client Conversation History**: View complete messaging history with each client
- **Basic Tagging**: Organize clients with a simple tagging system
- **Message Templates**: Save and reuse common responses
- **Message Credits**: Purchase credits as needed for messaging
- **Essential Analytics**: See who needs attention and basic engagement metrics
- **Mobile-Friendly Design**: Access the system from anywhere

## Technology Stack

- **Frontend**: Next.js with Tailwind CSS
- **Backend**: Next.js API routes with Supabase
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Simple email/password login
- **Messaging**: Twilio API integration

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Supabase account
- Twilio account for SMS functionality

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/textblaster-crm.git
   cd textblaster-crm
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   TWILIO_ACCOUNT_SID=your-twilio-sid
   TWILIO_AUTH_TOKEN=your-twilio-auth-token
   TWILIO_PHONE_NUMBER=your-twilio-phone-number
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Simplicity First

TextBlaster CRM is designed with a "simplicity first" philosophy:

- **Minimal Learning Curve**: Get started in minutes, not days
- **Focus on Conversations**: Keeps client communications front and center
- **Essential Features Only**: Avoids bloat and complexity
- **Speed**: Complete common tasks with minimal clicks

## Documentation

- [Requirements Documentation](./docs/Requirements.md)
- [Implementation Guide](./docs/Implementation-Guide.md)
- [Project Structure](./docs/Project-Structure.md)
- [Tasks List](./docs/Tasks.md)
