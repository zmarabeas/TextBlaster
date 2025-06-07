import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useClients } from '@/hooks/useClients';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ClientList from '@/components/clients/ClientList';
import ClientForm from '@/components/clients/ClientForm';
import ImportClients from '@/components/clients/ImportClients';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function Clients() {
  const [search, setSearch] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const { clients, isLoading, refreshClients } = useClients();
  const [, params] = useLocation();
  const { toast } = useToast();

  // Parse query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('new') === 'true') {
      setShowNewForm(true);
    }
    if (urlParams.get('import') === 'true') {
      setShowImportForm(true);
    }
    const clientId = urlParams.get('id');
    if (clientId) {
      setSelectedClientId(parseInt(clientId));
    }
  }, []);

  // Filter clients based on search term
  const filteredClients = clients.filter((client) => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    const email = client.email?.toLowerCase() || '';
    const phone = client.phone.toLowerCase();
    const searchTerm = search.toLowerCase();
    
    return (
      fullName.includes(searchTerm) ||
      email.includes(searchTerm) ||
      phone.includes(searchTerm)
    );
  });
  


  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">Clients</h1>
            <p className="mt-1 text-muted-foreground">Manage your client database and contact information.</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              className="flex items-center"
              onClick={() => setShowImportForm(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Import Clients
            </Button>
            <Button 
              className="flex items-center"
              onClick={() => setShowNewForm(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Client
            </Button>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search clients by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Client List */}
        <ClientList 
          clients={filteredClients} 
          isLoading={isLoading} 
          onClientSelect={setSelectedClientId}
          onClientNew={() => setShowNewForm(true)}
        />

        {/* New Client Modal */}
        <ClientForm 
          open={showNewForm} 
          onOpenChange={setShowNewForm} 
          clientId={null} 
        />

        {/* Edit Client Modal */}
        {selectedClientId && (
          <ClientForm 
            open={!!selectedClientId} 
            onOpenChange={(open) => {
              if (!open) setSelectedClientId(null);
            }}
            clientId={selectedClientId}
          />
        )}

        {/* Import Clients Modal */}
        <ImportClients 
          open={showImportForm} 
          onOpenChange={setShowImportForm} 
        />
      </div>
    </div>
  );
}
