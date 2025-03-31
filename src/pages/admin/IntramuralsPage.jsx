import React, { useState, useEffect } from "react";
import axiosClient from "../../axiosClient";
import IntramuralCard from "../../components/IntramuralCard";
import Filter from "../../components/Filter";
import IntramuralModal from "../../components/admin/IntramuralModal";
import { data } from "react-router-dom";

export default function IntramuralsPage() {

  //Intramurals State
  const [intramurals, setIntramurals] = useState([]);
  const [selectedIntramural, setSelectedIntramural] = useState(null);

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
  const addIntramural = (newIntramural) => {
    axiosClient.post("/intramurals/create", newIntramural)
      .then(() => {
        console.log("Intramural created");
        fetchIntramurals(); // Refresh the list
        closeModal();
      })
      .catch(err => {
        console.error("Error creating intramural:", err.response?.data || err);
      });
  };
  
  
  const updateIntramural = (id, updatedData) => {
    axiosClient.patch(`/intramurals/${id}/edit`, updatedData)
      .then(() => {
        console.log("Intramural updated");
        fetchIntramurals(); 
        closeModal();
      })
      .catch(err => {
        console.error("Error updating intramural:", err.response?.data || err);
      });
  };
  
  const deleteIntramural = (id) => {
    axiosClient.delete(`/intramurals/${id}`)
      .then(() => {
        console.log("Intramural deleted");
        fetchIntramurals(); // Refresh the list
      })
      .catch(err => {
        console.error("Error deleting intramural:", err.response?.data || err);
      });
  };

  const fetchIntramurals = () => {
    axiosClient.get('/intramurals')
      .then(({ data }) => setIntramurals(data))
      .catch(err => console.error("Error fetching intramurals:", err));
  };
  

  useEffect(() => {
    fetchIntramurals();
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      {/* Section Title */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-[#006600]">Intramurals</h2>
      </div>

      {/* Add Button */}
      <div className="flex justify-end pt-4 pb-4 pr-4 mb-4 bg-gray-100">
        <button 
          type="button" 
          className="cursor-pointer focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
          onClick={openModal}
        >
          Add intramural
        </button>
      </div>

      {/* Filter and List */}
      <div className="flex-1 p-6 bg-gray-100 text-gray-900">
        <Filter
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          search={search}
          setSearch={setSearch}
          placeholder="Search intramural"
        />
        <ul className="flex flex-row">
          {filteredIntramurals.map((intramural) => (
            <li key={intramural.id}>
              <IntramuralCard intramural={intramural} openEditModal={openEditModal} deleteIntramural={deleteIntramural} />
            </li>
          ))}
        </ul>
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