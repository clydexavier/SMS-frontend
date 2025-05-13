import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { Loader } from "lucide-react";

export default function VarsityPlayerModal({
  isModalOpen,
  closeModal,
  addPlayer,
  updatePlayer,
  existingPlayer,
  isLoading,
  error,
}) {
  const initialState = {
    name: "",
    id_number: "",
    sport: "",
    is_varsity: true,
    team_id: null,
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (existingPlayer) {
      setFormData(existingPlayer);
    } else {
      setFormData(initialState);
    }
  }, [existingPlayer, isModalOpen]);

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
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="relative w-full max-w-md mx-auto">
        <div className="relative bg-white rounded-xl shadow-lg border border-[#E6F2E8] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#E6F2E8] bg-[#F7FAF7]">
            <h3 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              {existingPlayer ? "Update Player" : "Add New Varsity Player"}
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
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Name */}
                <div>
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
                    className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    placeholder="Enter player name"
                    required
                  />
                </div>

                {/* ID Number */}
                <div>
                  <label htmlFor="id_number" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    ID Number
                  </label>
                  <input
                    type="text"
                    name="id_number"
                    id="id_number"
                    value={formData.id_number}
                    onChange={handleChange}
                    className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    placeholder="XX-X-XXXXX"
                    required
                  />
                </div>

                {/* Sport */}
                <div>
                  <label htmlFor="sport" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    Sport
                  </label>
                  <input
                    type="text"
                    name="sport"
                    id="sport"
                    autoComplete="off"
                    value={formData.sport}
                    onChange={handleChange}
                    className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    placeholder="Enter player sport"
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
                    {existingPlayer ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  existingPlayer ? "Update Player" : "Add Player"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}