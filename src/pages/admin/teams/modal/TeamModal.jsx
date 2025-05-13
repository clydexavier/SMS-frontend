import { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { FaTimesCircle } from "react-icons/fa";
import { Loader } from "lucide-react";

export default function TeamModal({
  isModalOpen,
  closeModal,
  addTeam,
  updateTeam,
  existingTeam,
  isLoading,
  error,
}) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    team_logo_path: null,
    previewLogo: "",
  });

  const fileInputRef = useRef(null);
  const [uploaded, setUploaded] = useState(false);
  const [removeLogo, setRemoveLogo] = useState(false);

  useEffect(() => {
    if (existingTeam) {
      setFormData({
        name: existingTeam.name || "",
        type: existingTeam.type || "",
        team_logo_path: null,
        previewLogo: existingTeam.team_logo_path || "",
      });
    } else {
      setFormData({ name: "", type: "", team_logo_path: null, previewLogo: "" });
    }
    setUploaded(false);
    setRemoveLogo(false);
  }, [existingTeam]);

  const handleChange = (e) => {
    setFormData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const uploadFile = (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setFormData((prevData) => ({
      ...prevData,
      team_logo_path: file,
      previewLogo: URL.createObjectURL(file),
    }));
    setUploaded(true);
    setRemoveLogo(false);
  };

  const handleFileChange = (e) => uploadFile(e.target.files);
  const handleDrop = (e) => {
    e.preventDefault();
    uploadFile(e.dataTransfer.files);
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => ({ ...prev, team_logo_path: null, previewLogo: "" }));
    setUploaded(false);
    setRemoveLogo(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const teamData = new FormData();
    teamData.append("name", formData.name);
    teamData.append("type", formData.type);
    if (formData.team_logo_path) teamData.append("team_logo_path", formData.team_logo_path);
    if (removeLogo) teamData.append("remove_logo", "1");

    if (existingTeam) {
      teamData.append("_method", "PATCH");
      updateTeam(existingTeam.id, teamData);
    } else {
      addTeam(teamData);
    }
  };

  const showPreview = (uploaded || (existingTeam?.team_logo_path && !removeLogo)) && formData.previewLogo;

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="relative w-full max-w-md mx-auto">
        <div className="relative bg-white rounded-xl shadow-lg border border-[#E6F2E8] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#E6F2E8] bg-[#F7FAF7]">
            <h3 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              {existingTeam ? "Update Team" : "Add New Team"}
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
          <form className="p-5" onSubmit={handleSubmit} encType="multipart/form-data">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Team Name */}
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                  Team Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="off"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                  placeholder="Enter team name"
                  required
                />
              </div>

              {/* Team Logo */}
              <div>
                <label htmlFor="team_logo_path" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                  Team Logo
                </label>

                {showPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.previewLogo}
                      alt="Logo preview"
                      className="max-h-32 object-contain border rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-logo.png";
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 text-red-500 hover:text-red-700 bg-white rounded-full"
                    >
                      <FaTimesCircle size={20} />
                    </button>
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all bg-gray-50 hover:bg-gray-100 border-[#E6F2E8]"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    <input
                      id="team_logo_path"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="hidden"
                    />
                    <label htmlFor="team_logo_path" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-sm text-gray-500 mt-2">Click to upload or drag and drop</span>
                      <span className="text-xs text-gray-400">SVG, PNG, JPG or GIF</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

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
                    {existingTeam ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  existingTeam ? "Update Team" : "Add Team"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}