import { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { FaTimesCircle } from "react-icons/fa";

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

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
        <div className="relative p-4 w-full max-w-md">
          <div className="relative bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b rounded-t border-[#E6F2E8]">
              <h3 className="text-lg font-semibold text-[#2A6D3A]">
                {existingTeam ? "Update Team" : "Add New Team"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-[#2A6D3A]/70 hover:bg-[#F7FAF7] rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center transition-colors duration-200"
              >
                <IoMdClose size={22} />
              </button>
            </div>

            {error && (
              <div className="px-4 pt-4 text-sm text-red-600 bg-red-50 rounded">
                {error}
              </div>
            )}

            <form className="p-4 md:p-5" onSubmit={handleSubmit} encType="multipart/form-data">
              {isLoading ? (
                <div className="grid gap-4 mb-4 grid-cols-2 animate-pulse">
                  <div className="col-span-2 h-10 bg-gray-200 rounded" />
                  <div className="col-span-2 h-10 bg-gray-200 rounded" />
                  <div className="col-span-2 h-36 bg-gray-200 rounded" />
                </div>
              ) : (
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
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
                      className="bg-white border border-[#6BBF59]/30 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-[#6BBF59]/50 focus:border-[#6BBF59] block w-full p-2.5"
                      placeholder="Enter team name"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="type" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                      Team Type
                    </label>
                    <select
                      name="type"
                      id="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="bg-white border border-[#6BBF59]/30 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-[#6BBF59]/50 focus:border-[#6BBF59] block w-full p-2.5"
                      
                    >
                      <option value="" disabled>Select Type</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>

                  <div className="col-span-2">
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
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all bg-gray-50 hover:bg-gray-100 border-[#6BBF59]/30`}
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
              )}

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
                  disabled={isLoading}
                  className="text-white bg-[#6BBF59] hover:bg-[#5CAF4A] font-medium rounded-lg text-sm px-5 py-2.5 transition-all duration-200 focus:ring-2 focus:ring-[#6BBF59]/50"
                >
                  {existingTeam ? "Update Team" : "Add New Team"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
}
