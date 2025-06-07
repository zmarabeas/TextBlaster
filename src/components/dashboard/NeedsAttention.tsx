import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials, formatLastContactDays, daysSinceLastContact } from '@/lib/utils';
import { useLocation } from "wouter";

export default function NeedsAttention() {
  const [, setLocation] = useLocation();
  
  // Get analytics data including clients needing attention
  const { data, isLoading } = useQuery({
    queryKey: ['/api/analytics/dashboard'],
  });
  
  const clientsNeedingAttention = data?.clientsNeedingAttention || [];

  return (
    <div className="bg-card rounded-lg border border-border shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex justify-between items-center">
        <h2 className="font-display font-semibold text-lg text-foreground">Needs Attention</h2>
        <a href="/clients" className="text-primary text-sm font-medium hover:text-primary/80">View All</a>
      </div>
      <div className="overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center text-muted-foreground">Loading clients that need attention...</div>
        ) : clientsNeedingAttention.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No clients need attention right now. Great job!
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {clientsNeedingAttention.map((client) => (
              <li key={client.id} className="px-6 py-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={`${client.firstName} ${client.lastName}`} />
                    <AvatarFallback>
                      {getInitials(`${client.firstName} ${client.lastName}`)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {client.firstName} {client.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last contact: {formatLastContactDays(daysSinceLastContact(client.lastContactedAt))}
                    </p>
                  </div>
                  <div>
                    <Button 
                      size="icon"
                      className="rounded-full h-8 w-8 p-1"
                      onClick={() => setLocation(`/messages?client=${client.id}`)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
