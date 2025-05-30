import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit, Trash2, ChevronDown, ChevronRight, Clock, Play, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";

export default function EventCard({ event, isUmbrella, onUmbrellaClick }) {
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleActions = (e) => {
    e.stopPropagation(); // Prevent triggering card click
    setShowActions(!showActions);
  };

  // Handle the card click for regular events only
  const handleCardClick = () => {
    if (!isUmbrella) {
      navigate(`${event.id}/bracket`, { state: { event_name: event.name } });
    }
    // Do nothing for umbrella events - they should only react to the View Sub-Events button
  };

  // Handle "View Sub-Events" button click
  const handleViewSubEventsClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    onUmbrellaClick();
  };

  // Get appropriate status badge styling
  const getStatusBadge = () => {
    const status = event.status || 'pending'; // Default to pending if not specified
    
    let bgColor, textColor, icon, label;
    
    switch (status.toLowerCase()) {
      case 'in progress':
        bgColor = 'bg-green-100';
        textColor = 'text-green-700';
        icon = <Play size={14} className="mr-1" />;
        label = 'In Progress';
        break;
      case 'completed':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-700';
        icon = <CheckCircle size={14} className="mr-1" />;
        label = 'Completed';
        break;
      case 'pending':
      default:
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-700';
        icon = <Clock size={14} className="mr-1" />;
        label = 'Pending';
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${bgColor} ${textColor} ml-1`}>
        {icon}
        {label}
      </span>
    );
  };
  
  return (
    <div 
      className={`flex flex-col h-full rounded-xl overflow-hidden bg-gradient-to-b from-amber-50 to-[#f7faf7] border border-[#E6F2E8] shadow-sm hover:shadow-md transition-all duration-300 ${isUmbrella ? '' : 'cursor-pointer'}`}
      onClick={handleCardClick} // Only regular events will respond to this click
    >
      <div className="flex-1 p-4">
        <div className="flex justify-between items-start mb-2">
          {/* Event Type Badges & Status Badge */}
          <div className="flex flex-wrap gap-1 mb-2" onClick={e => e.stopPropagation()}>
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-[#F7FAF7] text-[#2A6D3A]">
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </span>
            
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-[#F7FAF7] text-[#2A6D3A]">
              {event.category}
            </span>
            
            {/* Status Badge */}
            {getStatusBadge()}
            
            {isUmbrella && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-[#E6F2E8] text-[#2A6D3A]">
                Umbrella Event
              </span>
            )}
            
            {event.parent_id && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-[#E6F2E8] text-[#2A6D3A]">
                Sub-Event
              </span>
            )}
          </div>

          {/* Actions Menu */}
          
        </div>

        {/* Event Name and Details */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-[#2A6D3A] mb-1">{event.name}</h3>
          <p className="text-sm text-gray-500">
            {event.tournament_type ? event.tournament_type.replace(/(^|\s)\S/g, (l) => l.toUpperCase()) : 'Tournament'}
          </p>
          {event.venue && (
            <p className="text-sm text-gray-500 mt-1">
              Venue: {event.venue}
            </p>
          )}
        </div>

        {/* Medal Count */}
        <div className="flex justify-between mt-3">
          <div className="flex items-center">
            <div className="flex flex-col items-center mr-4">
              <span className="w-6 h-6 bg-yellow-400 rounded-full mb-1"></span>
              <span className="text-xs">{event.gold}</span>
            </div>
            <div className="flex flex-col items-center mr-4">
              <span className="w-6 h-6 bg-gray-300 rounded-full mb-1"></span>
              <span className="text-xs">{event.silver}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="w-6 h-6 bg-amber-700 rounded-full mb-1"></span>
              <span className="text-xs">{event.bronze}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Umbrella Event Action */}
      {isUmbrella && onUmbrellaClick && (
        <button
          onClick={handleViewSubEventsClick}
          className="mt-auto w-full py-3 px-4 border-t border-[#E6F2E8] bg-[#f7faf7]/50 text-[#2A6D3A] text-sm font-medium flex items-center justify-center hover:bg-[#E6F2E8] transition-colors"
        >
          View Sub-Events
          <ChevronRight size={16} className="ml-1" />
        </button>
      )}

    </div>
  );
}