import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdClose } from "react-icons/io";

export default function IntramuralModal({ 
  isModalOpen, 
  closeModal, 
  addIntramural, 
  updateIntramural, 
  existingIntramural,
}) {
  const [formData, setFormData] = useState({
      name: "",
      location: "",
      status: "pending",
      start_date: null,
      end_date: null,
  });

    // Populate fields when editing
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
        setFormData({
          name: "",
          location: "",
          status: "pending",
          start_date: null,
          end_date: null,
        });
      }
    }, [existingIntramural]);

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

        console.log("Formatted Data:", formattedData);
        console.log("Existing Intramural:", existingIntramural);
      if (existingIntramural) {
        updateIntramural(existingIntramural.id, formattedData);
      } else {
        addIntramural(formattedData);
      }
    };

    // Custom styles for date picker to match theme
    const datePickerWrapperStyles = "relative w-full";
    const datePickerStyles = "border border-[#6BBF59]/30 rounded-lg p-2 w-full text-gray-900 text-sm focus:ring-2 focus:ring-[#6BBF59]/50 focus:border-[#6BBF59]";

    return (
        isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
                <div className="relative p-4 w-full max-w-md">
                    <div className="relative bg-white rounded-lg shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b rounded-t border-[#E6F2E8]">
                            <h3 className="text-lg font-semibold text-[#2A6D3A]">
                                {existingIntramural ? "Update Intramural" : "Add New Intramural"}
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

                        <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className="col-span-2">
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        autoComplete="off"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="bg-white border border-[#6BBF59]/30 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-[#6BBF59]/50 focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                                        placeholder="Type intramural name"
                                        required
                                    />
                                </div>

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
                                        placeholder="Type intramural location"
                                        required
                                    />
                                </div>

                                <div className="col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <div className={datePickerWrapperStyles}>
                                        <label htmlFor="start_date" className="block mb-2 text-sm font-medium text-[#2A6D3A]">Start Date</label>
                                        <DatePicker
                                            id="start_date"
                                            name="start_date"
                                            selected={formData.start_date}
                                            onChange={handleStartDateChange}
                                            selectsStart
                                            startDate={formData.start_date}
                                            endDate={formData.end_date}
                                            className={datePickerStyles}
                                            placeholderText="Select start date"
                                            required
                                        />
                                    </div>

                                    <div className={datePickerWrapperStyles}>
                                        <label htmlFor="end_date" className="block mb-2 text-sm font-medium text-[#2A6D3A]">End Date</label>
                                        <DatePicker
                                            id="end_date"
                                            name="end_date"
                                            selected={formData.end_date}
                                            onChange={handleEndDateChange}
                                            selectsEnd
                                            startDate={formData.start_date}
                                            endDate={formData.end_date}
                                            minDate={formData.start_date}
                                            className={datePickerStyles}
                                            placeholderText="Select end date"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

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
                                    {existingIntramural ? "Update Intramural" : "Add New Intramural"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    );
}