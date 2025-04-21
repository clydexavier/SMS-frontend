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
    id_number: "",
    sport: "",
    is_varsity: true,
    team_id: null,
  });

  useEffect(() => {
    if (existingPlayer) {
      setFormData(existingPlayer);
    } else {
      setFormData({ name: "", id_number: "", sport: "", is_varsity: true, team_id: null });
    }
  }, [existingPlayer]);

  const formatIDNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    const part1 = digits.slice(0, 2);
    const part2 = digits.slice(2, 3);
    const part3 = digits.slice(3, 8);
    let formatted = part1;
    if (part2) formatted += `-${part2}`;
    if (part3) formatted += `-${part3}`;
    return formatted;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "id_number" ? formatIDNumber(value) : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    existingPlayer
      ? updatePlayer(existingPlayer.id, formData)
      : addPlayer(formData);
    closeModal();
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
        <div className="relative p-4 w-full max-w-md">
          <div className="relative bg-white rounded-lg shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b rounded-t border-[#E6F2E8]">
              <h3 className="text-lg font-semibold text-[#2A6D3A]">
                {existingPlayer ? "Update Player" : "Add New Varsity Player"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="cursor-pointer text-[#2A6D3A]/70 hover:bg-[#F7FAF7] hover:text-[#2A6D3A] rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center transition-colors duration-200"
              >
                <IoMdClose size={22} />
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            {/* Form */}
            <form className="p-4 md:p-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 grid-cols-2">
                {/* Name */}
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
                    className="bg-white border border-[#6BBF59]/30 text-gray-900 text-sm rounded-lg focus:ring-[#6BBF59]/50 focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    placeholder="Enter player name"
                    required
                  />
                </div>

                {/* ID Number */}
                <div className="col-span-2">
                  <label htmlFor="id_number" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    ID Number
                  </label>
                  <input
                    type="text"
                    name="id_number"
                    id="id_number"
                    value={formData.id_number}
                    onChange={handleChange}
                    className="bg-white border border-[#6BBF59]/30 text-gray-900 text-sm rounded-lg focus:ring-[#6BBF59]/50 focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    placeholder="Enter ID number"
                    required
                  />
                </div>

                {/* Sport */}
                <div className="col-span-2">
                  <label htmlFor="sport" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    Sport
                  </label>
                  <input
                    type="text"
                    name="sport"
                    id="sport"
                    value={formData.sport}
                    onChange={handleChange}
                    className="bg-white border border-[#6BBF59]/30 text-gray-900 text-sm rounded-lg focus:ring-[#6BBF59]/50 focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    placeholder="Enter sport"
                    required
                  />
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
                  className="text-white bg-[#6BBF59] hover:bg-[#5CAF4A] font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200"
                >
                  {existingPlayer ? "Update Player" : "Add New Player"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
}
