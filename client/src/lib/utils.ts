import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date for display
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

// Format time for display
export function formatTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

// Format datetime for display
export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return `${formatDate(d)} at ${formatTime(d)}`;
}

// Calculate time ago for display
export function timeAgo(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (secondsAgo < 60) {
    return 'just now';
  }
  
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return `${minutesAgo}m ago`;
  }
  
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return `${hoursAgo}h ago`;
  }
  
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 30) {
    return `${daysAgo}d ago`;
  }
  
  const monthsAgo = Math.floor(daysAgo / 30);
  if (monthsAgo < 12) {
    return `${monthsAgo}mo ago`;
  }
  
  const yearsAgo = Math.floor(monthsAgo / 12);
  return `${yearsAgo}y ago`;
}

// Truncate text with ellipsis
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

// Calculate days since last contact
export function daysSinceLastContact(date: string | Date | null): number {
  if (!date) return 999; // No contact, return a large number
  
  const lastContact = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastContact.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

// Format days since last contact for display
export function formatLastContactDays(days: number): string {
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days >= 999) return 'Never';
  return `${days} days ago`;
}

// Get random color from client name for avatar placeholder
export function getClientColor(name: string): string {
  const colors = [
    'bg-accent text-white',
    'bg-primary text-secondary',
    'bg-tertiary text-white',
    'bg-success text-white',
    'bg-warning text-secondary'
  ];
  
  // Get a consistent index based on the name
  const charSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[charSum % colors.length];
}

// Get initials from name
export function getInitials(name: string): string {
  if (!name) return '';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
