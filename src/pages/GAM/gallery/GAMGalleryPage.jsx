// GalleryPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../../axiosClient";
import Filter from "../../components/Filter";
import GalleryCard from "./cards/GalleryCard";
import { Image, Loader } from "lucide-react";
import { useAuth } from "../../../auth/AuthContext";

export default function GAMGalleryPage() {
  const { event_id } = useParams();
  const { user } = useAuth();
  // FIX 1: Correct access to intrams_id and team_id
  const intrams_id = user?.intrams_id;
  const team_id = user?.team_id;

  const [eventData, setEventData] = useState({ id: "", name: "" });
  const [galleriesByTeam, setGalleriesByTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [filterOptions, setFilterOptions] = useState([{ label: "All", value: "All" }]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // FIX 2: Memoize fetchGalleries function with useCallback
  const fetchGalleries = useCallback(async () => {
    // FIX 3: Early return if required data is not available
    if (!intrams_id || !event_id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null); // Clear previous errors
      
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
      if(err.response.status === 400) {
        console.log("xd");
        setError("xd");
        setLoading(false);
        return;
      }
      setError("Failed to load gallery items");
    } finally {
      // FIX 4: Always ensure loading is set to false
      setLoading(false);
    }
  }, [intrams_id, event_id]); // FIX 5: Add dependencies

  // FIX 6: Fix generateGallery to use user's team_id and proper state management
  const generateGallery = useCallback(async () => {
    if (!team_id) {
      setError("No team ID found. Please ensure you're assigned to a team.");
      return;
    }

    try {
      setIsGenerating(true);
      setError(null); // Clear previous errors
      
      const galleryData = {
        team_id: team_id,
      };
      
      await axiosClient.post(`/intramurals/${intrams_id}/events/${event_id}/galleries/create`, galleryData);
      
      // Refresh the gallery list after generation
      await fetchGalleries();
      return true;
    } catch (err) {
      console.error("Error generating gallery:", err);
      setError("Failed to generate gallery. Please try again.");
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [intrams_id, event_id, team_id, fetchGalleries]);

  const deleteGallery = useCallback(async (id) => {
    try {
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
  }, [intrams_id, event_id, galleriesByTeam, fetchGalleries]);

  useEffect(() => {
    fetchGalleries();
  }, [fetchGalleries]); // FIX 7: Use the memoized function as dependency

  // FIX 8: Show loading message if user is not available
  if (!user) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader size={32} className="animate-spin text-[#2A6D3A]" />
        <span className="ml-2 text-gray-600">Loading user data...</span>
      </div>
    );
  }

  // FIX 9: Show error if required IDs are not available
  if (!intrams_id || !event_id) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-red-50 p-4 rounded-lg text-red-600 mb-4">
          <p>Unable to load gallery: {!intrams_id ? 'No intramurals ID found' : 'No event ID found'}.</p>
        </div>
      </div>
    );
  }

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
              className="bg-[#6BBF59] hover:bg-[#5CAF4A] text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-300 text-sm font-medium flex items-center w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || isGenerating || !team_id}
              onClick={generateGallery}
            >
              {isGenerating ? (
                <>
                  <Loader size={16} className="mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Generate Gallery
                </>
              )}
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
            <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center mb-4 flex justify-between items-center">
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          )}

          {/* Show warning if user has no team_id */}
          {!team_id && (
            <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700 text-center mb-4">
              <p>You are not assigned to a team. Contact an administrator to be assigned to a team before generating a gallery.</p>
            </div>
          )}

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
            {loading ? (
              <div className="flex justify-center items-center py-16 bg-white rounded-xl border border-[#E6F2E8] shadow-md">
                <Loader size={32} className="animate-spin text-[#2A6D3A]" />
                <span className="ml-2 text-gray-600">Loading galleries...</span>
              </div>
            ) : filteredGalleries.length === 0 ? (
              <div className="flex-1 bg-white p-4 sm:p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8]">
                <Image size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600">No gallery entries found</h3>
                <p className="text-gray-500 mt-1">
                  {team_id 
                    ? 'Click "Generate Gallery" to create one for your team' 
                    : 'You need to be assigned to a team first'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto">
                {filteredGalleries.flatMap(teamGallery => 
                  teamGallery.galleries.map(gallery => (
                    <GalleryCard 
                      key={gallery.id}
                      gallery={gallery}
                      teamName={teamGallery.team_name}
                      teamLogo={teamGallery.team_logo_url}
                      onDelete={deleteGallery}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}