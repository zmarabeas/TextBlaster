import { useState, useEffect, useRef } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getInitials, formatTime } from '@/lib/utils';
import { Client } from '@shared/schema';

interface MessageViewProps {
  client: Client;
}

export default function MessageView({ client }: MessageViewProps) {
  const [message, setMessage] = useState('');
  const { getClientMessages, sendMessage } = useMessages();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get client messages
  const { data: messages = [], isLoading, refetch } = getClientMessages(client?.id);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !client) return;
    
    await sendMessage.mutateAsync({
      clientId: client.id,
      content: message,
      direction: 'outbound',
      status: 'sent'
    });
    
    setMessage('');
    refetch();
  };

  if (!client) {
    return (
      <div className="h-96 flex items-center justify-center">
        <p className="text-neutral-500">Select a client to start messaging</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-neutral-200 shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
        <div className="flex items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={`${client.firstName} ${client.lastName}`} />
            <AvatarFallback>
              {getInitials(`${client.firstName} ${client.lastName}`)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <h2 className="font-display font-semibold text-lg text-secondary">
              {client.firstName} {client.lastName}
            </h2>
            <p className="text-xs text-neutral-500">
              {client.phone}
            </p>
          </div>
        </div>
        <div className="flex">
          <Button variant="ghost" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </Button>
          <Button variant="ghost" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </Button>
        </div>
      </div>
      
      <div className="h-96 overflow-y-auto p-4 bg-neutral-50 flex flex-col space-y-3">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-neutral-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end ${
                msg.direction === 'outbound' ? 'justify-end' : ''
              }`}
            >
              {msg.direction === 'inbound' && (
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="" alt={`${client.firstName} ${client.lastName}`} />
                  <AvatarFallback>
                    {getInitials(`${client.firstName} ${client.lastName}`)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`p-3 max-w-xs ${
                  msg.direction === 'outbound'
                    ? 'bg-accent text-white message-bubble-out'
                    : 'bg-neutral-100 text-secondary message-bubble-in'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
              <span className="text-xs text-neutral-500 mx-2">
                {formatTime(msg.sentAt)}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-200">
        <div className="flex items-center">
          <Button type="button" variant="ghost" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </Button>
          <Input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border-0 focus-visible:ring-0 text-sm text-secondary"
          />
          <Button 
            type="submit"
            size="icon"
            disabled={sendMessage.isPending || !message.trim()}
            className="ml-2 bg-accent text-white rounded-full hover:bg-accent/90"
          >
            {sendMessage.isPending ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
