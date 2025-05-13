import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdClose } from "react-icons/io";
import { Loader } from "lucide-react";

export default function IntramuralModal({ 
  isModalOpen, 
  closeModal, 
  addIntramural, 
  updateIntramural, 
  existingIntramural,
  isLoading,
  error
}) {
  const initialState = {
    name: "",
    location: "",
    status: "pending",
    start_date: null,
    end_date: null,
  };

  const [formData, setFormData] = useState(initialState);

  // Populate fields when editing or reset when modal opens/closes
  useEffect(() => {
    if (existingIntramural) {
      setFormData({
        name: existingIntramural.name || "",
        location: existingIntramural.location || "",
        status: existingIntramural.status || "pending",
        start_date: existingIntramural.start_date ? new Date(existingIntramural.start_date) : null,
        end_date: existingIntramural.end_date ? new Date(existingIntramural.end_date) : null,
      });
    } else {
      setFormData(initialState);
    }
  }, [existingIntramural, isModalOpen]);

  const handleStartDateChange = (date) => {
    setFormData((prevData) => ({ ...prevData, start_date: date }));
  };

  const handleEndDateChange = (date) => {
    setFormData((prevData) => ({ ...prevData, end_date: date }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      start_date: formData.start_date ? formData.start_date.toISOString().split('T')[0] : null,
      end_date: formData.end_date ? formData.end_date.toISOString().split('T')[0] : null,
    };

    if (existingIntramural) {
      updateIntramural(existingIntramural.id, formattedData);
    } else {
      addIntramural(formattedData);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="relative w-full max-w-md mx-auto">
        <div className="relative bg-white rounded-xl shadow-lg border border-[#E6F2E8] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#E6F2E8] bg-[#F7FAF7]">
            <h3 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              {existingIntramural ? "Update Intramural" : "Add New Intramural"}
            </h3>
            <button
              type="button"
              onClick={closeModal}
              className="cursor-pointer text-[#2A6D3A]/70 hover:bg-[#F7FAF7] hover:text-[#2A6D3A] rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center transition-colors duration-200"
              aria-label="Close modal"
            >
              <IoMdClose size={22} />
            </button>
          </div>

          {/* Form */}
          <form className="p-5" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    Intramural Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                    className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    placeholder="Enter intramural name"
                  />
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                    className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    placeholder="Enter location"
                  />
                </div>



                {/* Dates - Single column layout for consistency */}
                <div>
                  <label htmlFor="start_date" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    Start Date
                  </label>
                  <DatePicker
                    id="start_date"
                    name="start_date"
                    selected={formData.start_date}
                    onChange={handleStartDateChange}
                    selectsStart
                    startDate={formData.start_date}
                    endDate={formData.end_date}
                    className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    placeholderText="Select start date"
                    autoComplete="off"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="end_date" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    End Date
                  </label>
                  <DatePicker
                    id="end_date"
                    name="end_date"
                    selected={formData.end_date}
                    onChange={handleEndDateChange}
                    selectsEnd
                    startDate={formData.start_date}
                    endDate={formData.end_date}
                    minDate={formData.start_date}
                    className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    placeholderText="Select end date"
                    autoComplete="off"
                    required
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end mt-6 space-x-3">
              <button
                type="button"
                onClick={closeModal}
                className="text-[#2A6D3A] bg-white border border-[#E6F2E8] hover:bg-[#F7FAF7] font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-white bg-[#6BBF59] hover:bg-[#5CAF4A] font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200 flex items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader size={16} className="mr-2 animate-spin" />
                    {existingIntramural ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  existingIntramural ? "Update Intramural" : "Add Intramural"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}