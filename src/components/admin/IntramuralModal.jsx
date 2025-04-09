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
        const formattedData = {
            ...formData,
            start_date: formData.start_date ? formData.start_date.toISOString().split('T')[0] : null,
            end_date: formData.end_date ? formData.end_date.toISOString().split('T')[0] : null,
        };
    
        console.log("Submitting Data:", formattedData);
    

      if (existingIntramural) {
        updateIntramural(existingIntramural.id, formattedData);
      } else {
        addIntramural(formattedData);
      }
  
      closeModal();
    };

    return (
        isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs">
                <div className="relative p-4 w-full max-w-md">
                    <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {existingIntramural ? "Update Intramural" : "Add New Intramural"}
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

                        <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className="col-span-2">
                                    <label htmlFor="name" className="block mb-2 text-sm sm:text-xs md:text-sm lg:text-base font-medium text-gray-900 dark:text-white">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs md:text-sm lg:text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="Type intramural name"
                                        required
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label htmlFor="location" className="block mb-2 text-sm sm:text-xs md:text-sm lg:text-base font-medium text-gray-900 dark:text-white">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        id="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs md:text-sm lg:text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="Type intramural location"
                                        required
                                    />
                                </div>

                                <div className="col-span-2 flex items-center gap-4">
                                    <div className="relative w-full">
                                        <label className="block mb-2 text-sm sm:text-xs md:text-sm lg:text-base font-medium text-gray-900">Start Date</label>
                                        <DatePicker
                                            selected={formData.start_date}
                                            onChange={handleStartDateChange}
                                            selectsStart
                                            startDate={formData.start_date}
                                            endDate={formData.end_date}
                                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-900 text-sm sm:text-xs md:text-sm lg:text-base"
                                            placeholderText="Select start date"
                                            required
                                        />
                                    </div>

                                    <div className="relative w-full">
                                        <label className="block mb-2 text-sm sm:text-xs md:text-sm lg:text-base font-medium text-gray-900">End Date</label>
                                        <DatePicker
                                            selected={formData.end_date}
                                            onChange={handleEndDateChange}
                                            selectsEnd
                                            startDate={formData.start_date}
                                            endDate={formData.end_date}
                                            minDate={formData.start_date}
                                            className="border border-gray-300 rounded-lg p-2 w-full text-gray-900 text-sm sm:text-xs md:text-sm lg:text-base"
                                            placeholderText="Select end date"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="cursor-pointer focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm sm:text-xs md:text-sm lg:text-base px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">
                                {existingIntramural ? "Update Intramural" : "Add New Intramural"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    );
}
