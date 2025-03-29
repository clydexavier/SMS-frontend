import React, { useState } from "react";
import Filter from "../../components/Filter";
import VenueModal from "../../components/admin/VenueModal";

export default function VenuesPage() {
  const [venues, setVenues] = useState([
    {
      id: 1,
      name: "VSU Gym",
      location: "Visayas State University",
      capacity: 500,
      type: "indoor",
    },
    {
      id: 2,
      name: "SLSU Court",
      location: "Southern Leyte State University",
      capacity: 300,
      type: "outdoor",
    },
  ]);

  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openEditModal = (venue) => {
    setSelectedVenue(venue);
    setIsModalOpen(true);
  };

  const updateVenue = (id, updatedData) => {
    setVenues((prev) => prev.map((v) => (v.id === id ? { ...v, ...updatedData } : v)));
    setSelectedVenue(null);
  };

  const addVenue = (newVenue) => {
    setVenues([...venues, { id: venues.length + 1, ...newVenue }]);
  };

  const openModal = () => {
    setSelectedVenue(null);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filteredVenues = venues.filter(
    (venue) =>
      (activeTab === "all" || venue.status === activeTab) &&
    venue.name.toLowerCase().includes(search.toLowerCase())
  );

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
        >
          Add Venue
        </button>
      </div>

      {/* Filter and Table */}
      <div className="flex-1 p-6 bg-gray-100 text-gray-900">
        <Filter
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          search={search}
          setSearch={setSearch}
          placeholder="Search venue"
        />

        {/* Venue Table */}
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
                  Capacity
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
                    {venue.capacity}
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
      </div>

      {/* Venue Modal */}
      <VenueModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        addVenue={addVenue}
        updateVenue={updateVenue}
        existingVenue={selectedVenue}
      />
    </div>
  );
}
