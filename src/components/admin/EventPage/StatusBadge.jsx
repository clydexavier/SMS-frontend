import React from "react";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getBadgeStyles = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeStyles()}`}>
      {status === 'pending' ? 'Pending' : 
       status === 'in progress' ? 'In Progress' : 
       status === 'completed' ? 'Completed' : 'Unknown'}
    </span>
  );
};

export default StatusBadge;