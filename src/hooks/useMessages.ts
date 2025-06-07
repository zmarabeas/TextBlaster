import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Message, InsertMessage, MessageTemplate } from '@shared/schema';

export function useMessages() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get messages for a client
  const getClientMessages = (clientId: number | null) => {
    return useQuery<Message[]>({
      queryKey: [`/api/clients/${clientId}/messages`],
      enabled: !!clientId,
    });
  };

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (messageData: Omit<InsertMessage, 'userId'>) => {
      const res = await apiRequest('POST', '/api/messages', messageData);
      return res.json();
    },
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${message.clientId}/messages`] });
      queryClient.invalidateQueries({ queryKey: ['/api/recent-conversations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/credits'] });
      toast({
        title: 'Message sent',
        description: 'Your message has been sent successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to send message',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    },
  });

  // Get message templates
  const { 
    data: templates = [], 
    isLoading: templatesLoading 
  } = useQuery<MessageTemplate[]>({
    queryKey: ['/api/message-templates'],
  });

  // Create message template mutation
  const createTemplate = useMutation({
    mutationFn: async (template: Omit<MessageTemplate, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      const res = await apiRequest('POST', '/api/message-templates', template);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/message-templates'] });
      toast({
        title: 'Template created',
        description: 'Your message template has been saved.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create template',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    },
  });

  // Send mass message mutation
  const sendMassMessage = useMutation({
    mutationFn: async ({ clientIds, content }: { clientIds: number[]; content: string }) => {
      const res = await apiRequest('POST', '/api/mass-messages', { clientIds, content });
      return res.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recent-conversations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/credits'] });
      toast({
        title: 'Mass message sent',
        description: `Successfully sent to ${result.sent} clients.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to send mass message',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    },
  });

  // Get recent conversations
  const { 
    data: recentConversations = [], 
    isLoading: conversationsLoading 
  } = useQuery({
    queryKey: ['/api/recent-conversations'],
  });

  // Get batch message status
  const getBatchStatus = async (batchId: string) => {
    try {
      const res = await apiRequest('GET', `/api/message-batches/${batchId}/status`);
      return res.json();
    } catch (error: any) {
      console.error('Failed to fetch batch status:', error);
      throw new Error(error.message || 'Failed to fetch batch status');
    }
  };

  return {
    getClientMessages,
    sendMessage,
    templates,
    templatesLoading,
    createTemplate,
    sendMassMessage,
    recentConversations,
    conversationsLoading,
    getBatchStatus
  };
}
