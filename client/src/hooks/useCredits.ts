import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { CreditTransaction } from '@shared/schema';

export function useCredits() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get credit balance
  const { 
    data: creditsData, 
    isLoading: creditsLoading 
  } = useQuery<{ credits: number }>({
    queryKey: ['/api/credits'],
  });
  
  const credits = creditsData?.credits || 0;

  // Get credit transactions
  const { 
    data: transactions = [], 
    isLoading: transactionsLoading 
  } = useQuery<CreditTransaction[]>({
    queryKey: ['/api/credit-transactions'],
  });

  // Add credits mutation (for development/testing only)
  const addCredits = useMutation({
    mutationFn: async (amount: number) => {
      const res = await apiRequest('POST', '/api/credits/add', { amount });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/credits'] });
      queryClient.invalidateQueries({ queryKey: ['/api/credit-transactions'] });
      toast({
        title: 'Credits added',
        description: 'Your message credits have been added successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to add credits',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    },
  });

  // Helper to estimate messages remaining based on credit balance
  const estimateMessagesRemaining = () => {
    // 1 credit = 1 message
    return credits;
  };

  return {
    credits,
    creditsLoading,
    transactions,
    transactionsLoading,
    addCredits,
    estimateMessagesRemaining,
  };
}
