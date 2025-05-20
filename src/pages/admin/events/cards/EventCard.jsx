import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";

export default function EventCard({ event, openEditModal, deleteEvent, isUmbrella, onUmbrellaClick }) {
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

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent triggering card click
    setShowActions(false);
    openEditModal(event);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent triggering card click
    setShowActions(false);
    setShowConfirmDelete(true);
  };

  // Handle the actual deletion after confirmation
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      // Call the deleteEvent function passed from parent
      await deleteEvent(event);
      
      setShowConfirmDelete(false);
    } catch (error) {
      console.error("Error deleting event:", error);
      setDeleteError("Failed to delete event. Please try again.");
      setIsDeleting(false);
    }
  };

  // Handle the card click for regular events only
  const handleCardClick = () => {
    if (!isUmbrella) {
      navigate(`${event.id}/players`, { state: { event_name: event.name } });
    }
    // Do nothing for umbrella events - they should only react to the View Sub-Events button
  };

  // Handle "View Sub-Events" button click
  const handleViewSubEventsClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    onUmbrellaClick();
  };

  return (
    <div 
      className={`flex flex-col h-full rounded-xl overflow-hidden bg-gradient-to-b from-amber-50 to-[#f7faf7] border border-[#E6F2E8] shadow-sm hover:shadow-md transition-all duration-300 ${isUmbrella ? '' : 'cursor-pointer'}`}
      onClick={handleCardClick} // Only regular events will respond to this click
    >
      <div className="flex-1 p-4">
        <div className="flex justify-between items-start mb-2">
          {/* Event Type Badge */}
          <div className="flex flex-wrap gap-1 mb-2" onClick={e => e.stopPropagation()}>
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-[#F7FAF7] text-[#2A6D3A]">
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </span>
            
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-[#F7FAF7] text-[#2A6D3A]">
              {event.category}
            </span>
            
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
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={toggleActions}
              className="p-1.5 rounded-full hover:bg-[#E6F2E8] text-[#2A6D3A] transition-colors duration-200"
              aria-label="Event actions"
            >
              <MoreVertical size={18} className="text-[#2A6D3A]" />
            </button>

            {showActions && (
              <div className="absolute right-0 z-10 mt-1 w-48 origin-top-right bg-white border border-[#E6F2E8] rounded-lg shadow-lg overflow-hidden">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    onClick={handleEditClick}
                    className="flex w-full items-center px-4 py-2.5 text-sm text-[#2A6D3A] hover:bg-[#F7FAF7] transition-colors"
                    role="menuitem"
                  >
                    <Edit size={16} className="mr-2" />
                    Update
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    role="menuitem"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
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

      {/* Delete Confirmation Modal - Using the same component as IntramuralCard */}
      <DeleteConfirmationModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete Event"
        itemName={event.name}
        message={`Are you sure you want to delete "${event.name}"? ${isUmbrella ? "Warning: This will also delete all sub-events!" : "This action cannot be undone."}`}
        isDeleting={isDeleting}
        error={deleteError}
      />
    </div>
  );
}