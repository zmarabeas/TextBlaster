import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease';
  };
  icon: React.ReactNode;
  iconColor: string;
}

export default function StatCard({ title, value, change, icon, iconColor }: StatCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border shadow-card p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-3xl font-display font-bold text-foreground">{value}</p>
        </div>
        <div className={cn("p-2 rounded-full", `bg-${iconColor}/10`)}>
          {icon}
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center">
          <div className={cn("flex items-center", {
            'text-green-600 dark:text-green-400': change.type === 'increase',
            'text-red-600 dark:text-red-400': change.type === 'decrease'
          })}>
            {change.type === 'increase' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
              </svg>
            )}
            <span className="text-sm font-medium ml-1">{change.value}</span>
          </div>
          <span className="text-sm text-muted-foreground ml-2">from last month</span>
        </div>
      )}
    </div>
  );
}
