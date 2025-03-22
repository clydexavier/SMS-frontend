import React, { useState } from "react";
import VenueCard from "../../components/admin/VenueCard";
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

  const [search, setSearch] = useState("");

  const filteredVenues = venues.filter((venue) =>
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
          Add venue
        </button>
      </div>

      {/* Filter and List */}
      <div className="flex-1 p-6 bg-gray-100 text-gray-900">
        <Filter search={search} setSearch={setSearch} placeholder="Search venue" />
        <ul className="flex flex-row">
          {filteredVenues.map((venue) => (
            <li key={venue.id}>
              <VenueCard venue={venue} openEditModal={openEditModal} />
            </li>
          ))}
        </ul>
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
