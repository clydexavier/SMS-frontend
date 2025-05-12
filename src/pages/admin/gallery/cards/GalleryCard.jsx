import React from "react";
import { Eye, Download, Trash2 } from "lucide-react";
import { format } from "date-fns";

const GalleryCard = ({ gallery, teamName, onDelete }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return "N/A";
    }
  };

  return (
    <div className="bg-white border border-[#E6F2E8] rounded-lg overflow-hidden shadow hover:shadow-md transition-all duration-200">
      <div className="relative aspect-video bg-gray-100">
        <img 
          src={gallery.file_url} 
          alt={`Gallery ${gallery.id}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
          }}
        />
      </div>
      <div className="p-4">
        <div className="mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F7FAF7] text-[#2A6D3A] border border-[#E6F2E8]">
            {teamName}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">{formatDate(gallery.created_at)}</p>
          <div className="flex space-x-2">
            <a 
              href={gallery.file_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1.5 text-[#2A6D3A] hover:bg-[#F7FAF7] rounded transition-colors"
              title="View"
            >
              <Eye size={16} />
            </a>
            <a 
              href={gallery.file_url} 
              download
              className="p-1.5 text-[#2A6D3A] hover:bg-[#F7FAF7] rounded transition-colors"
              title="Download"
            >
              <Download size={16} />
            </a>
            <button 
              className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
              title="Delete"
              onClick={() => onDelete(gallery.id, )}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryCard;