import { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { FaTimesCircle, FaFilePdf, FaFileWord, FaFileAlt, FaFile } from "react-icons/fa";

export default function DocumentModal({
  isModalOpen,
  closeModal,
  addDocument,
  updateDocument,
  existingDocument,
  isLoading,
  error,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    file: null,
    previewFile: "",
  });

  const fileInputRef = useRef(null);
  const [uploaded, setUploaded] = useState(false);
  const [removeFile, setRemoveFile] = useState(false);

  useEffect(() => {
    if (existingDocument) {
      setFormData({
        name: existingDocument.name || "",
        description: existingDocument.description || "",
        file: null,
        previewFile: existingDocument.file_path || "",
      });
      setUploaded(false);
      setRemoveFile(false);
    } else {
      setFormData({ name: "", description: "", file: null, previewFile: "" });
      setUploaded(false);
      setRemoveFile(false);
    }
  }, [existingDocument, isModalOpen]);

  const handleChange = (e) => {
    setFormData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const uploadFile = (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setFormData((prevData) => ({
      ...prevData,
      file: file,
      previewFile: URL.createObjectURL(file),
    }));
    setUploaded(true);
    setRemoveFile(false);
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, file: null, previewFile: "" }));
    setUploaded(false);
    setRemoveFile(true);
    fileInputRef.current.value = null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const documentData = new FormData();
    if (existingDocument) documentData.append("_method", "PATCH");
    documentData.append("name", formData.name);
    documentData.append("description", formData.description);
    if (formData.file) documentData.append("file", formData.file);
    if (removeFile) documentData.append("remove_file", "1");
    existingDocument ? updateDocument(existingDocument.id, documentData) : addDocument(documentData);
    closeModal();
  };

  const getFileName = () => {
    if (formData.file) return formData.file.name;
    if (formData.previewFile && existingDocument) {
      const ext = existingDocument.mime_type?.split("/")[1] || "file";
      return `${existingDocument.name}.${ext}`;
    }
    return "";
  };

  const getFileIcon = () => {
    const ext = getFileName().split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf": return <FaFilePdf size={40} className="text-red-500" />;
      case "doc":
      case "docx": return <FaFileWord size={40} className="text-blue-500" />;
      case "txt": return <FaFileAlt size={40} className="text-gray-500" />;
      default: return <FaFile size={40} className="text-gray-400" />;
    }
  };

  const showPreview = formData.previewFile && !removeFile;

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
        <div className="relative w-full max-w-md p-4">
          <div className="bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-[#E6F2E8]">
              <h3 className="text-lg font-semibold text-[#2A6D3A]">
                {existingDocument ? "Update Document" : "Add New Document"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-[#2A6D3A]/70 hover:bg-[#F7FAF7] hover:text-[#2A6D3A] rounded-lg p-1 transition"
              >
                <IoMdClose size={22} />
              </button>
            </div>

            {error && <div className="p-4 bg-red-100 text-red-700 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="p-4 space-y-4" encType="multipart/form-data">
              <div>
                <label className="block mb-2 text-sm font-medium text-[#2A6D3A]">Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter document name"
                  className="w-full border border-[#6BBF59]/30 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#6BBF59]/50 focus:border-[#6BBF59]"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-[#2A6D3A]">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  required
                  placeholder="Enter document description"
                  className="w-full border border-[#6BBF59]/30 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#6BBF59]/50 focus:border-[#6BBF59]"
                />
              </div>

              {!showPreview && (
                <div className="flex flex-col items-center justify-center w-full border-2 border-dashed border-[#6BBF59]/30 rounded-lg p-6 cursor-pointer hover:bg-[#F7FAF7] transition">
                  <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer w-full">
                    <svg className="w-8 h-8 text-[#6BBF59]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <p className="text-sm mt-2 text-gray-600">Click to upload or drag & drop</p>
                    <p className="text-xs text-gray-400">PDF, DOCX, TXT, etc. (max 5MB)</p>
                    <input
                      id="file-upload"
                      type="file"
                      name="file"
                      onChange={(e) => uploadFile(e.target.files)}
                      className="hidden"
                      disabled={isLoading}
                      ref={fileInputRef}
                    />
                  </label>
                </div>
              )}

              {showPreview && (
                <div className="relative p-4 border rounded bg-gray-50 flex items-center space-x-3">
                  {getFileIcon()}
                  <div className="flex flex-col min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{getFileName()}</p>
                    {formData.file && (
                      <span className="text-xs text-gray-500">
                        {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                  >
                    <FaTimesCircle size={20} />
                  </button>
                </div>
              )}

              <div className="flex justify-end pt-4 space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-[#2A6D3A] bg-white border border-[#6BBF59]/30 hover:bg-[#F7FAF7] font-medium rounded-lg text-sm px-5 py-2.5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-white bg-[#6BBF59] hover:bg-[#5CAF4A] font-medium rounded-lg text-sm px-5 py-2.5 transition"
                  disabled={isLoading}
                >
                  {isLoading
                    ? existingDocument
                      ? "Updating..."
                      : "Adding..."
                    : existingDocument
                    ? "Update Document"
                    : "Add New Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
}
