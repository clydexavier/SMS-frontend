import React, { useState, useEffect } from "react";
import Filter from "../../components/Filter";
import VenueModal from "../../components/admin/VenueModal";
import { useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";

export default function VenuesPage() {
  const { intrams_id } = useParams();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openEditModal = (venue) => {
    setSelectedVenue(venue);
    setIsModalOpen(true);
  };

  // Create new venue
  const addVenue = async (newVenue) => {
    try {
      setLoading(true);
      await axiosClient.post(`/intramurals/${intrams_id}/venues/create`, newVenue);
      fetchVenues();
      closeModal();
    } catch (err) {
      setError("Failed to create venue");
      console.error("Error creating venue:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update existing venue
  const updateVenue = async (id, updatedData) => {
    try {
      setLoading(true);
      await axiosClient.patch(`/intramurals/${intrams_id}/venues/${id}/edit`, updatedData);
      fetchVenues();
      closeModal();
    } catch (err) {
      setError("Failed to update venue");
      console.error("Error updating venue:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete venue
  const deleteVenue = async (id) => {
    try {
      setLoading(true);
      await axiosClient.delete(`/intramurals/${intrams_id}/venues/${id}`);
      fetchVenues();
    } catch (err) {
      setError("Failed to delete venue");
      console.error("Error deleting venue:", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setSelectedVenue(null);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVenue(null);
    setError(null);
  };

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filteredVenues = venues.filter(
    (venue) =>
      (activeTab === "all" || venue.type === activeTab) &&
      (typeof venue.name === 'string' ? venue.name.toLowerCase().includes(search.toLowerCase()) : false)
  );

  // Fetch all venues
  const fetchVenues = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/intramurals/${intrams_id}/venues`);
      setVenues(data);
    } catch (err) {
      setError("Failed to fetch venues");
      console.error("Error fetching venues:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (intrams_id) {
      fetchVenues();
    }
  }, [intrams_id]);

  return (
    <div className="flex flex-col w-full h-full">
      {/* Section Title */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-[#006600]">Venues</h2>
      </div>

      {/* Add Button */}
      <div className="flex justify-end pt-4 pb-4 pr-4 mb-4 bg-gray-100">
        <button
          type="button"
          className="cursor-pointer focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          onClick={openModal}
          disabled={loading}
        >
          Add Venue
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {/* Filter and Table */}
      <div className="flex-1 p-6 bg-gray-100 text-gray-900">
        <Filter
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          search={search}
          setSearch={setSearch}
          placeholder="Search venue"
        />

        {venues.length === 0 && !loading ? (
          <div className="text-center py-8 text-gray-500">
            No venues found. Click "Add Venue" to create one.
          </div>
        ) : (
          /* Venue Table */
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVenues.map((venue) => (
                  <tr key={venue.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {venue.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {venue.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {venue.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => openEditModal(venue)}
                      >
                        Edit
                      </button>
                      <button
                        className="ml-4 text-red-600 hover:text-red-900"
                        onClick={() => deleteVenue(venue.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Venue Modal */}
      <VenueModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        addVenue={addVenue}
        updateVenue={updateVenue}
        existingVenue={selectedVenue}
        isLoading={loading}
        error={error}
      />
    </div>
  );
}