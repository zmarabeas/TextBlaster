import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth.jsx';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      setLocation('/login');
    }
  }, [user, isLoading, setLocation]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not authenticated, don't render anything
  if (!user) {
    return null;
  }

  // If authenticated, render the layout with children
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile top navigation */}
      <MobileNav />
      
      {/* Desktop sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
