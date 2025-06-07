import React, { useEffect, useState, useCallback } from 'react';
import { Progress } from '@/components/ui/progress';
import { useMessages } from '@/hooks/useMessages';

interface BatchMessageProgressProps {
  batchId: string;
  onComplete?: () => void;
}

interface BatchStatus {
  total: number;
  delivered: number;
  failed: number;
  queued: number;
  sent: number;
  deliveredPercentage: number;
  failedPercentage: number;
  inProgressPercentage: number;
  isComplete: boolean;
  statusCounts: Record<string, number>;
}

export default function BatchMessageProgress({ batchId, onComplete }: BatchMessageProgressProps) {
  const [status, setStatus] = useState<BatchStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { getBatchStatus } = useMessages();

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBatchStatus(batchId);

      if (data.success && data.progress) {
        setStatus(data.progress);
        if (data.progress.isComplete && onComplete) {
          onComplete();
        }
      } else {
        setError(data.message || 'Failed to fetch batch status');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [batchId, getBatchStatus, onComplete]);

  useEffect(() => {
    if (!batchId) return;

    // Initial fetch
    fetchStatus();

    // Set up polling
    const interval = setInterval(() => {
      fetchStatus();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [fetchStatus]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (loading && !status) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Processing messages</span>
          <span className="text-sm text-gray-500">Initializing...</span>
        </div>
        <Progress value={0} />
      </div>
    );
  }

  if (!status) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">Sending messages ({status.total} total)</div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Delivered</span>
          <span className="text-sm text-gray-500">
            {status.delivered} of {status.total} ({status.deliveredPercentage}%)
          </span>
        </div>
        <Progress 
          value={status.deliveredPercentage} 
          className="h-2 bg-gray-100" 
          indicatorClassName="bg-green-500" 
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Failed</span>
          <span className="text-sm text-gray-500">
            {status.failed} of {status.total} ({status.failedPercentage}%)
          </span>
        </div>
        <Progress 
          value={status.failedPercentage} 
          className="h-2 bg-gray-100" 
          indicatorClassName="bg-red-500" 
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">In Progress</span>
          <span className="text-sm text-gray-500">
            {(status.queued + status.sent)} of {status.total} ({status.inProgressPercentage}%)
          </span>
        </div>
        <Progress 
          value={status.inProgressPercentage} 
          className="h-2 bg-gray-100" 
          indicatorClassName="bg-blue-500" 
        />
      </div>
      
      {status.isComplete && (
        <div className="text-sm text-green-600 font-medium">
          All messages processed!
        </div>
      )}
    </div>
  );
}