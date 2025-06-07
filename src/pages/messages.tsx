import { useState, useEffect } from 'react';
import { useClients } from '@/hooks/useClients';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageView from '@/components/messaging/MessageView';
import SendMassMessage from '@/components/messaging/SendMassMessage';
import { getInitials, timeAgo } from '@/lib/utils';
import { useMessages } from '@/hooks/useMessages';

export default function Messages() {
  const [search, setSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [showMassMessage, setShowMassMessage] = useState(false);
  const { clients, isLoading } = useClients();
  const { recentConversations } = useMessages();

  // Handle query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const clientId = params.get('client');
    if (clientId) {
      setSelectedClientId(parseInt(clientId));
    }
  }, []);

  // Find selected client
  const selectedClient = clients.find(client => client.id === selectedClientId);

  // Combine clients with recent conversations for display
  const clientsWithConversations = clients.map(client => {
    const conversation = recentConversations.find(conv => conv.client.id === client.id);
    return {
      ...client,
      lastMessage: conversation?.message,
    };
  });

  // Sort by last message date (recent first)
  const sortedClients = [...clientsWithConversations].sort((a, b) => {
    if (a.lastMessage && b.lastMessage) {
      return new Date(b.lastMessage.sentAt).getTime() - new Date(a.lastMessage.sentAt).getTime();
    }
    if (a.lastMessage) return -1;
    if (b.lastMessage) return 1;
    return 0;
  });

  // Filter clients based on search
  const filteredClients = sortedClients.filter(client => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    const searchTerm = search.toLowerCase();
    return fullName.includes(searchTerm);
  });

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">Messages</h1>
            <p className="mt-1 text-muted-foreground">Send and receive messages from your clients.</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button onClick={() => setShowMassMessage(true)}>
              <Users className="h-4 w-4 mr-2" />
              Send Mass Message
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Clients sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border shadow-card overflow-hidden">
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search clients..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="h-[600px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : filteredClients.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No clients found. Add clients to start messaging!
                  </div>
                ) : (
                  <ul className="divide-y divide-border">
                    {filteredClients.map(client => (
                      <li 
                        key={client.id}
                        className={`hover:bg-muted/50 transition-colors cursor-pointer ${
                          selectedClientId === client.id ? 'bg-muted' : ''
                        }`}
                        onClick={() => setSelectedClientId(client.id)}
                      >
                        <div className="p-4 flex items-start">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="" alt={`${client.firstName} ${client.lastName}`} />
                            <AvatarFallback>
                              {getInitials(`${client.firstName} ${client.lastName}`)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium text-foreground truncate">
                                {client.firstName} {client.lastName}
                              </p>
                              {client.lastMessage && (
                                <p className="text-xs text-muted-foreground">
                                  {timeAgo(client.lastMessage.sentAt)}
                                </p>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {client.lastMessage ? (
                                client.lastMessage.content
                              ) : (
                                'No messages yet'
                              )}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Messaging area */}
          <div className="lg:col-span-2">
            {selectedClient ? (
              <MessageView client={selectedClient} />
            ) : (
              <div className="h-[600px] bg-card rounded-lg border border-border shadow-card flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="mx-auto w-16 h-16 bg-muted flex items-center justify-center rounded-full mb-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                    Select a client to start messaging
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Click on a client from the list on the left to view your conversation history and send messages.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mass Message Modal */}
        <SendMassMessage open={showMassMessage} onOpenChange={setShowMassMessage} />
      </div>
    </div>
  );
}
