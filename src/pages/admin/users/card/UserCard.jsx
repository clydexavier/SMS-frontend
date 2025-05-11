import React, { useState, useEffect, useRef } from "react";
import { User, Mail, Calendar, ShieldCheck, MoreVertical, Edit, Trash, Shield, AlertTriangle, X, Loader } from "lucide-react";
import AssignmentModal from "../modal/AssignmentModal";
import axiosClient from "../../../../axiosClient";

export default function UserCard({ user, updateUserRole, deleteUser }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  
  // Create refs for the delete modal and options menu
  const deleteModalRef = useRef(null);
  const optionsMenuRef = useRef(null);
  const optionsButtonRef = useRef(null);

  const roleColors = {
    admin: "bg-purple-100 text-purple-800 border-purple-200",
    GAM: "bg-blue-100 text-blue-800 border-blue-200",
    tsecretary: "bg-green-100 text-green-800 border-green-200",
    secretariat: "bg-amber-100 text-amber-800 border-amber-200",
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
    
    if (newRole === 'admin' || newRole === 'secretariat' || newRole === 'user') {
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

  // Handle user deletion
  async function handleDeleteUser() {
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      // Call the delete API endpoint using the passed deleteUser function
      if (deleteUser) {
        await deleteUser(user.id);
      } else {
        await axiosClient.delete(`/users/${user.id}`);
      }
      
      // Close the modal
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      setDeleteError(
        error.response?.data?.message || 
        "An error occurred while deleting the user. Please try again."
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
          onClick={toggleOptions}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <MoreVertical size={18} className="text-gray-500" />
        </button>

        {showOptions && (
          <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-36 z-20">
            <button
              onClick={() => {
                setShowDeleteConfirmation(true);
                setShowOptions(false);
              }}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div ref={deleteModalRef} className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center bg-red-50 px-6 py-4">
              <div className="flex items-center">
                <AlertTriangle size={20} className="text-red-600 mr-2" />
                <h3 className="text-lg font-medium text-red-600">Delete User</h3>
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
                Are you sure you want to delete <span className="font-semibold">{user.name}</span>? 
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
                  onClick={handleDeleteUser}
                  disabled={isDeleting}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 flex justify-center items-center"
                >
                  {isDeleting ? (
                    <Loader size={18} className="animate-spin" />
                  ) : (
                    "Delete User"
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