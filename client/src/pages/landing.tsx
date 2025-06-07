import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, MessageSquare, Users, Zap, Star, Shield, Clock, TrendingUp, FileText, CreditCard, FolderOpen } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import logoPath from "@assets/TEXT_BLAST_LOGO.png";

const businessTypes = [
  "Car Dealerships",
  "Real Estate Agencies", 
  "Insurance Agencies",
  "Legal Practices",
  "Medical Clinics",
  "Dental Offices",
  "Restaurants",
  "Auto Repair Shops",
  "Hair Salons",
  "Financial Advisors",
  "Home Contractors",
  "Retail Stores"
];

function AnimatedBusinessTypes() {
  const [displayIndex, setDisplayIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayIndex((prev) => (prev + 1) % businessTypes.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-20 flex items-center justify-center overflow-hidden">
      <div 
        key={displayIndex}
        className="text-primary animate-in slide-in-from-left-5 fade-in duration-500"
      >
        {businessTypes[displayIndex]}
      </div>
    </div>
  );
}

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    credits: 200,
    features: [
      "200 free messages",
      "Basic client management",
      "Message templates",
      "Simple analytics"
    ],
    popular: false,
    stripePriceId: null
  },
  {
    name: "Starter",
    price: "$25",
    period: "one-time",
    credits: 800,
    features: [
      "800 messages",
      "Advanced client management",
      "Custom message templates",
      "Detailed analytics",
      "Batch messaging",
      "Email support"
    ],
    popular: true,
    stripePriceId: "price_starter_800"
  },
  {
    name: "Professional",
    price: "$50",
    period: "one-time",
    credits: 1750,
    features: [
      "1,750 messages",
      "Everything in Starter",
      "Advanced automation",
      "Priority support",
      "Custom integrations",
      "API access"
    ],
    popular: false,
    stripePriceId: "price_professional_1750"
  },
  {
    name: "Business",
    price: "$100",
    period: "one-time",
    credits: 4000,
    features: [
      "4,000 messages",
      "Everything in Professional",
      "Dedicated account manager",
      "Custom reporting",
      "White-label options",
      "24/7 phone support"
    ],
    popular: false,
    stripePriceId: "price_business_4000"
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "quote",
    credits: "Unlimited",
    features: [
      "Unlimited messaging",
      "Custom form builder",
      "Credit application management",
      "Document tracking system",
      "Advanced client workflows",
      "Custom integrations & API",
      "Dedicated onboarding specialist",
      "White-label solutions"
    ],
    popular: false,
    stripePriceId: "enterprise_custom",
    isCustom: true
  }
];

const features = [
  {
    icon: MessageSquare,
    title: "Simple & Intuitive",
    description: "User-friendly interface designed specifically for sales teams. No complex setup or training required."
  },
  {
    icon: Users,
    title: "Smart Client Management",
    description: "Organize your leads and customers with intelligent tagging, notes, and communication history tracking."
  },
  {
    icon: Zap,
    title: "Lightning Fast Setup",
    description: "Get started in minutes, not hours. Quick integration with your existing workflow and CRM systems."
  },
  {
    icon: TrendingUp,
    title: "Cost-Effective Pricing",
    description: "Up to 80% less expensive than competitors like Avachato, Project Broadcast, and SlickText."
  }
];

