import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth.jsx';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import textBlastLogo from '@assets/TEXT_BLAST_LOGO.png';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="md:hidden bg-background border-b border-border z-10">
      <div className="flex items-center justify-between p-4">
        <a href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img src={textBlastLogo} alt="TextBlaster Logo" className="h-8 w-8" />
          <h1 className="font-display font-bold text-xl ml-2 text-foreground">TextBlaster</h1>
        </a>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <button 
            className="text-foreground focus:outline-none" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
          <a 
            href="/" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location === '/' 
                ? 'bg-accent text-accent-foreground' 
                : 'text-foreground hover:bg-muted'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </a>
          <a 
            href="/clients" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location === '/clients' 
                ? 'bg-accent text-accent-foreground' 
                : 'text-foreground hover:bg-muted'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Clients
          </a>
          <a 
            href="/messages" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location === '/messages' 
                ? 'bg-accent text-accent-foreground' 
                : 'text-foreground hover:bg-muted'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Messages
          </a>
          <a 
            href="/analytics" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location === '/analytics' 
                ? 'bg-accent text-accent-foreground' 
                : 'text-foreground hover:bg-muted'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Analytics
          </a>
          <a 
            href="/settings" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location === '/settings' 
                ? 'bg-accent text-accent-foreground' 
                : 'text-foreground hover:bg-muted'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Settings
          </a>
          <div className="pt-4 pb-3 border-t border-border">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                  {user?.fullName ? user.fullName.charAt(0) : "U"}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-foreground">{user?.fullName}</div>
                <div className="text-sm font-medium text-muted-foreground">{user?.email}</div>
              </div>
            </div>
            <div className="mt-3 px-2">
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="block w-full px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}