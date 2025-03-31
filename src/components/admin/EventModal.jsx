import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdClose } from "react-icons/io";
import { useParams } from "react-router-dom";

export default function EventModal({ 
  isModalOpen, 
  closeModal, 
  addEvent, 
  updateEvent, 
  existingEvent
}) {
  const { intrams_id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    tournament_type: "",
    category: "",
    intrams_id: intrams_id, // Fix: just use the value, not an object
    type: "",
    gold: "",
    silver: "",
    bronze: "",
    venue: "",
    status: "pending",
  });

  useEffect(() => {
    if (existingEvent) {
      setFormData({
        name: existingEvent.name || "",
        category: existingEvent.category || "",
        type: existingEvent.type || "",
        gold: existingEvent.gold || "",
        silver: existingEvent.silver || "",
        bronze: existingEvent.bronze || "",
        intrams_id: intrams_id, 
        tournament_type: existingEvent.tournament_type || "",
        venue: existingEvent.venue || "",
        status: existingEvent.status || "pending", 
      });
    } else {
      setFormData({
        name: "",
        category:"",
        type:"",
        gold:"",
        silver: "",
        bronze: "",
        intrams_id: intrams_id, 
        tournament_type: "",
        status: "pending",
        venue: "", 
      });
    }
  }, [existingEvent, intrams_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (existingEvent) {
      updateEvent(existingEvent.id, formData);
    } else {
      addEvent(formData);
    }
    closeModal();
  };

  const handleNumberInput = (e) => {
    if (e.key === "." || e.key === ",") {
      e.preventDefault();
    }
  }

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs">
        <div className="relative p-4 w-full max-w-md">
          <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {existingEvent ? "Update Event" : "Add New Event"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="cursor-pointer text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <IoMdClose size={25} />
                <span className="sr-only">Close modal</span>
              </button>
            </div>
    
            {/* Form */}
            <form className="p-4 md:p-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 grid-cols-2">
                {/* Name */}
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Type event name"
                    required
                  />
                </div>
    
                {/* Tournament Type */}
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Tournament Type
                  </label>
                  <select
                    name="tournament_type"
                    value={formData.tournament_type}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  >
                    <option value="" disabled>Select event category</option>
                    <option value="single elimination">Single Elimination</option>
                    <option value="double elimination">Double Elimination</option>
                  </select>
                </div>
                {/* Category */}
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  >
                    <option value="" disabled>Select event category</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>

                {/* Type */}
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  >
                    <option value="" disabled>Select event type</option>
                    <option value="sports">Sports</option>
                    <option value="music">Music</option>
                    <option value="dance">Dance</option>
                  </select>
                </div>
                {/* Gold */}
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Gold
                  </label>
                  <input
                    type="number"
                    name="gold"
                    value={formData.gold}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter number of golds"
                    required
                    min={1}
                    pattern="[0-9]*"
                    onKeyDown={handleNumberInput}
                  />
                </div>
                {/* Silver */}
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Silver
                  </label>
                  <input
                    type="number"
                    name="silver"
                    value={formData.silver}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter number of silvers"
                    required
                    min={1}
                    pattern="[0-9]*"
                    onKeyDown={handleNumberInput}
                  />
                </div>
                {/* Bronze */}
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Bronze
                  </label>
                  <input
                    type="number"
                    name="bronze"
                    value={formData.bronze}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter number of bronzes"
                    required
                    min={1}
                    pattern="[0-9]*"
                    onKeyDown={handleNumberInput}
                  />
                </div>
              </div>
    
              {/* Submit Button */}
              <button
                type="submit"
                className="cursor-pointer focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
              >
                {existingEvent ? "Update Event" : "Add New Event"}
              </button>
            </form>
          </div>
        </div>
      </div>
    ) 
  );
}
