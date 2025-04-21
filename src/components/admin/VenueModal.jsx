import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

export default function VenueModal({ 
  isModalOpen, 
  closeModal, 
  addVenue, 
  updateVenue, 
  existingVenue 
}) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    type: "",
  });

  useEffect(() => {
    if (existingVenue) {
      setFormData({
        name: existingVenue.name || "",
        location: existingVenue.location || "",
        type: existingVenue.type || "",
      });
    } else {
      setFormData({ name: "", location: "", type: "" });
    }
  }, [existingVenue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (existingVenue) {
      updateVenue(existingVenue.id, formData);
    } else {
      addVenue(formData);
    }
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
        <div className="relative p-4 w-full max-w-md">
          <div className="relative bg-white rounded-lg shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b rounded-t border-[#E6F2E8]">
              <h3 className="text-lg font-semibold text-[#2A6D3A]">
                {existingVenue ? "Update Venue" : "Add New Venue"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="cursor-pointer text-[#2A6D3A]/70 bg-transparent hover:bg-[#F7FAF7] hover:text-[#2A6D3A] rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center transition-colors duration-200"
              >
                <IoMdClose size={22} />
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            {/* Form */}
            <form className="p-4 md:p-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 grid-cols-2">
                {/* Venue Name */}
                <div className="col-span-2">
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="off"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-white border border-[#6BBF59]/30 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-[#6BBF59]/50 focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    placeholder="Enter venue name"
                    required
                  />
                </div>

                {/* Location */}
                <div className="col-span-2">
                  <label htmlFor="location" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    autoComplete="off"
                    value={formData.location}
                    onChange={handleChange}
                    className="bg-white border border-[#6BBF59]/30 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-[#6BBF59]/50 focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    placeholder="Enter venue location"
                    required
                  />
                </div>

                {/* Type */}
                <div className="col-span-2">
                  <label htmlFor="type" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    Type
                  </label>
                  <select
                    name="type"
                    id="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="bg-white border border-[#6BBF59]/30 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-[#6BBF59]/50 focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    required
                  >
                    <option value="" disabled>Select type</option>
                    <option value="Indoor">Indoor</option>
                    <option value="Outdoor">Outdoor</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end mt-4 space-x-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="text-[#2A6D3A] bg-white border border-[#6BBF59]/30 hover:bg-[#F7FAF7] font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="text-white bg-[#6BBF59] hover:bg-[#5CAF4A] font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200 focus:ring-2 focus:ring-[#6BBF59]/50"
                >
                  {existingVenue ? "Update Venue" : "Add New Venue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
}
