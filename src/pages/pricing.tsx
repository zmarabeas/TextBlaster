import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Check, ArrowLeft, CreditCard, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const userRegistrationSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UserRegistrationForm = z.infer<typeof userRegistrationSchema>;

const planDetails = {
  "price_starter_800": {
    name: "Starter",
    price: "$25",
    credits: 800,
    features: [
      "800 messages",
      "Advanced client management",
      "Custom message templates",
      "Detailed analytics",
      "Batch messaging",
      "Email support"
    ]
  },
  "price_professional_1750": {
    name: "Professional", 
    price: "$50",
    credits: 1750,
    features: [
      "1,750 messages",
      "Everything in Starter",
      "Advanced automation",
      "Priority support",
      "Custom integrations",
      "API access"
    ]
  },
  "price_business_4000": {
    name: "Business",
    price: "$100", 
    credits: 4000,
    features: [
      "4,000 messages",
      "Everything in Professional",
      "Dedicated account manager",
      "Custom reporting",
      "White-label options",
      "24/7 phone support"
    ]
  }
};

const CheckoutForm = ({ planId, userData, onSuccess }: { planId: string, userData: UserRegistrationForm, onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required'
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Create account after successful payment
        try {
          const response = await apiRequest('POST', '/api/payment-success', {
            paymentIntentId: paymentIntent.id,
            userData: {
              username: userData.username,
              email: userData.email,
              fullName: userData.fullName,
              password: userData.password
            }
          });

          const result = await response.json();
          
          toast({
            title: "Account Created Successfully!",
            description: "Your payment was processed and account is ready to use.",
          });
          
          onSuccess();
        } catch (accountError: any) {
          toast({
            title: "Account Creation Failed",
            description: "Payment succeeded but account creation failed. Please contact support.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || isProcessing}
        size="lg"
      >
        {isProcessing ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span>Complete Payment & Create Account</span>
          </div>
        )}
      </Button>
    </form>
  );
};

export default function Pricing() {
  const planId = undefined; // Simplified for deployment
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'register' | 'payment'>('register');
  const [userData, setUserData] = useState<UserRegistrationForm | null>(null);
  const { toast } = useToast();

  const plan = planId ? planDetails[planId as keyof typeof planDetails] : null;

  const form = useForm<UserRegistrationForm>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      username: "",
      email: "",
      fullName: "",
      password: "",
      confirmPassword: ""
    },
  });

  useEffect(() => {
    if (!plan) {
      setLocation('/');
      return;
    }

    if (step === 'payment' && userData) {
      // Create payment intent when moving to payment step
      apiRequest("POST", "/api/create-payment-intent", { 
        planId,
        amount: parseInt(plan.price.replace('$', ''))
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
          setLoading(false);
        })
        .catch((error) => {
          toast({
            title: "Setup Error",
            description: "Failed to initialize payment. Please try again.",
            variant: "destructive",
          });
          setStep('register');
        });
    } else {
      setLoading(false);
    }
  }, [plan, planId, step, userData, setLocation, toast]);

  const handleRegistrationSubmit = async (data: UserRegistrationForm) => {
    setUserData(data);
    setStep('payment');
    setLoading(true);
  };

  const handlePaymentSuccess = () => {
    setLocation('/payment-success');
  };

  if (!plan) {
    return null;
  }

  if (loading && step === 'payment') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Setting up your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Complete Your Purchase</h1>
          <p className="text-muted-foreground mt-2">
            You're just one step away from accessing TextBlaster's powerful messaging platform.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Plan Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{plan.name} Plan</CardTitle>
                <Badge variant="secondary">One-time payment</Badge>
              </div>
              <CardDescription>
                {plan.credits.toLocaleString()} messages included
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-primary">{plan.price}</div>
                <div className="text-sm text-muted-foreground">One-time payment</div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">What's included:</h3>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">After payment:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Instant account activation</li>
                  <li>• {plan.credits.toLocaleString()} message credits added</li>
                  <li>• Full access to all features</li>
                  <li>• Welcome onboarding email</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Registration/Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {step === 'register' ? (
                  <>
                    <User className="w-5 h-5" />
                    <span>Create Your Account</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Payment Details</span>
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {step === 'register' 
                  ? 'First, let\'s set up your account details' 
                  : 'Secure payment powered by Stripe'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 'register' ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleRegistrationSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" size="lg">
                      Continue to Payment
                    </Button>
                  </form>
                </Form>
              ) : userData && clientSecret ? (
                <Elements 
                  stripe={stripePromise} 
                  options={{ 
                    clientSecret,
                    appearance: {
                      theme: 'stripe'
                    }
                  }}
                >
                  <CheckoutForm 
                    planId={planId!} 
                    userData={userData}
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              ) : (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading payment form...</p>
                </div>
              )}
              
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                  <span>🔒 SSL secured</span>
                  <span>💳 All major cards</span>
                  <span>✅ Instant activation</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}