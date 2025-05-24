import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import IntramuralCard from "./card/IntramuralCard";
import IntramuralModal from "./modal/IntramuralModal";
import Filter from "../../components/Filter";
import PaginationControls from "../../components/PaginationControls";
import { useLocation, useParams } from "react-router-dom";
import { Trophy, Loader } from "lucide-react";

export default function IntramuralsPage() {
  const location = useLocation();
  const { id } = useParams();

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "In Progress", value: "in progress" },
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
  ];

  const [intramurals, setIntramurals] = useState([]);
  const [selectedIntramural, setSelectedIntramural] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  // Pagination states
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 12,
    total: 0,
    lastPage: 1,
  });

  const openModal = () => {
    setSelectedIntramural(null);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedIntramural(null);
    setError(null);
  };
  
  const openEditModal = (intramural) => {
    setSelectedIntramural(intramural);
    setIsModalOpen(true);
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  // Instead of calling fetchIntramurals directly, we trigger a refetch
  const addIntramural = async (newIntramural) => {
    try {
      setLoading(true);
      await axiosClient.post("/intramurals/create", newIntramural);
      setShouldRefetch(prev => !prev); // Toggle to trigger refetch
      closeModal();
    } catch (err) {
      setError("Failed to create intramural");
      console.error("Error creating intramural:", err);
      setLoading(false);
    }
  };

  const updateIntramural = async (id, updatedData) => {
    try {
      setLoading(true);
      await axiosClient.patch(`/intramurals/${id}/edit`, updatedData);
      setShouldRefetch(prev => !prev); // Toggle to trigger refetch
      closeModal();
    } catch (err) {
      setError("Failed to update intramural");
      console.error("Error updating intramural:", err);
      setLoading(false);
    }
  };

  const deleteIntramural = async (intramural) => {
    try {
      await axiosClient.delete(`/intramurals/${intramural.id}`);
      setShouldRefetch(prev => !prev); // Toggle to trigger refetch
      return true;
    } catch (err) {
      setError("Failed to delete intramural");
      console.error("Error deleting intramural:", err);
      throw err; // Re-throw to be caught by the card component
    }
  };

  const handleFilterChange = (value, type) => {
    // Reset pagination to first page when filters change
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    
    if (type === 'tab') {
      setActiveTab(value);
    } else if (type === 'search') {
      setSearch(value);
    }
  };

  // Single source of truth for data fetching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const { data } = await axiosClient.get("/intramurals", {
          params: {
            page: pagination.currentPage,
            status: activeTab,
            search: search,
          },
        });
        
        setIntramurals(data.data);
        setPagination({
          currentPage: data.meta.current_page,
          perPage: data.meta.per_page,
          total: data.meta.total,
          lastPage: data.meta.last_page,
        });
      } catch (err) {
        setError("Failed to fetch intramurals");
        console.error("Error fetching intramurals:", err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search input
    const debounceTimer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [search, activeTab, pagination.currentPage, shouldRefetch]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full h-full flex-1 flex flex-col">
        {/* Main container - removed overflow-hidden to allow parent scrolling */}
        <div className="flex flex-col w-full bg-gray-75 p-3 sm:p-5 md:p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
            <h2 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              <Trophy size={20} className="mr-2" /> Intramurals
            </h2>
            <button
              type="button"
              className="bg-[#6BBF59] hover:bg-[#5CAF4A] text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-300 text-sm font-medium flex items-center w-full sm:w-auto justify-center"
              onClick={openModal}
              disabled={loading}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Intramural
            </button>
          </div>

          {error && (
            <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center mb-4">
              {error}
            </div>
          )}

          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md border border-[#E6F2E8]">
            <Filter
              activeTab={activeTab}
              setActiveTab={(value) => handleFilterChange(value, 'tab')}
              search={search}
              setSearch={(value) => handleFilterChange(value, 'search')}
              placeholder="Search intramural"
              filterOptions={filterOptions}
            />
          </div>

          {/* Content area - removed overflow-y-auto and let parent handle scrolling */}
          <div className="mt-4 flex flex-col">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader size={32} className="animate-spin text-[#2A6D3A]" />
              </div>
            ) : intramurals.length === 0 ? (
              <div className="bg-white p-4 sm:p-8 rounded-xl text-center shadow-sm border border-[#E6F2E8]">
                <Trophy size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600">No intramurals found</h3>
                <p className="text-gray-500 mt-1">Click "Add Intramural" to create one</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-4">
                {intramurals.map((intramural) => (
                  <div key={intramural.id} className="bg-white rounded-xl border border-[#E6F2E8] shadow-sm">
                    <IntramuralCard
                      intramural={intramural}
                      openEditModal={openEditModal}
                      deleteIntramural={deleteIntramural}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && intramurals.length > 0 && (
            <div className="bg-white shadow-md rounded-xl border border-[#E6F2E8] p-2 mt-4">
              <PaginationControls
                pagination={pagination}
                handlePageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal Component */}
      <IntramuralModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        addIntramural={addIntramural}
        updateIntramural={updateIntramural}
        existingIntramural={selectedIntramural}
        isLoading={loading}
        error={error}
      />
    </div>
  );
}