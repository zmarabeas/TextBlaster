import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth.jsx';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { getInitials } from "@/lib/utils";
import textBlastLogo from '@assets/TEXT_BLAST_LOGO.png';

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow bg-background border-r border-border pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center justify-between flex-shrink-0 px-4 mb-5">
          <a href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img src={textBlastLogo} alt="TextBlaster Logo" className="h-10 w-10" />
            <h1 className="font-display font-bold text-xl ml-2 text-foreground">TextBlaster</h1>
          </a>
          <ThemeToggle />
        </div>
        <nav className="mt-5 flex-1 px-4 space-y-1">
          <a 
            href="/" 
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              location === '/' 
                ? 'bg-accent text-accent-foreground' 
                : 'text-foreground hover:bg-muted'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </a>
          <a 
            href="/clients" 
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              location === '/clients' 
                ? 'bg-accent text-accent-foreground' 
                : 'text-foreground hover:bg-muted'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Clients
          </a>
          <a 
            href="/messages" 
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              location === '/messages' 
                ? 'bg-accent text-accent-foreground' 
                : 'text-foreground hover:bg-muted'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Messages
          </a>
          <a 
            href="/analytics" 
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              location === '/analytics' 
                ? 'bg-accent text-accent-foreground' 
                : 'text-foreground hover:bg-muted'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </a>
          <a 
            href="/settings" 
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
              location === '/settings' 
                ? 'bg-accent text-accent-foreground' 
                : 'text-foreground hover:bg-muted'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </a>
        </nav>
        <div className="flex-shrink-0 flex border-t border-border p-4">
          <div className="flex-shrink-0 group block w-full">
            <div className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src="" alt={user?.fullName || "User"} />
                <AvatarFallback>{getInitials(user?.fullName || "")}</AvatarFallback>
              </Avatar>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-foreground">{user?.fullName}</p>
                <p className="text-xs font-medium text-muted-foreground">{user?.subscriptionTier === 'free' ? 'Free Plan' : 'Premium Plan'}</p>
              </div>
              <button 
                onClick={() => logout()}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
