import { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { FaTimesCircle } from "react-icons/fa";
import { InfoIcon, Loader } from "lucide-react";

export default function PlayerModal({
  isModalOpen,
  closeModal,
  addPlayer,
  updatePlayer,
  existingPlayer,
  isLoading,
  error,
  teams,
}) {
  const initialState = {
    name: "",
    id_number: "",
    team_id: "",
    birthdate: "",
    degree: "",
    year: "",
    contact: "",
    picture: null,
    previews: {
      picture: "",
    },
  };

  const [formData, setFormData] = useState(initialState);
  const pictureInputRef = useRef(null);
  const [pictureUploaded, setPictureUploaded] = useState(false);
  const [removePicture, setRemovePicture] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (existingPlayer) {
      // Parse course_year if it exists in the format "Degree - Year"
      let degree = "";
      let year = "";
      if (existingPlayer.course_year) {
        const parts = existingPlayer.course_year.split(" - ");
        if (parts.length === 2) {
          degree = parts[0];
          year = parts[1];
        }
      }

      setFormData({
        name: existingPlayer.name || "",
        id_number: existingPlayer.id_number || "",
        team_id: existingPlayer.team_id || "",
        birthdate: existingPlayer.birthdate || "",
        degree: degree,
        year: year,
        contact: existingPlayer.contact || "", 
        picture: null,
        previews: {
          picture: existingPlayer.picture || "",
        },
      });

      setPictureUploaded(false);
      setRemovePicture(false);
    } else {
      setFormData(initialState);
      setPictureUploaded(false);
      setRemovePicture(false);
    }
    
    // Clear validation errors when modal opens/closes or player changes
    setValidationErrors({});
  }, [existingPlayer, isModalOpen]);

  const formatIDNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    const part1 = digits.slice(0, 2);
    const part2 = digits.slice(2, 3);
    const part3 = digits.slice(3, 8);
    let formatted = part1;
    if (part2) formatted += `${part2}`;
    if (part3) formatted += `${part3}`;
    return formatted;
  };

  const formatContactNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    return digits.slice(0, 11); // Limit to 11 digits for PH numbers
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    
    if (name === "id_number") {
      newValue = formatIDNumber(value);
    } else if (name === "contact") {
      newValue = formatContactNumber(value);
    }
    
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePictureChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      picture: file,
      previews: {
        ...prev.previews,
        picture: URL.createObjectURL(file),
      },
    }));
    setPictureUploaded(true);
    setRemovePicture(false);
    
    // Clear picture validation error
    if (validationErrors.picture) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.picture;
        return newErrors;
      });
    }
  };

  const handlePictureDrop = (e) => {
    e.preventDefault();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    
    const file = e.dataTransfer.files[0];
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setValidationErrors(prev => ({
        ...prev,
        picture: "Please upload an image file"
      }));
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      picture: file,
      previews: {
        ...prev.previews,
        picture: URL.createObjectURL(file),
      },
    }));
    setPictureUploaded(true);
    setRemovePicture(false);
    
    // Clear picture validation error
    if (validationErrors.picture) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.picture;
        return newErrors;
      });
    }
  };

  const handleRemovePicture = () => {
    setFormData((prev) => ({
      ...prev,
      picture: null,
      previews: {
        ...prev.previews,
        picture: "",
      },
    }));
    setPictureUploaded(false);
    setRemovePicture(true);
    
    if (pictureInputRef.current) {
      pictureInputRef.current.value = null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // First check if it's a new player and picture is missing
    if (!existingPlayer && !formData.picture && !formData.previews.picture) {
      setValidationErrors({ picture: "This field is required" });
      return;
    }
    
    // Clear any existing validation errors
    setValidationErrors({});
    
    // Proceed with form submission
    const playerData = new FormData();
    playerData.append("name", formData.name);
    playerData.append("id_number", formData.id_number);
    playerData.append("team_id", formData.team_id);
    playerData.append("birthdate", formData.birthdate);
    playerData.append("contact", formData.contact);
    
    // Combine degree and year into course_year
    const course_year = `${formData.degree} - ${formData.year}`;
    playerData.append("course_year", course_year);

    // Handle picture upload
    if (formData.picture) {
      playerData.append("picture", formData.picture);
    }
    if (removePicture) {
      playerData.append("remove_picture", "1");
    }

    if (existingPlayer) {
      playerData.append("_method", "PATCH");
      updatePlayer(existingPlayer.id, playerData);
    } else {
      addPlayer(playerData);
    }
  };

  const renderPictureUpload = () => {
    const showPreview = 
      (pictureUploaded || 
        (existingPlayer && existingPlayer.picture && !removePicture)) &&
      formData.previews.picture;

    const isRequired = !existingPlayer; // Picture is required for new players only
    const hasError = validationErrors.picture;

    return (
      <div className="mb-4" id="picture-upload-section">
        <label htmlFor="picture" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
          Picture {isRequired && <span className="text-red-500">*</span>}
        </label>

        {showPreview ? (
          <div className="relative p-4 border rounded bg-gray-50 flex items-center space-x-3">
            <div className="bg-[#F7FAF7] border-[#E6F2E8] p-3 flex items-center space-x-3 min-w-0 flex-1">
              <img
                src={formData.previews.picture}
                alt="Preview"
                className="w-16 h-16 rounded object-cover border"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-medium text-gray-800 truncate">
                  {formData.picture?.name || "Profile Picture"}
                </span>
                {formData.picture && (
                  <span className="text-xs text-gray-500">
                    {(formData.picture.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemovePicture}
              className="absolute -top-2 -right-2 text-red-500 hover:text-red-700 bg-white rounded-full"
            >
              <FaTimesCircle size={20} />
            </button>
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all bg-gray-50 hover:bg-gray-100 ${
              hasError 
                ? 'border-red-300 bg-red-50' 
                : 'border-[#E6F2E8]'
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handlePictureDrop}
          >
            <input
              id="picture"
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
              ref={pictureInputRef}
              className="hidden"
            />
            <label htmlFor="picture" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
              <svg className={`w-8 h-8 ${hasError ? 'text-red-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span className={`text-sm mt-2 ${hasError ? 'text-red-500' : 'text-gray-500'}`}>
                Click to upload or drag and drop
              </span>
              <span className={`text-xs ${hasError ? 'text-red-400' : 'text-gray-400'}`}>
                JPG, PNG, etc. {isRequired && '(Required)'}
              </span>
            </label>
          </div>
        )}
        
        {hasError && (
          <p className="mt-1 text-sm text-red-500" data-error="picture">{validationErrors.picture}</p>
        )}
      </div>
    );
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="relative w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="relative bg-white rounded-xl shadow-lg border border-[#E6F2E8] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#E6F2E8] bg-[#F7FAF7]">
            <h3 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              {existingPlayer ? "Update Player" : "Add New Player"}
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

            {/* Document Requirements Notice */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <InfoIcon className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-700">Physical Document Requirements</h4>
                  <p className="text-sm text-blue-600 mt-1">
                    Players must submit physical copies of the following documents:
                  </p>
                  <ul className="mt-1 text-sm text-blue-600 list-disc pl-5">
                    <li>Medical Certificate</li>
                    <li>Parent's Consent (if applicable)</li>
                    <li>Certificate of Registration (COR)</li>
                  </ul>
                  <p className="text-sm text-blue-600 mt-1">
                    Submit these documents to your team GAM for verification.
                  </p>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    Full Name <span className="text-red-500">*</span>
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
                    ID Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="id_number"
                    id="id_number"
                    autoComplete="off"
                    value={formData.id_number}
                    onChange={handleChange}
                    className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    placeholder="XX-X-XXXXX"
                    required
                  />
                </div>
                
                {/* Birthdate */}
                <div>
                  <label htmlFor="birthdate" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    Birthdate <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="birthdate"
                    id="birthdate"
                    value={formData.birthdate}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]} // Set max date to today
                    className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    required
                  />
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div>
                      <label htmlFor="birth-month" className="block mb-1 text-xs text-gray-500">
                        Month
                      </label>
                      <select
                        id="birth-month"
                        className="bg-white border border-[#E6F2E8] text-gray-700 text-xs rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-1.5 transition-all duration-200"
                        onChange={(e) => {
                          const currentDate = formData.birthdate ? new Date(formData.birthdate) : new Date();
                          currentDate.setMonth(parseInt(e.target.value) - 1);
                          setFormData({
                            ...formData,
                            birthdate: currentDate.toISOString().split('T')[0]
                          });
                        }}
                        value={formData.birthdate ? new Date(formData.birthdate).getMonth() + 1 : ""}
                      >
                        <option value="" disabled>Month</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="birth-day" className="block mb-1 text-xs text-gray-500">
                        Day
                      </label>
                      <select
                        id="birth-day"
                        className="bg-white border border-[#E6F2E8] text-gray-700 text-xs rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-1.5 transition-all duration-200"
                        onChange={(e) => {
                          const currentDate = formData.birthdate ? new Date(formData.birthdate) : new Date();
                          currentDate.setDate(parseInt(e.target.value));
                          setFormData({
                            ...formData,
                            birthdate: currentDate.toISOString().split('T')[0]
                          });
                        }}
                        value={formData.birthdate ? new Date(formData.birthdate).getDate() : ""}
                      >
                        <option value="" disabled>Day</option>
                        {Array.from({ length: 31 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="birth-year" className="block mb-1 text-xs text-gray-500">
                        Year
                      </label>
                      <select
                        id="birth-year"
                        className="bg-white border border-[#E6F2E8] text-gray-700 text-xs rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-1.5 transition-all duration-200"
                        onChange={(e) => {
                          const currentDate = formData.birthdate ? new Date(formData.birthdate) : new Date();
                          currentDate.setFullYear(parseInt(e.target.value));
                          setFormData({
                            ...formData,
                            birthdate: currentDate.toISOString().split('T')[0]
                          });
                        }}
                        value={formData.birthdate ? new Date(formData.birthdate).getFullYear() : ""}
                      >
                        <option value="" disabled>Year</option>
                        {Array.from({ length: 50 }, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Contact Number */}
                <div>
                  <label htmlFor="contact" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contact"
                    id="contact"
                    autoComplete="off"
                    value={formData.contact}
                    onChange={handleChange}
                    className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    placeholder="09XXXXXXXXX"
                    maxLength="11"
                    required
                  />
                </div>
                
                {/* Course/Degree Program */}
                <div>
                  <label htmlFor="degree" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    Degree Program <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="degree"
                    id="degree"
                    autoComplete="off"
                    value={formData.degree}
                    onChange={handleChange}
                    className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    placeholder="e.g. BS Computer Science"
                    required
                  />
                </div>
                
                {/* Year Level */}
                <div>
                  <label htmlFor="year" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    Year Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="year"
                    id="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                  >
                    <option value="" disabled>
                      Select year level
                    </option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                    <option value="6">6th Year</option>
                    <option value="N/A">N/A</option>

                  </select>
                </div>

                {/* Team Dropdown */}
                <div>
                  <label htmlFor="team_id" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    Select Team <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="team_id"
                    id="team_id"
                    value={formData.team_id}
                    onChange={handleChange}
                    required
                    className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                  >
                    <option value="" disabled>
                      Select a team
                    </option>
                    {(teams || []).map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Picture Upload Field */}
                {renderPictureUpload()}
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