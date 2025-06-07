# Quick Deployment Guide for TextBlaster

## Files Ready for GitHub

Your project is now ready for deployment! Here's what I've prepared:

✅ **vercel.json** - Vercel deployment configuration
✅ **.gitignore** - Excludes node_modules, .env, and build files  
✅ **README.md** - Complete documentation with setup instructions

## Steps to Deploy

### 1. Create GitHub Repository
```bash
git init
git add .
git commit -m "Initial commit - TextBlaster CRM"
git branch -M main
git remote add origin https://github.com/yourusername/textblaster-crm.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project" 
3. Import your GitHub repository
4. Vercel will auto-detect the settings from vercel.json

### 3. Set Environment Variables in Vercel
In your Vercel project dashboard, add these environment variables:

**Database:**
- `DATABASE_URL` - Your Supabase PostgreSQL connection string

**Stripe Payments:**
- `STRIPE_SECRET_KEY` - From Stripe Dashboard (starts with sk_)
- `VITE_STRIPE_PUBLIC_KEY` - From Stripe Dashboard (starts with pk_)

**Twilio SMS:**
- `TWILIO_ACCOUNT_SID` - From Twilio Console
- `TWILIO_AUTH_TOKEN` - From Twilio Console  
- `TWILIO_PHONE_NUMBER` - Your Twilio phone number

**Session Security:**
- `SESSION_SECRET` - Generate a random 32+ character string

### 4. Database Setup
Your Supabase database will automatically initialize on first deployment. The application creates all necessary tables automatically.

### 5. Domain (Optional)
Add your custom domain in Vercel project settings if desired.

## Environment Variable Sources

**Supabase Database:**
1. Create project at [supabase.com](https://supabase.com)
2. Go to Settings → Database
3. Copy connection string and replace [YOUR-PASSWORD]

**Stripe Keys:**
1. Dashboard at [dashboard.stripe.com](https://dashboard.stripe.com)
2. Get keys from Developers → API keys

**Twilio Credentials:**
1. Console at [console.twilio.com](https://console.twilio.com)
2. Account SID and Auth Token from dashboard
3. Phone number from Phone Numbers section

## Ready to Deploy!

Once you push to GitHub and set up the environment variables in Vercel, your TextBlaster CRM will be live and ready for production use.