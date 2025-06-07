import { useMessages } from '@/hooks/useMessages';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { timeAgo, truncate, getInitials } from '@/lib/utils';

export default function RecentConversations() {
  const { recentConversations, conversationsLoading } = useMessages();

  return (
    <div className="bg-card rounded-lg border border-border shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex justify-between items-center">
        <h2 className="font-display font-semibold text-lg text-foreground">Recent Conversations</h2>
        <a href="/messages" className="text-primary text-sm font-medium hover:text-primary/80">View All</a>
      </div>
      <div className="overflow-hidden">
        {conversationsLoading ? (
          <div className="p-6 text-center text-muted-foreground">Loading recent conversations...</div>
        ) : recentConversations.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No conversations yet. Start messaging your clients!
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {recentConversations.map((item) => (
              <li key={`${item.client.id}-${item.message.id}`} className="px-6 py-4 hover:bg-muted/50 transition-colors">
                <a href={`/messages?client=${item.client.id}`} className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={`${item.client.firstName} ${item.client.lastName}`} />
                    <AvatarFallback>
                      {getInitials(`${item.client.firstName} ${item.client.lastName}`)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.client.firstName} {item.client.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {timeAgo(item.message.sentAt)}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {truncate(item.message.content, 60)}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
