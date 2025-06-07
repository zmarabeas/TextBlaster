import { useState } from 'react';
import { Client } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate, getInitials } from '@/lib/utils';
import { formatPhoneNumber } from '@/lib/twilio';
import { MoreHorizontal, MessageSquare, Edit, Trash2, MessageCircle } from "lucide-react";
import TestMessageButton from '@/components/messaging/TestMessageButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useClients } from '@/hooks/useClients';
import { useLocation } from 'wouter';

interface ClientListProps {
  clients: Client[];
  isLoading: boolean;
  onClientSelect: (clientId: number) => void;
  onClientNew: () => void;
}

export default function ClientList({ 
  clients, 
  isLoading, 
  onClientSelect,
  onClientNew
}: ClientListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean, clientId: number | null }>({ 
    open: false, 
    clientId: null 
  });
  const { deleteClient } = useClients();
  const [, setLocation] = useLocation();
  const itemsPerPage = 10;
  
  // Calculate pagination
  const indexOfLastClient = currentPage * itemsPerPage;
  const indexOfFirstClient = indexOfLastClient - itemsPerPage;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(clients.length / itemsPerPage);
  
  // Handle client delete
  const handleDelete = async () => {
    if (deleteDialog.clientId) {
      await deleteClient.mutateAsync(deleteDialog.clientId);
      setDeleteDialog({ open: false, clientId: null });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="mb-4 p-4 bg-neutral-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-display font-bold mb-2 text-[#f5f5f5]">No clients found</h3>
          <p className="text-neutral-500 mb-6 text-center max-w-md">
            Get started by adding your first client to begin messaging and managing your contacts.
          </p>
          <Button onClick={onClientNew}>
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Your First Client
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-neutral-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {currentClients.map((client) => (
                <tr key={client.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" alt={`${client.firstName} ${client.lastName}`} />
                        <AvatarFallback>
                          {getInitials(`${client.firstName} ${client.lastName}`)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-secondary">
                          {client.firstName} {client.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-secondary">{formatPhoneNumber(client.phone)}</div>
                    <div className="text-sm text-neutral-500">{client.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {client.tags && client.tags.length > 0 ? (
                        client.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="bg-neutral-50">
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-neutral-500">No tags</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-500">{formatDate(client.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setLocation(`/messages?client=${client.id}`)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onClientSelect(client.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onClientSelect(client.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setLocation(`/messages?client=${client.id}`)}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </DropdownMenuItem>
                          {/* Wrap the TestMessageButton in a div to prevent event propagation issues */}
                          <div className="px-2 py-1.5 text-sm">
                            <TestMessageButton 
                              client={client} 
                              size="sm"
                              variant="ghost"
                            />
                          </div>
                          <DropdownMenuItem 
                            className="text-error focus:text-error"
                            onClick={() => setDeleteDialog({ open: true, clientId: client.id })}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="py-4 border-t border-neutral-200">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="text-sm text-neutral-500">
                    Page {currentPage} of {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this client? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, clientId: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteClient.isPending}>
              {deleteClient.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
