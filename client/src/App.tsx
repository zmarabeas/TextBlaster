import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Clients from "@/pages/clients";
import Messages from "@/pages/messages";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Landing from "@/pages/landing";
import Pricing from "@/pages/pricing";
import PaymentSuccess from "@/pages/payment-success";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Documentation from "@/pages/documentation";
import { AuthProvider } from "@/hooks/useAuth.jsx";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth.jsx";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Switch>
      {user ? (
        <>
          <Route path="/">
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </Route>
          <Route path="/clients">
            <ProtectedRoute>
              <Clients />
            </ProtectedRoute>
          </Route>
          <Route path="/messages">
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          </Route>
          <Route path="/analytics">
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          </Route>
          <Route path="/settings">
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          </Route>
        </>
      ) : (
        <>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/pricing/:planId" component={Pricing} />
          <Route path="/payment-success" component={PaymentSuccess} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route path="/documentation" component={Documentation} />
          <Route path="/" component={Landing} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="textblaster-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
