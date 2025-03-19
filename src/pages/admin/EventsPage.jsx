import React, { useState } from "react";
import { Link } from "react-router-dom";
import EventCard from "../../components/admin/EventCard";
import Filter from "../../components/Filter";
import { IoMdClose } from "react-icons/io";


const eventsData = [
  {
    id: 1,
    name: "Basketball",
    type: "Double elim",
    participants: 4,
    venue: "VSU",
    status: "complete",
    date: "March 2025",
  },
  {
    id: 2,
    name: "Volleyball",
    type: "Double elim",
    participants: 0,
    venue: "SLSU",
    status: "pending",
    date: "January 2025",
  },
];


export default function EventsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    venue: "",
    participants: "",
    description: "",
    status: "pending",
    date:"",
  });

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

  const filteredEvents = eventsData.filter((event) =>
    (activeTab === "all" || event.status === activeTab) &&
    event.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full">
      {/* Section name */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-[#006600]">Events</h2>
      </div>

      {/* Add Button */}
      <div className="flex justify-end pt-4 pb-4 pr-4 mb-4 bg-gray-100">
        <button
          type="button"
          onClick={openModal}
          className="cursor-pointer focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
        >
          Add event
        </button>
      </div>

      {/* Events List */}
      <div className="flex-1 p-6 bg-gray-100 text-gray-900">
      <ul className="flex flex-row">
        {filteredEvents.map((event) => (
          <li key={event.id}>
            <Link to="/intramural" state={{ id: event.id }}>
              <EventCard event={event} />
            </Link>
          </li>
        ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs">
          <div className="relative p-4 w-full max-w-md">
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add New Intramural
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

              {/* Modal body */}
              <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Type intramural name"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      id="name"
                      value={formData.location}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Type intramural name"
                      required
                    />
                  </div>
                  
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="price"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="$2999"
                      required
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="category"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    >
                      <option value="">Select category</option>
                      <option value="TV">TV/Monitors</option>
                      <option value="PC">PC</option>
                      <option value="GA">Gaming/Console</option>
                      <option value="PH">Phones</option>
                    </select>
                  </div>
                  
                </div>
                <button type="button" class=" cursor-pointer focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900" onClick={handleSubmit}>
                  Add new intramural
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
