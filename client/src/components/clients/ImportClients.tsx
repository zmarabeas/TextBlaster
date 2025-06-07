import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useClients } from '@/hooks/useClients';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import { validatePhoneNumber } from '@/lib/twilio';
import { InsertClient } from '@shared/schema';

const importSchema = z.object({
  file: z.any()
    .refine((file) => file?.length === 1, "Please select a CSV file")
    .refine(
      (file) => file?.[0]?.type === "text/csv" || file?.[0]?.name.endsWith(".csv"),
      "Only CSV files are supported"
    ),
});

export default function ImportClients({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { createClient } = useClients();
  const { toast } = useToast();
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ imported: number, skipped: number, errors: string[] } | null>(null);
  
  const form = useForm<z.infer<typeof importSchema>>({
    resolver: zodResolver(importSchema),
  });

  const handleImport = async (data: z.infer<typeof importSchema>) => {
    const file = data.file[0];
    setImporting(true);
    setResults(null);
    setProgress(0);
    
    try {
      // Read the file content
      const text = await file.text();
      const rows = text.split('\n').filter(row => row.trim());
      const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
      
      // Validate headers to make sure we have the required fields
      const requiredFields = ['first name', 'last name', 'phone'];
      const missingFields = requiredFields.filter(field => !headers.includes(field));
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      // Map indexes of each required field
      const firstNameIndex = headers.indexOf('first name');
      const lastNameIndex = headers.indexOf('last name');
      const phoneIndex = headers.indexOf('phone');
      const emailIndex = headers.indexOf('email');
      const tagsIndex = headers.indexOf('tags');
      const notesIndex = headers.indexOf('notes');
      
      // Process each client row
      const clients: InsertClient[] = [];
      const errors: string[] = [];
      let imported = 0;
      let skipped = 0;
      
      for (let i = 1; i < rows.length; i++) {
        // Update progress
        setProgress(Math.floor((i / rows.length) * 100));
        
        try {
          const columns = rows[i].split(',').map(c => c.trim());
          
          // Skip if any required field is missing
          if (!columns[firstNameIndex] || !columns[lastNameIndex] || !columns[phoneIndex]) {
            skipped++;
            continue;
          }
          
          // Check if phone number is valid
          const phone = columns[phoneIndex];
          if (!validatePhoneNumber(phone)) {
            errors.push(`Row ${i}: Invalid phone number "${phone}"`);
            skipped++;
            continue;
          }
          
          // Create client object
          const client: InsertClient = {
            firstName: columns[firstNameIndex],
            lastName: columns[lastNameIndex],
            phone: columns[phoneIndex],
            email: emailIndex >= 0 ? columns[emailIndex] || undefined : undefined,
            tags: tagsIndex >= 0 && columns[tagsIndex] 
              ? columns[tagsIndex].split(';').map(tag => tag.trim()) 
              : undefined,
            notes: notesIndex >= 0 ? columns[notesIndex] || undefined : undefined,
          };
          
          // Create client in database
          await createClient.mutateAsync(client);
          imported++;
        } catch (error) {
          console.error(`Error importing row ${i}:`, error);
          errors.push(`Row ${i}: ${error.message || 'Unknown error'}`);
          skipped++;
        }
      }
      
      // Show results
      setResults({
        imported,
        skipped,
        errors,
      });
      
      toast({
        title: "Import completed",
        description: `Successfully imported ${imported} clients. ${skipped} entries were skipped.`,
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: error.message || "An unexpected error occurred during import.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
      setProgress(100);
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      // Reset form and state when dialog changes
      if (!open) {
        form.reset();
        setResults(null);
        setProgress(0);
      }
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Import Clients</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import multiple clients at once.
          </DialogDescription>
        </DialogHeader>
        
        {!importing && !results && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleImport)} className="space-y-6">
              <div className="grid gap-6 py-4">
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>CSV File</FormLabel>
                      <FormControl>
                        <Input 
                          type="file" 
                          accept=".csv" 
                          onChange={(e) => onChange(e.target.files)}
                          {...rest}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                  <h3 className="text-secondary font-medium mb-2">CSV Format Requirements</h3>
                  <p className="text-sm text-neutral-500 mb-3">
                    Your CSV file should have the following headers (column names):
                  </p>
                  <ul className="text-sm text-neutral-500 space-y-1 list-disc pl-5">
                    <li><strong>Required:</strong> First Name, Last Name, Phone</li>
                    <li><strong>Optional:</strong> Email, Tags, Notes</li>
                  </ul>
                  <p className="text-sm text-neutral-500 mt-3">
                    For Tags, use semicolons (;) to separate multiple tags.
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Import Clients
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
        
        {importing && (
          <div className="py-8 space-y-6">
            <div className="text-center">
              <h3 className="text-secondary font-medium mb-2">Importing Clients</h3>
              <p className="text-sm text-neutral-500">
                Please wait while we import your clients...
              </p>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {results && (
          <div className="py-4 space-y-6">
            <div className="text-center">
              <h3 className="text-secondary font-medium mb-2">Import Complete</h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-success/10 p-4 rounded-lg">
                  <p className="text-2xl font-display font-bold text-success">{results.imported}</p>
                  <p className="text-sm text-secondary">Clients Imported</p>
                </div>
                <div className="bg-warning/10 p-4 rounded-lg">
                  <p className="text-2xl font-display font-bold text-warning">{results.skipped}</p>
                  <p className="text-sm text-secondary">Entries Skipped</p>
                </div>
              </div>
            </div>
            
            {results.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTitle>Import Errors</AlertTitle>
                <AlertDescription>
                  <div className="max-h-40 overflow-y-auto text-sm">
                    <ul className="list-disc pl-5 space-y-1">
                      {results.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <DialogFooter>
              <Button onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
