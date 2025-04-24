import { useState, useEffect } from "react";
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
    intrams_id: intrams_id,
    type: "",
    gold: "",
    silver: "",
    bronze: "",
    venue: "",
    status: "pending",
  });

  const  clearForm = () => {
    setFormData({
      name: "",
      tournament_type: "",
      category: "",
      intrams_id: null,
      type: "",
      gold: "",
      silver: "",
      bronze: "",
      venue: "",
      status: "pending",
    }); 
  }
  useEffect(() => {
    if (existingEvent) {
      setFormData({
        name: existingEvent.name || "",
        tournament_type: existingEvent.tournament_type || "",
        category: existingEvent.category || "",
        intrams_id: intrams_id,
        type: existingEvent.type || "",
        gold: existingEvent.gold || "",
        silver: existingEvent.silver || "",
        bronze: existingEvent.bronze || "",
        venue: existingEvent.venue || "",
        status: existingEvent.status || "pending",
      });
    } else {
      setFormData({
        name: "",
        tournament_type: "",
        category: "",
        intrams_id: intrams_id,
        type: "",
        gold: "",
        silver: "",
        bronze: "",
        venue: "",
        status: "pending",
      });
    }
  }, [existingEvent, intrams_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    existingEvent ? updateEvent(existingEvent.id, formData) : addEvent(formData);
    clearForm();
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
        <div className="relative p-4 w-full max-w-md">
          <div className="relative bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-[#E6F2E8]">
              <h3 className="text-lg font-semibold text-[#2A6D3A]">
                {existingEvent ? "Update Event" : "Add New Event"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-[#2A6D3A]/70 hover:bg-[#F7FAF7] hover:text-[#2A6D3A] rounded-lg text-sm w-8 h-8 flex justify-center items-center"
              >
                <IoMdClose size={22} />
              </button>
            </div>

            <form className="p-4 md:p-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 grid-cols-2">
                {/* Name */}
                <div className="col-span-2">
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                    className="bg-white border border-[#6BBF59]/30 text-gray-900 text-sm rounded-lg focus:ring-[#6BBF59]/50 focus:border-[#6BBF59] block w-full p-2.5"
                    placeholder="Enter event name"
                  />
                </div>

                {/* Select fields */}
                {[
                  {
                    label: "Tournament Type",
                    name: "tournament_type",
                    options: [
                      { value: "", label: "Select tournament type", disabled: true },
                      { value: "single elimination", label: "Single Elimination" },
                      { value: "double elimination", label: "Double Elimination" },
                    ],
                  },
                  {
                    label: "Category",
                    name: "category",
                    options: [
                      { value: "", label: "Select category", disabled: true },
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "mixed", label: "Mixed" },
                    ],
                  },
                  {
                    label: "Type",
                    name: "type",
                    options: [
                      { value: "", label: "Select type", disabled: true },
                      { value: "sports", label: "Sports" },
                      { value: "music", label: "Music" },
                      { value: "dance", label: "Dance" },
                    ],
                  },
                ].map(({ label, name, options }) => (
                  <div className="col-span-2" key={name}>
                    <label htmlFor={name} className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                      {label}
                    </label>
                    <select
                      id={name}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      required
                      className="bg-white border border-[#6BBF59]/30 text-gray-900 text-sm rounded-lg focus:ring-[#6BBF59]/50 focus:border-[#6BBF59] block w-full p-2.5"
                    >
                      {options.map((opt, idx) => (
                        <option key={idx} value={opt.value} disabled={opt.disabled}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                {/* Medal Fields */}
                {/* Medal Count (applies to gold, silver, bronze) */}
                <div className="col-span-2">
                  <label htmlFor="medalCount" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    Medal Count (will apply to gold, silver, and bronze)
                  </label>
                  <input
                    id="medalCount"
                    name="medalCount"
                    type="number"
                    min="0"
                    value={formData.gold} // any of the three will reflect the value
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        gold: value,
                        silver: value,
                        bronze: value,
                      }));
                    }}
                    autoComplete="off"
                    required
                    className="bg-white border border-[#6BBF59]/30 text-gray-900 text-sm rounded-lg focus:ring-[#6BBF59]/50 focus:border-[#6BBF59] block w-full p-2.5"
                    placeholder="Enter number of medals"
                  />
                </div>

              </div>

              {/* Buttons */}
              <div className="flex justify-end mt-4 space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-[#2A6D3A] bg-white border border-[#6BBF59]/30 hover:bg-[#F7FAF7] font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-white bg-[#6BBF59] hover:bg-[#5CAF4A] font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  {existingEvent ? "Update Event" : "Add New Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
}
