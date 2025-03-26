import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

export default function VarsityPlayerModal({
  isModalOpen,
  closeModal,
  addPlayer,
  updatePlayer,
  existingPlayer,
}) {
  const [formData, setFormData] = useState({
    name: "",
    student_number: "",
    sport: "",
    is_varsity: true,
    team_id: null,
  });

  useEffect(() => {
    if (existingPlayer) {
      setFormData(existingPlayer);
    } else {
      setFormData({ name: "", student_number: "", sport: "", is_varsity: true, team_id: null });
    }
  }, [existingPlayer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (existingPlayer) {
      updatePlayer(existingPlayer.id, formData);
    } else {
      addPlayer(formData);
    }
    closeModal();
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs">
        <div className="relative p-4 w-full max-w-md">
          <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {existingPlayer ? "Update Player" : "Add New Varsity Player"}
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
                    placeholder="Enter player name"
                    required
                  />
                </div>

                {/* Student Number */}
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Student Number
                  </label>
                  <input
                    type="text"
                    name="student_number"
                    value={formData.student_number}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter student number"
                    required
                  />
                </div>

                {/* Sport */}
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Sport
                  </label>
                  <input
                    type="text"
                    name="sport"
                    value={formData.sport}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter sport"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="cursor-pointer focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
              >
                {existingPlayer ? "Update Player" : "Add New Player"}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  );
}
