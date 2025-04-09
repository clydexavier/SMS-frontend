import React, { useState, useEffect } from "react";
import axiosClient from "../../axiosClient";
import IntramuralCard from "../../components/IntramuralCard";
import Filter from "../../components/Filter";
import IntramuralModal from "../../components/admin/IntramuralModal";

export default function IntramuralsPage() {
  const filterOptions = [
    { label: "All", value: "all" },
    { label: "In Progress", value: "in progress" },
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
  ];

  //Intramurals State
  const [intramurals, setIntramurals] = useState([]);
  const [selectedIntramural, setSelectedIntramural] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setSelectedIntramural(null);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  
  const openEditModal = (intramural) => {
    setSelectedIntramural(intramural);
    setIsModalOpen(true);
  };

  //Filter state
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filteredIntramurals = intramurals.filter((intramural) =>
    (activeTab === "all" || intramural.status === activeTab) &&
    intramural.name.toLowerCase().includes(search.toLowerCase())
  );

  
  //CRUD REQUESTS
  // Create new intramural
const addIntramural = async (newIntramural) => {
  try {
    setLoading(true);
    await axiosClient.post("/intramurals/create", newIntramural);
    await fetchIntramurals();
    closeModal();
  } catch (err) {
    setError("Failed to create intramural");
    console.error("Error creating intramural:", err);
  } finally {
    setLoading(false);
  }
};

// Update existing intramural
const updateIntramural = async (id, updatedData) => {
  try {
    setLoading(true);
    await axiosClient.patch(`/intramurals/${id}/edit`, updatedData);
    await fetchIntramurals();
    closeModal();
  } catch (err) {
    setError("Failed to update intramural");
    console.error("Error updating intramural:", err);
  } finally {
    setLoading(false);
  }
};

// Delete intramural
const deleteIntramural = async (id) => {
  try {
    setLoading(true);
    await axiosClient.delete(`/intramurals/${id}`);
    await fetchIntramurals();
  } catch (err) {
    setError("Failed to delete intramural");
    console.error("Error deleting intramural:", err);
  } finally {
    setLoading(false);
  }
};

// Fetch all intramurals
const fetchIntramurals = async () => {
  try {
    setLoading(true);
    const { data } = await axiosClient.get('/intramurals');
    setIntramurals(data);
  } catch (err) {
    setError("Failed to fetch intramurals");
    console.error("Error fetching intramurals:", err);
  } finally {
    setLoading(false);
  }
};

  // Initial load
  useEffect(() => {
    fetchIntramurals();
  }, []);

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="w-full h-40 p-4 bg-gray-300 animate-pulse rounded-md"
        >
          <div className="w-3/4 h-4 bg-gray-400 mb-3 rounded" />
          <div className="w-1/2 h-4 bg-gray-400 mb-2 rounded" />
          <div className="w-full h-2 bg-gray-400 rounded" />
          <div className="w-5/6 h-2 bg-gray-400 mt-2 rounded" />
        </div>
      ))}
    </div>
  ); 

  return (
    <div className="flex flex-col w-full h-full text-sm sm:text-xs md:text-sm lg:text-base">
      {/* Section Title */}
      <div>
        <h2 className="text-xl sm:text-lg md:text-xl font-semibold mb-2 text-[#006600]">Intramurals</h2>
      </div>
    
      {/* Add Button */}
      <div className="w-full bg-gray-100 pt-4 pb-4 px-4 mb-4">
        <div className="flex justify-end">
          <button
            type="button"
            className="cursor-pointer focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 rounded-lg text-sm sm:text-xs md:text-sm lg:text-base px-5 py-2.5 mb-2"
            onClick={openModal}
          >
            Add intramural
          </button>
        </div>
      </div>
    
      {/* Filter and List */}
      <div className="flex-1 p-6 bg-gray-100 text-gray-900">
        <Filter
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          search={search}
          setSearch={setSearch}
          placeholder="Search intramural"
          filterOptions={filterOptions}
        />

{loading ? (
          /* Skeleton Loader */
          <SkeletonLoader />
        ) : intramurals.length === 0 ? (
          /* Empty State */
          <div className="text-center py-8 text-gray-500">
            No intramurals found. Click "Add Intramural" to create one.
          </div>
        ) : (
          <div className="w-full mt-4">
          {/* Updated card container with proper responsive grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredIntramurals.map((intramural) => (
              <div key={intramural.id}
              className="w-full h-40 p-4 bg-red-200 outline outline-1 outline-black rounded-md">
                <IntramuralCard
                  intramural={intramural}
                  openEditModal={openEditModal}
                  deleteIntramural={deleteIntramural}
            />
              </div>
            ))}
          </div>
          
          {/* Empty state message */}
          {filteredIntramurals.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No intramurals found. Click "Add event" to create one.
            </div>
          )}
        </div>
        )}

        
      </div>
    
      {/* Intramural Modal */}
      <IntramuralModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        addIntramural={addIntramural}
        updateIntramural={updateIntramural}
        existingIntramural={selectedIntramural}
      />
    </div>
  );
}