import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Client, InsertClient } from '@shared/schema';

export function useClients() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get all clients
  const { 
    data: clients = [], 
    isLoading,
    error,
    refetch
  } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });
  
  // Function to manually refresh clients
  const refreshClients = () => refetch();

  // Create client mutation
  const createClient = useMutation({
    mutationFn: async (client: Omit<InsertClient, 'userId'>) => {
      const res = await apiRequest('POST', '/api/clients', client);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      toast({
        title: 'Client created',
        description: 'The client has been added successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create client',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    },
  });

  // Update client mutation
  const updateClient = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Client> }) => {
      const res = await apiRequest('PUT', `/api/clients/${id}`, data);
      return res.json();
    },
    onSuccess: (updatedClient) => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      toast({
        title: 'Client updated',
        description: 'The client information has been updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update client',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    },
  });

  // Delete client mutation
  const deleteClient = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/clients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      toast({
        title: 'Client deleted',
        description: 'The client has been removed successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to delete client',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    },
  });

  // Get client by id
  const getClient = (id: number) => {
    return useQuery<Client>({
      queryKey: [`/api/clients/${id}`],
      enabled: !!id,
    });
  };

  return {
    clients,
    isLoading,
    error,
    createClient,
    updateClient,
    deleteClient,
    getClient,
    refreshClients,
  };
}
