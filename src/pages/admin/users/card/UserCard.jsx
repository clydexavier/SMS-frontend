import React, { useState, useEffect, useRef } from "react";
import { User, Mail, Calendar, ShieldCheck, MoreVertical, Trash, Shield } from "lucide-react";
import AssignmentModal from "../modal/AssignmentModal";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";

export default function UserCard({ user, updateUserRole, deleteUser }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  
  // Create refs for options menu
  const optionsMenuRef = useRef(null);
  const optionsButtonRef = useRef(null);

  const roleColors = {
    admin: "bg-purple-100 text-purple-800 border-purple-200",
    GAM: "bg-blue-100 text-blue-800 border-blue-200",
    tsecretary: "bg-green-100 text-green-800 border-green-200",
    secretariat: "bg-yellow-100 text-amber-800 border-amber-200",
    scheduler: "bg-amber-100 text-amber-800 border-amber-200",

    user: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const roleStyle = roleColors[user.role] || "bg-gray-100 text-gray-800 border-gray-200";
  
  const toggleOptions = () => {
    setShowOptions(!showOptions);
    if (showRoleDropdown) setShowRoleDropdown(false);
  };

  const toggleRoleDropdown = (e) => {
    e.stopPropagation();
    setShowRoleDropdown(!showRoleDropdown);
    if (showOptions) setShowOptions(false);
  };

  const handleRoleChange = async (newRole) => {
    setShowRoleDropdown(false);
    
    if (newRole === 'admin' || newRole === 'secretariat' || newRole === 'user' || newRole  === 'scheduler') {
      // Directly update role for admin, secretariat, and user
      await updateUserRole(user.id, { role: newRole });
    } else {
      // For GAM and tsecretary, open assignment modal
      setSelectedRole(newRole);
      setShowAssignmentModal(true);
    }
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

  // Get first letter of first and last name for avatar
  const getInitials = (name) => {
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  // Open delete confirmation modal
  const confirmDeleteUser = () => {
    setShowOptions(false);
    setShowDeleteConfirmation(true);
  };

  // Handle the actual deletion after confirmation
  const handleDeleteUser = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      // Call the deleteUser function passed from parent
      await deleteUser(user);
      
      // The parent function will handle the actual API call
      // and data refetching, so we just need to close the modal
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      setDeleteError("Failed to delete user. Please try again.");
      setIsDeleting(false);
    }
    // We don't need the finally block here because the parent's deleteUser
    // function will handle the completion, and this modal will be unmounted
  };
  
  // Handle clicks outside of the options menu
  useEffect(() => {
    function handleClickOutside(event) {
      // Close options menu when clicking outside
      if (showOptions && 
          optionsMenuRef.current && 
          !optionsMenuRef.current.contains(event.target) &&
          optionsButtonRef.current && 
          !optionsButtonRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }
    
    // Add event listener when options menu is shown
    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);

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
              onClick={confirmDeleteUser}
              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
            >
              <Trash size={16} className="mr-2" />
              Delete User
            </button>
          </div>
        )}
      </div>

      {/* User avatar */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-20 h-20 bg-[#E6F2E8] text-[#2A6D3A] rounded-full flex items-center justify-center text-xl font-semibold mb-2">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            getInitials(user.name)
          )}
        </div>
        <h3 className="font-medium text-gray-800 text-center">{user.name}</h3>
      </div>

      {/* User info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start">
          <Mail size={16} className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
          <span className="text-sm text-gray-700 break-words">{user.email}</span>
        </div>
        
        <div className="flex items-center">
          <Calendar size={16} className="text-gray-500 mr-2 flex-shrink-0" />
          <span className="text-sm text-gray-600">Joined {formatDate(user.created_at)}</span>
        </div>

        {/* Role-specific assignments */}
        {user.role === 'GAM' && (user.team_id || user.intrams_id) && (
          <div className="pt-1">
            {user.team_name && (
              <div className="inline-flex items-center px-2 py-1 mr-1 mb-1 rounded-md bg-blue-50 text-blue-700 text-xs">
                <span>Team: {user.team_name}</span>
              </div>
            )}
            {user.intrams_name && (
              <div className="inline-flex items-center px-2 py-1 mb-1 rounded-md bg-green-50 text-green-700 text-xs">
                <span>Intramural: {user.intrams_name}</span>
              </div>
            )}
          </div>
        )}

        {user.role === 'tsecretary' && (user.event_id || user.intrams_id) && (
          <div className="pt-1">
            {user.intrams_name && (
              <div className="inline-flex items-center px-2 py-1 mr-1 mb-1 rounded-md bg-green-50 text-green-700 text-xs">
                <span>Intramural: {user.intrams_name}</span>
              </div>
            )}
            {user.event_name && (
              <div className="inline-flex items-center px-2 py-1 mb-1 rounded-md bg-amber-50 text-amber-700 text-xs">
                <span>Event: {user.event_name}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Role badge with dropdown */}
      <div className="relative">
        <button
          onClick={toggleRoleDropdown}
          className={`flex items-center px-3 py-1.5 rounded-full border text-sm font-medium ${roleStyle} hover:opacity-90 transition-opacity w-full justify-center`}
        >
          <ShieldCheck size={16} className="mr-1.5" />
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </button>

        {showRoleDropdown && (
          <div className="absolute left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            <button
              onClick={() => handleRoleChange('admin')}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <Shield size={16} className="mr-2 text-purple-600" />
              Admin
            </button>
            <button
              onClick={() => handleRoleChange('GAM')}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <Shield size={16} className="mr-2 text-blue-600" />
              GAM
            </button>
            <button
              onClick={() => handleRoleChange('tsecretary')}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <Shield size={16} className="mr-2 text-green-600" />
              Tournament Secretary
            </button>
            <button
              onClick={() => handleRoleChange('secretariat')}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <Shield size={16} className="mr-2 text-amber-600" />
              Secretariat
            </button>
            <button
              onClick={() => handleRoleChange('scheduler')}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <Shield size={16} className="mr-2 text-yellow-600" />
              Scheduler
            </button>
            <button
              onClick={() => handleRoleChange('user')}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <Shield size={16} className="mr-2 text-gray-600" />
              User
            </button>
          </div>
        )}
      </div>

      {/* Assignment Modal Component */}
      <AssignmentModal 
        show={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        selectedRole={selectedRole}
        userId={user.id}
        updateUserRole={updateUserRole}
      />

      {/* Delete Confirmation Modal - Using the reusable component */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        itemName={user.name}
        message={`Are you sure you want to delete ${user.name}? This action cannot be undone.`}
        isDeleting={isDeleting}
        error={deleteError}
      />
    </div>
  );
}