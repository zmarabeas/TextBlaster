import { Button } from '@/components/ui/button';
import { useCredits } from '@/hooks/useCredits';
import { useToast } from '@/hooks/use-toast';

export default function CreditStatus() {
  const { credits, creditsLoading, estimateMessagesRemaining, addCredits } = useCredits();
  const { toast } = useToast();

  // For demo/development, allow adding credits directly
  const handleAddCredits = async () => {
    try {
      await addCredits.mutateAsync(10);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add credits',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="mb-8 bg-card rounded-lg border border-border shadow-card overflow-hidden">
      <div className="px-6 py-5 border-b border-border bg-muted">
        <h2 className="font-display font-semibold text-lg text-foreground">Message Credits</h2>
      </div>
      <div className="p-6">
        <div className="flex flex-wrap items-center">
          <div className="w-full md:w-1/2 xl:w-1/4 mb-4 md:mb-0">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm mb-1">Available Credits</span>
              <span className="font-display font-bold text-3xl text-foreground">
                {creditsLoading ? '...' : credits}
              </span>
            </div>
          </div>
          <div className="w-full md:w-1/2 xl:w-1/4 mb-4 md:mb-0 md:border-l md:border-border md:pl-6">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm mb-1">Used This Month</span>
              <span className="font-display font-bold text-3xl text-foreground">
                {creditsLoading ? '...' : Math.max(0, 10 - credits)}
              </span>
            </div>
          </div>
          <div className="w-full md:w-1/2 xl:w-1/4 mb-4 md:mb-0 xl:border-l xl:border-border xl:pl-6">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm mb-1">Messages Remaining</span>
              <div className="flex items-center">
                <span className="font-display font-bold text-3xl text-foreground mr-2">
                  {creditsLoading ? '...' : estimateMessagesRemaining()}
                </span>
                <span className="text-sm text-muted-foreground">(approx.)</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 xl:w-1/4 xl:border-l xl:border-border xl:pl-6">
            <Button 
              className="w-full"
              onClick={handleAddCredits}
            >
              {addCredits.isPending ? 'Processing...' : 'Purchase Credits'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