const competitors = [
  { name: "Project Broadcast", price: "$200/month", messages: "120k messages" },
  { name: "Avachato", price: "$175/month", messages: "Platform fee + $35/user" },
  { name: "SlickText", price: "$189/month", messages: "5k messages" },
  { name: "TextBlaster", price: "$50", messages: "1,750 messages", highlight: true }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img 
                src={logoPath} 
                alt="TextBlaster" 
                className="h-8 w-8 logo-spin cursor-pointer" 
              />
              <span className="text-2xl font-bold text-foreground">TextBlaster</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </button>
              <a 
                href="https://betterinbinary.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Company
              </a>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Simple SMS Marketing for<br />
            <AnimatedBusinessTypes />
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Stop overpaying for complex messaging platforms. TextBlaster delivers powerful SMS marketing 
            with the simplicity your business needs and pricing that makes sense.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-3"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-3"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose TextBlaster?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built specifically for sales teams who need powerful messaging without the complexity.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardHeader className="text-center">
                  <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Stop Overpaying for Messaging
            </h2>
            <p className="text-xl text-muted-foreground">
              See how TextBlaster compares to expensive alternatives
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {competitors.map((competitor, index) => (
              <Card key={index} className={competitor.highlight ? "border-primary shadow-lg" : ""}>
                <CardHeader className="text-center">
                  <CardTitle className={competitor.highlight ? "text-primary" : ""}>
                    {competitor.name}
                  </CardTitle>
                  <div className="text-2xl font-bold">{competitor.price}</div>
                  <CardDescription>{competitor.messages}</CardDescription>
                </CardHeader>
                {competitor.highlight && (
                  <CardContent className="text-center">
                    <Badge variant="default" className="bg-primary">
                      Best Value
                    </Badge>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Pay only for what you use. No monthly fees, no hidden costs.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">/{plan.period}</span>
                  </div>
                  <CardDescription>
                    {typeof plan.credits === 'number' ? `${plan.credits.toLocaleString()} messages included` : plan.credits}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    {plan.isCustom ? (
                      <a href="mailto:contact@textblaster.com?subject=Enterprise%20Plan%20Inquiry">
                        <Button 
                          className="w-full" 
                          variant="outline"
                        >
                          Contact Us
                        </Button>
                      </a>
                    ) : (
                      <Link href={plan.name === "Free" ? "/register" : `/pricing/${plan.stripePriceId}`}>
                        <Button 
                          className="w-full" 
                          variant={plan.popular ? "default" : "outline"}
                        >
                          {plan.name === "Free" ? "Start Free" : "Get Started"}
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Enterprise Features Highlight */}
          <div className="mt-16 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-8 border border-primary/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-3">Need More Than Messaging?</h3>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Our Enterprise plan includes advanced workflow management tools perfect for businesses that need comprehensive client onboarding and documentation tracking.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Custom Forms</h4>
                <p className="text-sm text-muted-foreground">Build and deploy custom forms for client intake, surveys, and data collection with automated follow-ups.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Credit Applications</h4>
                <p className="text-sm text-muted-foreground">Streamline credit application processes with automated document collection and status tracking.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <FolderOpen className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Document Management</h4>
                <p className="text-sm text-muted-foreground">Track document submissions, approvals, and follow-ups with integrated client messaging and tags.</p>
              </div>
            </div>
            
            <div className="text-center">
              <a href="mailto:contact@textblaster.com?subject=Enterprise%20Plan%20-%20Custom%20Forms%20%26%20Documentation">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Schedule Enterprise Consultation
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center space-x-8 mb-12">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-green-500" />
              <span className="text-sm font-medium">CASL Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-6 w-6 text-blue-500" />
              <span className="text-sm font-medium">5-Minute Setup</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-6 w-6 text-yellow-500" />
              <span className="text-sm font-medium">4.9/5 Rating</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Transform Your Sales Communication?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join hundreds of sales teams who've switched to TextBlaster for simpler, 
            more affordable SMS marketing.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-3"
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Start Your Free Trial
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Have questions about TextBlaster? We're here to help you get started with better SMS marketing.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Email Support</h3>
              <p className="text-muted-foreground">
                <a href="mailto:support@textblaster.com" className="hover:text-primary transition-colors">
                  support@textblaster.com
                </a>
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">Sales Inquiries</h3>
              <p className="text-muted-foreground">
                <a href="mailto:sales@textblaster.com" className="hover:text-primary transition-colors">
                  sales@textblaster.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src={logoPath} 
                  alt="TextBlaster" 
                  className="h-6 w-6 logo-spin cursor-pointer" 
                />
                <span className="text-lg font-bold">TextBlaster</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Simple SMS marketing for businesses of all types.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button 
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </button>
                </li>
                <li><Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a 
                    href="https://betterinbinary.vercel.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <button 
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button 
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <a href="/documentation" className="hover:text-foreground transition-colors">Documentation</a>
                </li>
                <li><a href="mailto:support@textblaster.com" className="hover:text-foreground transition-colors">support@textblaster.com</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 TextBlaster. All rights reserved.</p>
            <p className="mt-2">
              Built by{' '}
              <a 
                href="https://betterinbinary.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors underline"
              >
                Better in Binary
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}