import React, { useState, useEffect } from "react";
import Filter from "../../components/Filter";
import VenueModal from "../../components/admin/VenueModal";
import PaginationControls from "../../components/PaginationControls";
import { useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";

export default function VenuesPage() {
  const { intrams_id } = useParams();

  // State
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 12,
    total: 0,
    lastPage: 1,
  });

  const filterOptions = [
    { label: "All", value: "All" },
    { label: "Indoor", value: "Indoor" },
    { label: "Outdoor", value: "Outdoor" },
  ];

  const openModal = () => {
    setSelectedVenue(null);
    setIsModalOpen(true);
  };

  const openEditModal = (venue) => {
    setSelectedVenue(venue);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVenue(null);
    setError(null);
  };

  const fetchVenues = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/intramurals/${intrams_id}/venues`, {
        params: {
          page,
          type: activeTab,
          search,
        },
      });
      setVenues(data.data);
      setPagination({
        currentPage: data.meta.current_page,
        perPage: data.meta.per_page,
        total: data.meta.total,
        lastPage: data.meta.last_page,
      });
    } catch (err) {
      setError("Failed to fetch venues");
      console.error("Error fetching venues:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const addVenue = async (newVenue) => {
    try {
      setLoading(true);
      await axiosClient.post(`/intramurals/${intrams_id}/venues/create`, newVenue);
      await fetchVenues();
      closeModal();
    } catch (err) {
      setError("Failed to create venue");
      console.error("Error creating venue:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateVenue = async (id, updatedData) => {
    try {
      setLoading(true);
      await axiosClient.patch(`/intramurals/${intrams_id}/venues/${id}/edit`, updatedData);
      await fetchVenues();
      closeModal();
    } catch (err) {
      setError("Failed to update venue");
      console.error("Error updating venue:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteVenue = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${name}?`);
    if (confirmDelete) {
      try {
        setLoading(true);
        await axiosClient.delete(`/intramurals/${intrams_id}/venues/${id}`);
        await fetchVenues();
      } catch (err) {
        setError("Failed to delete venue");
        console.error("Error deleting venue:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Debounced fetch
  useEffect(() => {
    setLoading(true);
    setError(null);
    const delayDebounce = setTimeout(() => {
      if (intrams_id) {
        fetchVenues(pagination.currentPage);
      }
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [search, activeTab, pagination.currentPage, intrams_id]);
  

  const SkeletonLoader = () => (
    <div className="animate-pulse overflow-x-auto">
      <div className="shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>{[1, 2, 3, 4].map((i) => <th key={i} className="px-6 py-3"><div className="h-4 bg-gray-200 rounded w-20"></div></th>)}</tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, row) => (
              <tr key={row}>{[1, 2, 3, 4].map((col) => <td key={col} className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full text-sm">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-[#006600]">Venues</h2>
      </div>
      <div className="w-full bg-gray-100 pt-4 pb-4 px-4 mb-4">
        <div className="flex justify-end">
          <button
            type="button"
            className="cursor-pointer focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 rounded-lg text-sm px-5 py-2.5 mb-2"
            onClick={openModal}
            disabled={loading}
          >
            Add Venue
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      <div className="flex-1 p-2 sm:p-4 md:p-6 bg-gray-100 text-gray-900 rounded-lg">
        <Filter
          activeTab={activeTab}
          setActiveTab={(value) => {
            setPagination((prev) => ({ ...prev, currentPage: 1 }));
            setActiveTab(value);
          }}
          search={search}
          setSearch={(value) => {
            setPagination((prev) => ({ ...prev, currentPage: 1 }));
            setSearch(value);
          }}
          placeholder="Search venue name"
          filterOptions={filterOptions}
        />

        {loading ? (
          <SkeletonLoader />
        ) : venues.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No venues found. Click "Add Venue" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {venues.map((venue) => (
                  <tr key={venue.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{venue.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{venue.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{venue.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-4" onClick={() => openEditModal(venue)}>Edit</button>
                      <button className="text-red-600 hover:text-red-900" onClick={() => deleteVenue(venue.id, venue.name)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PaginationControls pagination={pagination} handlePageChange={handlePageChange} />
          </div>
        )}
      </div>

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
