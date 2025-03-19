import React, { useState } from "react";
import { Link } from "react-router-dom";
import IntramuralCard from "../../components/IntramuralCard";
import Filter from "../../components/Filter";
import IntramuralModal from "../../components/admin/IntramuralModal";



export default function IntramuralsPage() {

  const [intramurals, setIntramurals] = useState([
    {
      id: 1,
      name: "Salingkusog",
      location: "VSU",
      status: "complete",
      start_date: "March 2025",
      end_date: "March 2025",
    },
    {
      id: 2,
      name: "Saling Ina mo",
      location: "SLSU",
      status: "pending",
      start_date: "January 2025",
      end_date: "March 2025",
    },
  ]);
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    closeModal(); // Close modal after submission
  };

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filteredIntramurals = intramurals.filter((intramural) =>
    (activeTab === "all" || intramural.status === activeTab) &&
    intramural.name.toLowerCase().includes(search.toLowerCase())
  );

  const addIntramural = (newIntramural) => {
    setIntramurals([...intramurals, { id: intramurals.length + 1, ...newIntramural }]);
  };

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
              <Link to="/intramural/events" state={{ id: intramural.id }}>
                <IntramuralCard intramural={intramural} />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Intramural Modal */}
      <IntramuralModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        addIntramural={addIntramural}
      />
    </div>
  );
}