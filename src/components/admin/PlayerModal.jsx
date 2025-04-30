import { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { FaTimesCircle } from "react-icons/fa";
import { FaFilePdf, FaFileWord, FaFileAlt, FaFile } from "react-icons/fa";

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
      <div className="col-span-2">
        <label htmlFor={field} className="block mb-2 text-sm font-medium text-[#2A6D3A]">
          {label}
        </label>

        {showPreview ? (
          <div className="relative p-4 border rounded bg-gray-50 flex items-center space-x-3">
            <div className="bg-[#F7FAF7] border-[#6BBF59]/30 p-3 flex items-center space-x-3 min-w-0 flex-1">
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
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all bg-gray-50 hover:bg-gray-100 border-[#6BBF59]/30"
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

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
        <div className="relative p-4 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="relative bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b rounded-t border-[#E6F2E8]">
              <h3 className="text-lg font-semibold text-[#2A6D3A]">
                {existingPlayer ? "Update Player" : "Add New Player"}
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
              <div className="px-4 pt-4 text-sm text-red-600 bg-red-50 rounded">{error}</div>
            )}

            <form className="p-4 md:p-5" onSubmit={handleSubmit} encType="multipart/form-data">
              {isLoading ? (
                <div className="grid gap-4 mb-4 grid-cols-2 animate-pulse">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="col-span-2 h-10 bg-gray-200 rounded" />
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
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
                      className="bg-white border border-[#6BBF59]/30 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-[#6BBF59]/50 focus:border-[#6BBF59] block w-full p-2.5"
                      placeholder="Enter player name"
                      required
                    />
                  </div>

                  <div className="col-span-2">
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
                      className="bg-white border border-[#6BBF59]/30 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-[#6BBF59]/50 focus:border-[#6BBF59] block w-full p-2.5"
                      placeholder="Enter ID number"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="team_id" className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                      Select Team
                    </label>
                    <select
                      name="team_id"
                      id="team_id"
                      value={formData.team_id}
                      onChange={handleChange}
                      required
                      className="bg-white border border-[#6BBF59]/30 text-gray-900 text-sm rounded-lg focus:ring-[#6BBF59]/50 focus:border-[#6BBF59] block w-full p-2.5"
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

                  {renderFileUpload("Picture", "picture")}
                  {renderFileUpload("Medical Certificate", "medical_certificate")}
                  {renderFileUpload("Parent's Consent", "parents_consent")}
                  {renderFileUpload("Certificate of Registration (COR)", "cor")}
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
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {existingPlayer ? "Updating..." : "Adding..."}
                    </span>
                  ) : existingPlayer ? (
                    "Update Player"
                  ) : (
                    "Add New Player"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
}
