import { useQuery } from '@tanstack/react-query';
import { useCredits } from '@/hooks/useCredits';
import { Button } from "@/components/ui/button";
import StatCard from '@/components/dashboard/StatCard';
import CreditStatus from '@/components/dashboard/CreditStatus';
import RecentConversations from '@/components/dashboard/RecentConversations';
import NeedsAttention from '@/components/dashboard/NeedsAttention';
import { useAuth } from '@/hooks/useAuth';
import { Users, MessageSquare, BarChart3 } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  
  // Get analytics data
  const { data, isLoading } = useQuery({
    queryKey: ['/api/analytics/dashboard'],
  });
  
  const stats = data?.stats || {
    clientCount: 0,
    messageSent: 0,
    responseRate: '0%',
    credits: 0
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
              Welcome Back, {user?.fullName?.split(' ')[0] || 'User'}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Here's what's happening with your clients today.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              className="flex items-center"
              onClick={() => window.location.href = "/clients?import=true"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Import Clients
            </Button>
            <Button 
              className="flex items-center"
              onClick={() => window.location.href = "/clients?new=true"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Client
            </Button>
          </div>
        </div>

        {/* Credit Status Section */}
        <CreditStatus />

        {/* Dashboard Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total Clients" 
            value={isLoading ? '...' : stats.clientCount}
            icon={<Users className="h-6 w-6 text-primary" />}
            iconColor="primary"
          />
          
          <StatCard 
            title="Messages Sent" 
            value={isLoading ? '...' : stats.messageSent}
            icon={<MessageSquare className="h-6 w-6 text-accent" />}
            iconColor="accent"
          />
          
          <StatCard 
            title="Response Rate" 
            value={isLoading ? '...' : stats.responseRate}
            icon={<BarChart3 className="h-6 w-6 text-tertiary" />}
            iconColor="tertiary"
          />
        </div>

        {/* Recent Messages & Clients */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RecentConversations />
          <NeedsAttention />
        </div>
      </div>
    </div>
  );
}
