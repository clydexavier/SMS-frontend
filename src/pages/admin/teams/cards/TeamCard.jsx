import React, { useState, useRef, useEffect } from "react";
import { Users, MoreVertical, Edit, Trash, Calendar, AlertTriangle, X, Loader } from "lucide-react";

export default function TeamCard({ team, openEditModal, deleteTeam }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  
  // Create refs for the delete modal and options menu
  const deleteModalRef = useRef(null);
  const optionsMenuRef = useRef(null);
  const optionsButtonRef = useRef(null);
  
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Handle team deletion
  async function handleDeleteTeam() {
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      await deleteTeam(team.id, team.name);
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting team:", error);
      setDeleteError(
        error.response?.data?.message || 
        "An error occurred while deleting the team. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  }
  
  // Handle clicks outside of the delete modal and options menu
  useEffect(() => {
    function handleClickOutside(event) {
      // Close delete confirmation modal when clicking outside
      if (deleteModalRef.current && !deleteModalRef.current.contains(event.target) && showDeleteConfirmation) {
        setShowDeleteConfirmation(false);
      }
      
      // Close options menu when clicking outside
      if (showOptions && 
          optionsMenuRef.current && 
          !optionsMenuRef.current.contains(event.target) &&
          optionsButtonRef.current && 
          !optionsButtonRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }
    
    // Add event listener when any modal is shown
    if (showDeleteConfirmation || showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDeleteConfirmation, showOptions]);

  return (
    <div className="p-4 rounded-xl relative">
      {/* Options menu */}
      <div className="absolute top-4 right-4 z-10">
        <button
          ref={optionsButtonRef}
          onClick={toggleOptions}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <MoreVertical size={18} className="text-gray-500" />
        </button>

        {showOptions && (
          <div 
            ref={optionsMenuRef}
            className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-36 z-20"
          >
            <button
              onClick={() => {
                openEditModal();
                setShowOptions(false);
              }}
              className="flex items-center px-4 py-2 text-sm text-[#2A6D3A] hover:bg-gray-100 w-full text-left"
            >
              <Edit size={16} className="mr-2" />
              Edit Team
            </button>
            <button
              onClick={() => {
                setShowDeleteConfirmation(true);
                setShowOptions(false);
              }}
              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
            >
              <Trash size={16} className="mr-2" />
              Delete Team
            </button>
          </div>
        )}
      </div>

      {/* Team logo */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-20 h-20 bg-[#E6F2E8] text-[#2A6D3A] rounded-full flex items-center justify-center text-xl font-semibold mb-2 overflow-hidden">
          {team.team_logo_path ? (
            <img 
              src={team.team_logo_path} 
              alt={team.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-logo.png";
              }}
            />
          ) : (
            team.name.charAt(0).toUpperCase()
          )}
        </div>
        <h3 className="font-medium text-gray-800 text-center">{team.name}</h3>
      </div>

      {/* Team info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-center">
          <Calendar size={16} className="text-gray-500 mr-2 flex-shrink-0" />
          <span className="text-sm text-gray-600">Created {formatDate(team.created_at || new Date())}</span>
        </div>

        {team.type && (
          <div className="flex justify-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              team.type === 'A' 
                ? "bg-green-100 text-green-800 border-green-200" 
                : team.type === 'B'
                  ? "bg-blue-100 text-blue-800 border-blue-200"
                  : "bg-purple-100 text-purple-800 border-purple-200"
            }`}>
              <Users size={16} className="mr-1.5" />
              Type {team.type}
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={openEditModal}
          className="flex-1 py-2 text-center text-[#2A6D3A] bg-white border border-[#6BBF59]/30 hover:bg-[#F7FAF7] font-medium rounded-lg text-sm transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => setShowDeleteConfirmation(true)}
          className="flex-1 py-2 text-center text-red-600 bg-white border border-red-200 hover:bg-red-50 font-medium rounded-lg text-sm transition-colors"
        >
          Delete
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div ref={deleteModalRef} className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center bg-red-50 px-6 py-4">
              <div className="flex items-center">
                <AlertTriangle size={20} className="text-red-600 mr-2" />
                <h3 className="text-lg font-medium text-red-600">Delete Team</h3>
              </div>
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <span className="font-semibold">{team.name}</span>? 
                This action cannot be undone.
              </p>

              {deleteError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {deleteError}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteTeam}
                  disabled={isDeleting}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 flex justify-center items-center"
                >
                  {isDeleting ? (
                    <Loader size={18} className="animate-spin" />
                  ) : (
                    "Delete Team"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}