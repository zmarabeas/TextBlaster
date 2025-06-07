import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Client } from "@shared/schema";

interface TestMessageButtonProps {
  client: Client;
  onSuccess?: () => void;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export default function TestMessageButton({ client, onSuccess, size = 'default', variant = 'outline' }: TestMessageButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const { toast } = useToast();

  const handleSendTestMessage = async () => {
    if (!messageContent.trim()) {
      toast({
        title: 'Message Required',
        description: 'Please enter a message to send.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSending(true);
      
      const response = await apiRequest('POST', '/api/messages/test', {
        clientId: client.id,
        content: messageContent,
        direction: 'outbound',
        status: 'queued'
      });

      const data = await response.json();

      toast({
        title: 'Test Message Sent',
        description: 'Test message has been sent successfully. A simulated response may arrive shortly.',
      });

      setIsOpen(false);
      setMessageContent('');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: 'Error Sending Message',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Button 
        size={size}
        variant={variant}
        className="flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="h-4 w-4" />
        <span>Test Message</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Test Message</DialogTitle>
            <DialogDescription>
              Send a test message to {client.firstName} {client.lastName} without using Twilio credits.
              This will simulate a message and may generate an automatic reply.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your message here..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleSendTestMessage}
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Test Message'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}