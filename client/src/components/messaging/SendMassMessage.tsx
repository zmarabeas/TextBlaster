import { useState } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { useClients } from '@/hooks/useClients';
import { useCredits } from '@/hooks/useCredits';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { replaceTemplateVariables } from '@/lib/twilio';
import BatchMessageProgress from './BatchMessageProgress';

interface SendMassMessageProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SendMassMessage({ open, onOpenChange }: SendMassMessageProps) {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('none');
  const [messageContent, setMessageContent] = useState<string>('');
  const [currentBatchId, setCurrentBatchId] = useState<string | null>(null);
  const [showProgress, setShowProgress] = useState<boolean>(false);
  
  const { clients } = useClients();
  const { templates, sendMassMessage } = useMessages();
  const { credits } = useCredits();
  const { toast } = useToast();
  
  // Get unique client tags
  const allTags = clients.reduce((tags: string[], client) => {
    if (client.tags) {
      client.tags.forEach(tag => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    }
    return tags;
  }, []);
  
  // Filter clients by selected tag
  const getFilteredClientIds = () => {
    if (selectedTag === 'all') {
      return clients.map(client => client.id);
    }
    
    return clients
      .filter(client => client.tags && client.tags.includes(selectedTag))
      .map(client => client.id);
  };
  
  const filteredClientIds = getFilteredClientIds();
  const estimatedCreditUsage = filteredClientIds.length;
  
  // Handle template selection
  const handleTemplateChange = (value: string) => {
    setSelectedTemplateId(value);
    if (value === 'none') {
      setMessageContent('');
    } else {
      const selectedTemplate = templates.find(t => t.id.toString() === value);
      if (selectedTemplate) {
        setMessageContent(selectedTemplate.content);
      }
    }
  };
  
  // Handle send mass message
  const handleSendMassMessage = async () => {
    if (!messageContent.trim() || filteredClientIds.length === 0) return;
    
    try {
      const response = await sendMassMessage.mutateAsync({
        clientIds: filteredClientIds,
        content: messageContent
      });
      
      if (response.batchId) {
        setCurrentBatchId(response.batchId);
        setShowProgress(true);
        toast({
          title: "Messages queued",
          description: `Sending ${filteredClientIds.length} message(s). You can track progress here.`,
        });
      } else {
        // Reset form and close dialog
        onOpenChange(false);
        setSelectedTag('all');
        setSelectedTemplateId('none');
        setMessageContent('');
      }
    } catch (error: any) {
      toast({
        title: "Error sending messages",
        description: error.message || "An error occurred while sending messages",
        variant: "destructive",
      });
    }
  };
  
  // Handle batch progress complete
  const handleProgressComplete = () => {
    toast({
      title: "Messages sent",
      description: "All messages have been processed.",
    });
    setShowProgress(false);
    
    // Reset form and close dialog
    setSelectedTag('all');
    setSelectedTemplateId('none');
    setMessageContent('');
  };
  
  // Check if we have enough credits
  const insufficientCredits = credits < estimatedCreditUsage;

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!value && !showProgress) {
        onOpenChange(false);
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <div className="mr-2 flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            {showProgress ? 'Message Progress' : 'Send Mass Message'}
          </DialogTitle>
          <DialogDescription>
            {showProgress 
              ? 'Track the progress of your message batch below.' 
              : 'Send a message to multiple clients at once. Select clients by tags or individually.'
            }
          </DialogDescription>
        </DialogHeader>
        
        {showProgress && currentBatchId ? (
          <div className="py-4">
            <BatchMessageProgress 
              batchId={currentBatchId}
              onComplete={handleProgressComplete}
            />
            
            <div className="mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowProgress(false);
                  onOpenChange(false);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="client-tags">Client Tags</Label>
                <Select
                  value={selectedTag}
                  onValueChange={setSelectedTag}
                >
                  <SelectTrigger id="client-tags">
                    <SelectValue placeholder="Select client tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients ({clients.length})</SelectItem>
                    {allTags.map(tag => (
                      <SelectItem key={tag} value={tag}>
                        {tag} ({clients.filter(c => c.tags && c.tags.includes(tag)).length})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="message-template">Message Template</Label>
                <Select
                  value={selectedTemplateId}
                  onValueChange={handleTemplateChange}
                >
                  <SelectTrigger id="message-template">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No template</SelectItem>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id.toString()}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Type your message here..."
                />
                <p className="text-sm text-neutral-500">
                  Available variables: {'{first_name}'}, {'{last_name}'}
                </p>
              </div>
              
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-secondary">Estimated Credit Usage</span>
                  <span className="font-display font-semibold text-secondary">{estimatedCreditUsage} credits</span>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm font-medium text-secondary">Recipients</span>
                  <span className="font-display font-semibold text-secondary">{filteredClientIds.length} clients</span>
                </div>
                {insufficientCredits && (
                  <div className="mt-2 text-error text-sm font-medium">
                    You don't have enough credits. Please purchase more.
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMassMessage}
                disabled={
                  sendMassMessage.isPending || 
                  !messageContent.trim() || 
                  filteredClientIds.length === 0 ||
                  insufficientCredits
                }
              >
                {sendMassMessage.isPending ? 'Sending...' : 'Send Message'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
