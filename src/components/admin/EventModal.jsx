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
        status: "pending",
      });
    }
  }, [existingEvent, intrams_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInput = (e) => {
    if (e.key === "." || e.key === ",") e.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    existingEvent ? updateEvent(existingEvent.id, formData) : addEvent(formData);
    closeModal();
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-xs">
        <div className="relative p-4 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-200 dark:border-gray-600">
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
                {[
                  { label: "Name", name: "name", type: "text", placeholder: "Type event name" },
                ].map((input) => (
                  <div className="col-span-2" key={input.name}>
                    <label className="block mb-2 text-sm sm:text-xs font-medium text-gray-900 dark:text-white">
                      {input.label}
                    </label>
                    <input
                      type={input.type}
                      name={input.name}
                      value={formData[input.name]}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      placeholder={input.placeholder}
                      required
                    />
                  </div>
                ))}

                {/* Select Fields */}
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
                      { value: "", label: "Select event category", disabled: true },
                      { value: "men", label: "Men" },
                      { value: "women", label: "Women" },
                      { value: "mixed", label: "Mixed" },
                    ],
                  },
                  {
                    label: "Type",
                    name: "type",
                    options: [
                      { value: "", label: "Select event type", disabled: true },
                      { value: "sports", label: "Sports" },
                      { value: "music", label: "Music" },
                      { value: "dance", label: "Dance" },
                    ],
                  },
                ].map((select) => (
                  <div className="col-span-2" key={select.name}>
                    <label className="block mb-2 text-sm sm:text-xs font-medium text-gray-900 dark:text-white">
                      {select.label}
                    </label>
                    <select
                      name={select.name}
                      value={formData[select.name]}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      required
                    >
                      {select.options.map((opt, idx) => (
                        <option key={idx} value={opt.value} disabled={opt.disabled}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                {/* Medal Counts */}
                {["gold", "silver", "bronze"].map((medal) => (
                  <div className="col-span-2" key={medal}>
                    <label className="block mb-2 text-sm sm:text-xs font-medium text-gray-900 dark:text-white">
                      {medal.charAt(0).toUpperCase() + medal.slice(1)}
                    </label>
                    <input
                      type="number"
                      name={medal}
                      value={formData[medal]}
                      onChange={handleChange}
                      onKeyDown={handleNumberInput}
                      min={1}
                      pattern="[0-9]*"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      placeholder={`Enter number of ${medal}s`}
                      required
                    />
                  </div>
                ))}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="cursor-pointer focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm sm:text-xs px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
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
