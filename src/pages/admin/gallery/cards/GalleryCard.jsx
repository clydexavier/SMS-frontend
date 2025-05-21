import React, { useState } from "react";
import { Eye, Download, Trash2 } from "lucide-react";
import { format } from "date-fns";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import { useParams } from "react-router-dom";
import axiosClient from "../../../../axiosClient";

const GalleryCard = ({ gallery, teamName, onDelete, teamLogo }) => {
  const {intrams_id, event_id} = useParams();
  // Add state for delete confirmation modal
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);


  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return "N/A";
    }
  };

  // Open delete confirmation modal
  const confirmDelete = () => {
    setShowDeleteConfirmation(true);
  };

  // Handle the actual deletion after confirmation
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      // Call the onDelete function passed from parent
      await onDelete(gallery.id);
      
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Error deleting gallery:", error);
      setDeleteError("Failed to delete gallery. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Make authenticated request with responseType blob
      const response = await axiosClient.get(
        `intramurals/${intrams_id}/events/${event_id}/galleries/${gallery.id}/download`,
        {
          responseType: 'blob', // Important for binary data
        }
      );
      
      // Create download link from blob and click it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Use the display_name or create a default filename
      const fileName = gallery.display_name || `team_gallery_${teamName.replace(/\s+/g, '_')}.docx`;
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      // You could show an error toast/notification here
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Use the download_url if available, otherwise fall back to secure_url or file_url
  const downloadUrl = gallery.download_url || gallery.secure_url || gallery.file_url;
  
  // Use the display_name for a better download experience
  const fileName = gallery.display_name || `team_gallery_${teamName.replace(/\s+/g, '_')}.docx`;

  return (
    <div className="bg-white border border-[#E6F2E8] rounded-lg overflow-hidden shadow hover:shadow-md transition-all duration-200">
      <div className="flex flex-col items-center mb-4 mt-4">
        <div className="w-20 h-20 bg-[#E6F2E8] text-[#2A6D3A] rounded-full flex items-center justify-center text-xl font-semibold mb-2 overflow-hidden">
          {teamLogo ? (
            <img 
            src={teamLogo} 
            alt={`Gallery ${gallery.id}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
            }}
            />
          ) : (
            teamName.charAt(0).toUpperCase()
          )}
        </div>
        <h3 className="font-medium text-gray-800 text-center">{teamName}</h3>
      </div>
      
      <div className="p-4">
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">{formatDate(gallery.created_at)}</p>
          <div className="flex space-x-2">
            <a 
              href={downloadUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1.5 text-[#2A6D3A] hover:bg-[#F7FAF7] rounded transition-colors"
              title="View"
            >
              <Eye size={16} />
            </a>
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="p-1.5 text-[#2A6D3A] hover:bg-[#F7FAF7] rounded transition-colors"
              title="Download"
            >
              <Download size={16} />
            </button>
            <button 
              className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
              title="Delete"
              onClick={confirmDelete}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDelete}
        title="Delete Gallery"
        itemName={`Team Gallery for ${teamName}`}
        message={`Are you sure you want to delete this gallery for ${teamName}? This action cannot be undone.`}
        isDeleting={isDeleting}
        error={deleteError}
      />
    </div>
  );
};

export default GalleryCard;