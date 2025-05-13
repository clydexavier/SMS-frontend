// GalleryPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../../axiosClient";
import Filter from "../../components/Filter";
import GenerateGalleryModal from "./modal/GenerateGalleryModal";
import GalleryCard from "./cards/GalleryCard";
import { Image, Loader } from "lucide-react";

export default function GalleryPage() {
  const { intrams_id, event_id } = useParams();

  const [eventData, setEventData] = useState({ id: "", name: "" });
  const [galleriesByTeam, setGalleriesByTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [filterOptions, setFilterOptions] = useState([{ label: "All", value: "All" }]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/intramurals/${intrams_id}/events/${event_id}/galleries`);
      
      setEventData(data.event);
      setGalleriesByTeam(data.galleries_by_team);
      
      // Create filter options from teams
      const teamOptions = data.galleries_by_team.map(team => ({
        label: team.team_name,
        value: team.team_id.toString()
      }));
      
      setFilterOptions([{ label: "All", value: "All" }, ...teamOptions]);
    } catch (err) {
      console.error("Error fetching galleries:", err);
      setError("Failed to load gallery items");
    } finally {
      setLoading(false);
    }
  };

  const generateGallery = async (data) => {
    try {
      setLoading(true); // Set loading state while generating gallery
      await axiosClient.post(`/intramurals/${intrams_id}/events/${event_id}/galleries/create`, data);
      await fetchGalleries(); // Refresh the gallery list after generation
      return true;
    } catch (err) {
      console.error("Error generating gallery:", err);
      throw err;
    } finally {
      setLoading(false); // Ensure loading state is reset even if there's an error
    }
  };

  const deleteGallery = async (id) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this gallery item?");
      if (!confirm) return;
      
      // Optimistically update the UI first
      const updatedGalleriesByTeam = galleriesByTeam.map(teamGallery => ({
        ...teamGallery,
        galleries: teamGallery.galleries.filter(gallery => gallery.id !== id)
      }));
      
      // Filter out any teams that now have zero galleries
      const filteredGalleriesByTeam = updatedGalleriesByTeam.filter(
        teamGallery => teamGallery.galleries.length > 0
      );
      
      // Update state immediately
      setGalleriesByTeam(filteredGalleriesByTeam);
      
      // Then perform the actual delete operation
      setLoading(true);
      await axiosClient.delete(`/intramurals/${intrams_id}/events/${event_id}/galleries/${id}`);
      
      // Refresh the gallery list to ensure data consistency
      await fetchGalleries();
    } catch (err) {
      console.error("Error deleting gallery:", err);
      setError("Failed to delete gallery item");
      // If the delete failed, refresh to restore the correct state
      fetchGalleries();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (intrams_id && event_id) {
      fetchGalleries();
    }
  }, [intrams_id, event_id]);

  // Filter galleries based on active tab and search
  const filteredGalleries = galleriesByTeam.filter(team => {
    // Apply team filter
    if (activeTab !== "All" && team.team_id.toString() !== activeTab) {
      return false;
    }
    
    // Apply search filter (to team names)
    if (search && !team.team_name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full h-full flex-1 flex flex-col">
        {/* Main container with overflow handling */}
        <div className="flex flex-col w-full h-full bg-gray-75 p-3 sm:p-5 md:p-6 rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {/* Header section with responsive layout */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
                <Image size={20} className="mr-2" /> Gallery
              </h2>
              {eventData.name && (
                <p className="text-gray-600 text-sm mt-1">Event: {eventData.name}</p>
              )}
            </div>
            <button
              type="button"
              className="bg-[#6BBF59] hover:bg-[#5CAF4A] text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-300 text-sm font-medium flex items-center w-full sm:w-auto justify-center"
              disabled={loading}
              onClick={() => setIsModalOpen(true)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Generate Gallery
            </button>
          </div>
          
          {/* Filter section */}
          <div className="mb-4">
            <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md border border-[#E6F2E8]">
              <Filter
                activeTab={activeTab}
                setActiveTab={(value) => {
                  setActiveTab(value);
                }}
                search={search}
                setSearch={(value) => {
                  setSearch(value);
                }}
                placeholder="Search team name"
                filterOptions={filterOptions}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center mb-4">
              {error}
            </div>
          )}

          {/* Scrollable content area */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {loading ? (
              <div className="flex justify-center items-center py-16 bg-white rounded-xl border border-[#E6F2E8] shadow-md">
                <Loader size={32} className="animate-spin text-[#2A6D3A]" />
              </div>
            ) : filteredGalleries.length === 0 ? (
              <div className="flex-1 bg-white p-4 sm:p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8]">
                <Image size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600">No gallery entries found</h3>
                <p className="text-gray-500 mt-1">Click "Generate Gallery" to create one</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto">
                {filteredGalleries.flatMap(teamGallery => 
                  teamGallery.galleries.map(gallery => (
                    <GalleryCard 
                      key={gallery.id}
                      gallery={gallery}
                      teamName={teamGallery.team_name}
                      onDelete={deleteGallery}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Generate Gallery Modal */}
      <GenerateGalleryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={generateGallery}
        intrams_id={intrams_id}
        event_id={event_id}
      />
    </div>
  );
}