import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';
import { getInitials } from '@/lib/utils';
import { useCredits } from '@/hooks/useCredits';

export default function Settings() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { credits, addCredits } = useCredits();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // Saving profile is not implemented yet
  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
  };

  // For demo purposes
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
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl md:text-3xl text-secondary">Settings</h1>
          <p className="mt-1 text-neutral-500">Manage your account and preferences.</p>
        </div>

        <Tabs defaultValue="profile" className="mb-10">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="billing">Billing & Credits</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and public profile.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" alt={user?.fullName || "User"} />
                    <AvatarFallback className="text-xl">
                      {getInitials(user?.fullName || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                    <p className="text-sm text-neutral-500 mt-2">
                      JPG, GIF or PNG. Max size 1MB.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account credentials and security settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-neutral-200">
                  <h3 className="font-display font-semibold text-secondary mb-2">Danger Zone</h3>
                  <p className="text-sm text-neutral-500 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="ml-auto">
                  Change Password
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="billing" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Credits</CardTitle>
                <CardDescription>Manage your subscription and message credits.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-display font-semibold text-secondary">Current Plan</h3>
                    <span className="font-display font-semibold px-2 py-1 text-sm bg-primary text-secondary rounded">Free Plan</span>
                  </div>
                  <p className="text-sm text-neutral-500 mb-4">
                    You are currently on the free plan with limited features.
                  </p>
                  <Button>Upgrade to Premium</Button>
                </div>
                
                <div>
                  <h3 className="font-display font-semibold text-secondary mb-2">Message Credits</h3>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-neutral-500">Available Credits</p>
                    <span className="font-display font-semibold text-secondary text-lg">{credits}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="bg-neutral-50">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <h4 className="font-display font-semibold text-secondary mb-2">Basic</h4>
                          <div className="font-display font-bold text-3xl text-secondary mb-2">
                            $5
                          </div>
                          <p className="text-neutral-500 text-sm mb-4">50 Credits</p>
                          <Button variant="outline" className="w-full" onClick={handleAddCredits}>
                            Purchase
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-accent">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="bg-accent text-white text-xs px-2 py-1 rounded absolute -top-3 left-1/2 transform -translate-x-1/2">
                            Popular
                          </div>
                          <h4 className="font-display font-semibold text-secondary mb-2">Standard</h4>
                          <div className="font-display font-bold text-3xl text-secondary mb-2">
                            $10
                          </div>
                          <p className="text-neutral-500 text-sm mb-4">120 Credits</p>
                          <Button className="w-full" onClick={handleAddCredits}>
                            Purchase
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-neutral-50">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <h4 className="font-display font-semibold text-secondary mb-2">Premium</h4>
                          <div className="font-display font-bold text-3xl text-secondary mb-2">
                            $20
                          </div>
                          <p className="text-neutral-500 text-sm mb-4">250 Credits</p>
                          <Button variant="outline" className="w-full" onClick={handleAddCredits}>
                            Purchase
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Control how you receive notifications from TextBlaster.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-neutral-500 py-8">
                  Notification settings coming soon!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-center mb-10">
          <Button variant="outline" onClick={() => logout()}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
