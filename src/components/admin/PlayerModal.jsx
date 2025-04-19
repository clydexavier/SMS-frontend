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
}) {
  const initialState = {
    name: "",
    id_number: "",
    medical_certificate: null,
    parents_consent: null,
    cor: null,
    previews: {
      medical_certificate: "",
      parents_consent: "",
      cor: "",
    },
    removed: {
      medical_certificate: false,
      parents_consent: false,
      cor: false,
    },
  };

  const fileInputRefs = {
    medical_certificate: useRef(null),
    parents_consent: useRef(null),
    cor: useRef(null),
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (existingPlayer) {
      const previews = {
        medical_certificate: existingPlayer.medical_certificate_url || "",
        parents_consent: existingPlayer.parents_consent_url || "",
        cor: existingPlayer.cor_url || "",
      };

      setFormData({
        name: existingPlayer.name || "",
        id_number: existingPlayer.id_number || "",
        medical_certificate: null,
        parents_consent: null,
        cor: null,
        previews,
        removed: {
          medical_certificate: false,
          parents_consent: false,
          cor: false,
        },
      });
    } else {
      setFormData(initialState);
    }
  }, [existingPlayer, isModalOpen]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      [field]: file,
      previews: {
        ...prev.previews,
        [field]: URL.createObjectURL(file),
      },
      removed: {
        ...prev.removed,
        [field]: false,
      },
    }));
  };

  const handleRemoveFile = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: null,
      previews: {
        ...prev.previews,
        [field]: "",
      },
      removed: {
        ...prev.removed,
        [field]: true,
      },
    }));
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
        return <FaFile size={40} className="text-gray-400" />;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const playerData = new FormData();

    if (existingPlayer) {
      playerData.append("_method", "PATCH");
    }

    playerData.append("name", formData.name);
    playerData.append("id_number", formData.id_number);

    ["medical_certificate", "parents_consent", "cor"].forEach((field) => {
      if (formData[field]) {
        playerData.append(field, formData[field]);
      }
      if (formData.removed[field]) {
        playerData.append(`remove_${field}`, "1");
      }
    });
    for (let [key, value] of playerData.entries()) {
        console.log(`${key}:`, value);
      }

    if (existingPlayer) {
        playerData.append('_method', 'PATCH'); // Important for method spoofing
        updatePlayer(existingPlayer.id, playerData);
    } else {
      addPlayer(playerData);
    }

    closeModal();
  };

  const renderFileUpload = (label, field) => {
    const preview = formData.previews[field];
    const file = formData[field];
    const shouldPreview = preview && !formData.removed[field];
  
    return (
      <div className="col-span-2">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
  
        {/* Show preview if file exists and is not removed */}
        {shouldPreview ? (
          <div className="p-2 mt-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Current File:</p>
            <div className="relative p-4 border rounded bg-gray-50 dark:bg-gray-600 flex items-center space-x-3">
              {getFileIcon(preview)}
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {file?.name || preview.split("/").pop()}
                </span>
                {file && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(field)}
                disabled={isLoading}
                className="absolute top-1 right-1 text-red-500 hover:text-red-700 bg-white rounded-full"
              >
                <FaTimesCircle size={20} />
              </button>
            </div>
          </div>
        ) : (
          // Only show drop field when no preview exists or file is removed
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor={`upload-${field}`}
              className={`flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF, DOCX, TXT, etc. (MAX. 5MB)
                </p>
              </div>
              <input
                id={`upload-${field}`}
                type="file"
                onChange={(e) => handleFileUpload(e, field)}
                className="hidden"
                disabled={isLoading}
                ref={fileInputRefs[field]}
              />
            </label>
          </div>
        )}
      </div>
    );
  };
  
  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs z-50">
        <div className="relative p-4 w-full max-w-md max-h-[90vh] overflow-y-auto">
         <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {existingPlayer ? "Update Player" : "Add New Player"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                disabled={isLoading}
                className="text-gray-400 hover:text-gray-900 rounded-lg text-sm w-8 h-8 dark:hover:text-white"
              >
                <IoMdClose size={25} />
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-100 text-red-700 text-sm">{error}</div>
            )}

            <form className="p-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    ID Number
                  </label>
                  <input
                    type="text"
                    name="id_number"
                    value={formData.id_number}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  />
                </div>

                {renderFileUpload("Medical Certificate", "medical_certificate")}
                {renderFileUpload("Parent's Consent", "parents_consent")}
                {renderFileUpload("Certificate of Registration (COR)", "cor")}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-black bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin mr-2 h-4 w-4 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    {existingPlayer ? "Updating..." : "Adding..."}
                  </span>
                ) : existingPlayer ? (
                  "Update Player"
                ) : (
                  "Add New Player"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  );
}
