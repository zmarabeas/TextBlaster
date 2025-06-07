import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useCredits } from '@/hooks/useCredits';
import { formatDate } from '@/lib/utils';

export default function Analytics() {
  const { credits, transactions } = useCredits();

  // Get analytics data
  const { data, isLoading } = useQuery({
    queryKey: ['/api/analytics/dashboard'],
  });
  
  // Generate sample data for charts based on credit usage
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toISOString().split('T')[0],
      usage: 0,
    };
  });

  // Populate usage from transactions
  const usageData = [...last7Days];
  transactions.forEach(transaction => {
    if (transaction.type === 'usage') {
      const transactionDate = new Date(transaction.createdAt).toISOString().split('T')[0];
      const dataIndex = usageData.findIndex(item => item.date === transactionDate);
      if (dataIndex !== -1) {
        usageData[dataIndex].usage += Math.abs(transaction.amount);
      }
    }
  });

  // Format dates for better display
  const formattedUsageData = usageData.map(item => ({
    ...item,
    date: formatDate(item.date),
  }));

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">Analytics</h1>
            <p className="mt-1 text-muted-foreground">Track your messaging performance and client engagement.</p>
          </div>
          <div>
            <Button variant="outline">Export Data</Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="messaging">Messaging</TabsTrigger>
            <TabsTrigger value="credits">Credits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-display">Total Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-display font-bold text-foreground">
                    {isLoading ? '...' : data?.stats?.clientCount || 0}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-display">Total Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-display font-bold text-foreground">
                    {isLoading ? '...' : data?.stats?.messageSent || 0}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-display">Available Credits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-display font-bold text-foreground">
                    {credits}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="font-display">Message Usage (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={formattedUsageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="usage" fill="hsl(var(--accent))" name="Messages Sent" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Response Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-40">
                    <div className="text-5xl font-display font-bold text-foreground">
                      {isLoading ? '...' : data?.stats?.responseRate || '0%'}
                    </div>
                    <p className="text-muted-foreground mt-2">Average client response rate</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Clients Needing Attention</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-40">
                    <div className="text-5xl font-display font-bold text-foreground">
                      {isLoading ? '...' : data?.clientsNeedingAttention?.length || 0}
                    </div>
                    <p className="text-muted-foreground mt-2">Clients not contacted in 30+ days</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="messaging" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display">More detailed messaging analytics coming soon!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-500">
                  We're working on adding more detailed messaging analytics to help you track your client engagement.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="credits" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Credit Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No credit transactions found.
                  </p>
                ) : (
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted">
                        <tr>
                          <th className="px-6 py-3 text-muted-foreground">Date</th>
                          <th className="px-6 py-3 text-muted-foreground">Amount</th>
                          <th className="px-6 py-3 text-muted-foreground">Type</th>
                          <th className="px-6 py-3 text-muted-foreground">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map(transaction => (
                          <tr key={transaction.id} className="border-b border-border">
                            <td className="px-6 py-4 text-foreground">
                              {formatDate(transaction.createdAt)}
                            </td>
                            <td className={`px-6 py-4 font-medium ${
                              transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                            </td>
                            <td className="px-6 py-4 capitalize text-foreground">
                              {transaction.type}
                            </td>
                            <td className="px-6 py-4 text-foreground">
                              {transaction.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
