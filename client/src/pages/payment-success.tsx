import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, MessageSquare, ArrowRight, User, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth.jsx";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setLocation('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-muted-foreground">
            Welcome to TextBlaster! Your account has been activated and you're ready to start messaging.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary" />
                <span>Account Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Username:</span>
                    <span className="font-medium">{user.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan:</span>
                    <Badge variant="secondary">{user.subscriptionTier || 'Premium'}</Badge>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <span>Payment Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="default" className="bg-green-600">Paid</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-medium">Credit Card</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Receipt:</span>
                <span className="text-primary cursor-pointer">View Receipt</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>
              Get started with these recommended first steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <MessageSquare className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Add Your Clients</h3>
                <p className="text-sm text-muted-foreground">
                  Import or manually add your customer contacts to start messaging
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <User className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Create Templates</h3>
                <p className="text-sm text-muted-foreground">
                  Set up message templates for common responses and campaigns
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <ArrowRight className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Send First Message</h3>
                <p className="text-sm text-muted-foreground">
                  Try sending your first message to test the platform
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <div className="bg-muted/50 p-6 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Need Help Getting Started?</h3>
            <p className="text-muted-foreground mb-4">
              Our team is here to help you succeed with TextBlaster
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline">
                📞 Schedule Onboarding Call
              </Button>
              <Button variant="outline">
                📚 View Documentation
              </Button>
              <Button variant="outline">
                💬 Contact Support
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-muted-foreground">
              Redirecting to your dashboard in {countdown} seconds...
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-3">
                <MessageSquare className="w-5 h-5 mr-2" />
                Go to Dashboard Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}