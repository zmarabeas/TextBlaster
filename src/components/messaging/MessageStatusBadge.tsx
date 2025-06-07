import React from 'react';

interface MessageStatusBadgeProps {
  status: string;
  className?: string;
}

export default function MessageStatusBadge({ status, className = '' }: MessageStatusBadgeProps) {
  let color = '';
  let label = status;

  switch (status) {
    case 'queued':
      color = 'bg-yellow-100 text-yellow-800 border-yellow-300';
      label = 'Queued';
      break;
    case 'sent':
      color = 'bg-blue-100 text-blue-800 border-blue-300';
      label = 'Sent';
      break;
    case 'delivered':
      color = 'bg-green-100 text-green-800 border-green-300';
      label = 'Delivered';
      break;
    case 'read':
      color = 'bg-purple-100 text-purple-800 border-purple-300';
      label = 'Read';
      break;
    case 'failed':
      color = 'bg-red-100 text-red-800 border-red-300';
      label = 'Failed';
      break;
    case 'undelivered':
      color = 'bg-orange-100 text-orange-800 border-orange-300';
      label = 'Undelivered';
      break;
    case 'received':
      color = 'bg-green-100 text-green-800 border-green-300';
      label = 'Received';
      break;
    default:
      color = 'bg-gray-100 text-gray-800 border-gray-300';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color} ${className}`}>
      {label}
    </span>
  );
}