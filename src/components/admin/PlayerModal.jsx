import { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { FaTimesCircle } from "react-icons/fa";
import { FaFilePdf, FaFileWord, FaFileAlt, FaFile } from "react-icons/fa";
import { Loader } from "lucide-react";

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
    picture: null,
    medical_certificate: null,
    parents_consent: null,
    cor: null,
    previews: {
      picture: "",
      medical_certificate: "",
      parents_consent: "",
      cor: "",
    },
  };

  const [formData, setFormData] = useState(initialState);

  const fileInputRefs = {
    picture: useRef(null),
    medical_certificate: useRef(null),
    parents_consent: useRef(null),
    cor: useRef(null),
  };

  const [uploadedFiles, setUploadedFiles] = useState({
    picture: false,
    medical_certificate: false,
    parents_consent: false,
    cor: false,
  });

  const [removeFiles, setRemoveFiles] = useState({
    picture: false,
    medical_certificate: false,
    parents_consent: false,
    cor: false,
  });

  useEffect(() => {
    if (existingPlayer) {
      const previews = {
        picture: existingPlayer.picture || "",
        medical_certificate: existingPlayer.medical_certificate || "",
        parents_consent: existingPlayer.parents_consent || "",
        cor: existingPlayer.cor || "",
      };
      setFormData({
        name: existingPlayer.name || "",
        id_number: existingPlayer.id_number || "",
        team_id: existingPlayer.team_id || "",
        picture: null,
        medical_certificate: null,
        parents_consent: null,
        cor: null,
        previews,
      });

      setUploadedFiles({
        picture: false,
        medical_certificate: false,
        parents_consent: false,
        cor: false,
      });
      setRemoveFiles({
        picture: false,
        medical_certificate: false,
        parents_consent: false,
        cor: false,
      });
    } else {
      setFormData(initialState);
      setUploadedFiles({
        picture: false,
        medical_certificate: false,
        parents_consent: false,
        cor: false,
      });
      setRemoveFiles({
        picture: false,
        medical_certificate: false,
        parents_consent: false,
        cor: false,
      });
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

  const uploadFile = (files, field) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setFormData((prev) => ({
      ...prev,
      [field]: file,
      previews: {
        ...prev.previews,
        [field]: URL.createObjectURL(file),
      },
    }));
    setUploadedFiles((prev) => ({ ...prev, [field]: true }));
    setRemoveFiles((prev) => ({ ...prev, [field]: false }));
  };

  const handleFileChange = (e, field) => uploadFile(e.target.files, field);

  const handleDrop = (e, field) => {
    e.preventDefault();
    uploadFile(e.dataTransfer.files, field);
  };

  const handleRemoveFile = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: null,
      previews: {
        ...prev.previews,
        [field]: "",
      },
    }));
    setUploadedFiles((prev) => ({ ...prev, [field]: false }));
    setRemoveFiles((prev) => ({ ...prev, [field]: true }));
    if (fileInputRefs[field]?.current) {
      fileInputRefs[field].current.value = null;
    }
  };

  const getFileIcon = (url) => {
    const ext = url.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf":
        return <FaFilePdf size={40} className="text-red-500" />;
      case "doc":
      case "docx":
        return <FaFileWord size={40} className="text-blue-500" />;
      case "txt":
        return <FaFileAlt size={40} className="text-gray-500" />;
      default:
        return <FaFile size={40} className="text-[#2A6D3A]" />;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const playerData = new FormData();
    playerData.append("name", formData.name);
    playerData.append("id_number", formData.id_number);
    playerData.append("team_id", formData.team_id);

    ["picture", "medical_certificate", "parents_consent", "cor"].forEach((field) => {
      if (formData[field]) {
        playerData.append(field, formData[field]);
      }
      if (removeFiles[field]) {
        playerData.append(`remove_${field}`, "1");
      }
    });

    if (existingPlayer) {
      playerData.append("_method", "PATCH");
      updatePlayer(existingPlayer.id, playerData);
    } else {
      addPlayer(playerData);
    }
  };

  const renderFileUpload = (label, field) => {
    const showPreview =
      (uploadedFiles[field] ||
        (existingPlayer && existingPlayer[`${field}`] && !removeFiles[field])) &&
      formData.previews[field];

    return (
      <div className="mb-4">
        <label htmlFor={field} className="block mb-2 text-sm font-medium text-[#2A6D3A]">
          {label}
        </label>

        {showPreview ? (
          <div className="relative p-4 border rounded bg-gray-50 flex items-center space-x-3">
            <div className=" bg-[#F7FAF7] border-[#E6F2E8] p-3 flex items-center space-x-3 min-w-0 flex-1">
              {field === "picture" ? (
                <img
                  src={formData.previews[field]}
                  alt="Preview"
                  className="w-16 h-16 rounded object-cover border"
                />
              ) : (
                getFileIcon(formData.previews[field])
              )}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm font-medium text-gray-800 truncate">
                  {formData[field]?.name || formData.previews[field].split("/").pop()}
                </span>
                {formData[field] && (
                  <span className="text-xs text-gray-500">
                    {(formData[field].size / 1024 / 1024).toFixed(2)} MB
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveFile(field)}
              className="absolute -top-2 -right-2 text-red-500 hover:text-red-700 bg-white rounded-full"
            >
              <FaTimesCircle size={20} />
            </button>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all bg-gray-50 hover:bg-gray-100 border-[#E6F2E8]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, field)}
          >
            <input
              id={field}
              type="file"
              accept={field === "picture" ? "image/*" : undefined}
              onChange={(e) => handleFileChange(e, field)}
              ref={fileInputRefs[field]}
              className="hidden"
            />
            <label htmlFor={field} className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm text-gray-500 mt-2">Click to upload or drag and drop</span>
              <span className="text-xs text-gray-400">{field === "picture" ? "JPG, PNG, etc." : "PDF, DOCX, TXT, etc."}</span>
            </label>
          </div>
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

            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    Full Name
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
                    autoComplete="off"
                    value={formData.id_number}
                    onChange={handleChange}
                    className="bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] block w-full p-2.5 transition-all duration-200"
                    placeholder="XX-X-XXXXX"
                    required
                  />
                </div>

                {/* Team Dropdown */}
                <div>
                  <label htmlFor="team_id" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                    Select Team
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

                {/* File Upload Fields */}
                {renderFileUpload("Picture", "picture")}
                {renderFileUpload("Medical Certificate", "medical_certificate")}
                {renderFileUpload("Parent's Consent", "parents_consent")}
                {renderFileUpload("Certificate of Registration (COR)", "cor")}
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