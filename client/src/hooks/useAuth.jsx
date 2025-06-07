import { createContext, useContext } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';

// Create the context
const AuthContext = createContext(undefined);

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Provider component
export function AuthProvider({ children }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  
  // Fetch the current user
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/auth/me'],
    staleTime: 1000 * 60 * 5, 
    retry: false
  });
  
  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const res = await apiRequest('POST', '/api/auth/login', credentials);
      return res.json();
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(['/api/auth/me'], userData);
      setLocation('/');
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    }
  });
  
  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      const res = await apiRequest('POST', '/api/auth/register', userData);
      return res.json();
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(['/api/auth/me'], userData);
      setLocation('/');
      toast({
        title: 'Account created',
        description: 'Your account has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Registration failed',
        description: error.message || 'Could not create account. Please try again.',
        variant: 'destructive',
      });
    }
  });
  
  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/auth/logout');
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api/auth/me'], null);
      queryClient.clear();
      setLocation('/login');
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Logout failed',
        description: 'Could not log out. Please try again.',
        variant: 'destructive',
      });
    }
  });
  
  const login = async (credentials) => {
    await loginMutation.mutateAsync(credentials);
  };
  
  const register = async (userData) => {
    await registerMutation.mutateAsync(userData);
  };
  
  const logout = async () => {
    await logoutMutation.mutateAsync();
  };
  
  const value = {
    user: user || null,
    isLoading,
    login,
    register,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}