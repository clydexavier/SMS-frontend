import { useState, useEffect } from "react";
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
    team_logo_path: null, 
    previewLogo: "" 
  });
  const [uploaded, setUploaded] = useState(false);
  const [removeLogo, setRemoveLogo] = useState(false);

  useEffect(() => {
    if (existingTeam) {
      setFormData({
        name: existingTeam.name || "",
        team_logo_path: null,
        previewLogo: existingTeam.team_logo_path || "", // Change to team_logo_path
      });
    } else {
      setFormData({ name: "", team_logo_path: null, previewLogo: "" });
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
      previewLogo: URL.createObjectURL(file) 
    }));
    setUploaded(true);
    setRemoveLogo(false);
  };

  const handleFileChange = (e) => uploadFile(e.target.files);
  const handleDrop = (e) => { e.preventDefault(); uploadFile(e.dataTransfer.files); };

  const handleRemoveLogo = () => {
    setFormData((prevData) => ({ 
      ...prevData, 
      team_logo_path: null, 
      previewLogo: "" 
    }));
    setUploaded(false);
    setRemoveLogo(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a FormData object for Laravel file upload
    const teamData = new FormData();
    
    // Add required fields
    teamData.append("name", formData.name);
    
    if (existingTeam) {
      teamData.append("id", existingTeam.id);
    }
    // Add file if present
    if (formData.team_logo_path) {
      teamData.append("team_logo_path", formData.team_logo_path);
    }
    
    // Add a flag to indicate if the logo should be removed
    if (removeLogo) {
      teamData.append("remove_logo", "1");
    }
    
    // Use the passed in addTeam or updateTeam functions from the parent component
    if (existingTeam) {
      updateTeam(existingTeam.id, teamData);
    } else {
      addTeam(teamData);
    }
  };

  // Determine if we should show the logo preview
  const showPreview = (uploaded || (existingTeam?.team_logo_path && !removeLogo)) && formData.previewLogo;

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs">
        <div className="relative p-4 w-full max-w-md">
          <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {existingTeam ? "Update Team" : "Add New Team"}
              </h3>
              <button 
                type="button" 
                onClick={closeModal} 
                disabled={isLoading}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <IoMdClose size={25} />
              </button>
            </div>

            {error && (
              <div className="p-4 md:p-5 bg-red-100 text-red-700 text-sm">
                {error}
              </div>
            )}

          <form className="p-4 md:p-5" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Team Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  disabled={isLoading}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  placeholder="Enter team name" 
                  maxLength="50" // Matches your validation max:50
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Team Logo</label>
                
                <div className="flex items-center justify-center w-full">
                  <label 
                    htmlFor="dropzone-file" 
                    className={`flex flex-col items-center justify-center w-full h-[50%] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} 
                    onDragOver={(e) => e.preventDefault()} 
                    onDrop={isLoading ? null : handleDrop}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                      <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        {uploaded ? formData.team_logo_path.name : (showPreview ? "Replace logo" : "Click to upload or drag and drop")}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
                    </div>
                    <input 
                      id="dropzone-file" 
                      type="file" 
                      name="team_logo_path" 
                      accept=".jpeg,.jpg,.png,.gif,.svg" // Match Laravel validation
                      className="hidden" 
                      onChange={handleFileChange}
                      disabled={isLoading} 
                    />
                  </label>
                </div>
                
                {/* Show image preview */}
                {showPreview && (
                  <div className="mt-3 relative">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Current Logo:</p>
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
                        disabled={isLoading}
                        className="absolute -top-2 -right-2 text-red-500 hover:text-red-700 bg-white rounded-full"
                        title="Remove logo"
                      >
                        <FaTimesCircle size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`text-black bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {existingTeam ? "Updating..." : "Adding..."}
                </span>
              ) : (
                existingTeam ? "Update Team" : "Add New Team"
              )}
            </button>
          </form>
          </div>
        </div>
      </div>
    )
  );
}