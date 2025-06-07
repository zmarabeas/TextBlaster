import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertClientSchema, Client } from '@shared/schema';
import { useClients } from '@/hooks/useClients';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from 'zod';
import { validatePhoneNumber } from '@/lib/twilio';

// Extend the client schema with custom validations
const clientFormSchema = insertClientSchema.extend({
  phone: z.string().refine(validatePhoneNumber, {
    message: "Please enter a valid phone number",
  }),
  tags: z.string().optional().transform(value => 
    value ? value.split(',').map(tag => tag.trim()).filter(Boolean) : []
  ),
});

type ClientFormData = z.infer<typeof clientFormSchema>;

interface ClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: number | null;
}

export default function ClientForm({ open, onOpenChange, clientId }: ClientFormProps) {
  const { createClient, updateClient, getClient, clients } = useClients();
  const isEditing = !!clientId;
  
  // Get client details if editing
  const { data: clientData, isLoading: clientLoading } = getClient(clientId || 0);
  
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      tags: '',
      notes: '',
    },
  });

  // Populate form with client data when editing
  useEffect(() => {
    if (isEditing && clientData) {
      form.reset({
        firstName: clientData.firstName,
        lastName: clientData.lastName,
        phone: clientData.phone,
        email: clientData.email || '',
        tags: clientData.tags ? clientData.tags.join(', ') : '',
        notes: clientData.notes || '',
      });
    } else if (!isEditing) {
      form.reset({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        tags: '',
        notes: '',
      });
    }
  }, [isEditing, clientData, form]);

  const onSubmit = async (data: ClientFormData) => {
    try {
      if (isEditing && clientId) {
        await updateClient.mutateAsync({
          id: clientId,
          data: {
            ...data,
            // Convert tags string to array if needed
            tags: typeof data.tags === 'string' 
              ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) 
              : data.tags,
          },
        });
      } else {
        await createClient.mutateAsync(data);
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update client details and contact information.' 
              : 'Enter client details to add them to your contacts.'}
          </DialogDescription>
        </DialogHeader>
        
        {clientLoading && isEditing ? (
          <div className="py-8 flex justify-center">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone Number" {...field} />
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
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (Comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. VIP, New Client, Follow-up" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add any additional notes about this client" 
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createClient.isPending || updateClient.isPending}
                >
                  {createClient.isPending || updateClient.isPending 
                    ? 'Saving...' 
                    : isEditing ? 'Update Client' : 'Add Client'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
