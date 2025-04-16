import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { FaTimesCircle } from "react-icons/fa";
import { FaFilePdf, FaFileWord, FaFileAlt, FaFile } from "react-icons/fa";

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

  const [uploaded, setUploaded] = useState(false);
  const [removeFile, setRemoveFile] = useState(false);

  // This effect runs when the modal opens with an existing document
  useEffect(() => {
    if (existingDocument) {
      // Make sure we're getting the file URL correctly
      const fileUrl = existingDocument.file_path || "";

      
      setFormData({
        name: existingDocument.name || "",
        description: existingDocument.description || "",
        file: null,
        previewFile: fileUrl,
      });
      
      // When editing, we want to show the existing file
      setUploaded(false);
      setRemoveFile(false);
    } else {
      setFormData({ name: "", description: "", file: null, previewFile: "" });
      setUploaded(false);
      setRemoveFile(false);
    }
    
    // Log for debugging
    console.log("Existing document:", existingDocument);
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

  const handleFileChange = (e) => uploadFile(e.target.files);
  const handleDrop = (e) => { e.preventDefault(); uploadFile(e.dataTransfer.files); };

  const handleRemoveFile = () => {
    setFormData((prevData) => ({
      ...prevData,
      file: null,
      previewFile: "",
    }));
    setUploaded(false);
    setRemoveFile(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a FormData object for file upload
    const documentData = new FormData();
    
    // Add method spoofing for updates
    if (existingDocument) {
      documentData.append('_method', 'PATCH');
    }

    documentData.append("name", formData.name);
    documentData.append("description", formData.description);

    if (formData.file) {
      documentData.append("file", formData.file);
    }

    if (removeFile) {
      documentData.append("remove_file", "1");
    }
    
    if (existingDocument) {
      updateDocument(existingDocument.id, documentData);
    } else {
      addDocument(documentData);
    }
    
    closeModal();
  };

  // Get the file name from the preview URL or file object
  const getFileName = () => {
    if (formData.file) {
      return formData.file.name;
    } else if (formData.previewFile && existingDocument) {
      const extension = existingDocument.mime_type.split('/')[1];
      return `${existingDocument.name}.${extension}`;
    }
    return "";
  };

  const getFileExtension = () => {
    const fileName = getFileName();
    if (!fileName) return "";
    const parts = fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
  };

  const getFileIcon = () => {
    const extension = getFileExtension();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf size={40} className="text-red-500" />;
      case 'doc':
      case 'docx':
        return <FaFileWord size={40} className="text-blue-500" />;
      case 'txt':
        return <FaFileAlt size={40} className="text-gray-500" />;
      default:
        return <FaFile size={40} className="text-gray-400" />;
    }
  };

  // More reliable way to determine if we should show a preview
  const shouldShowPreview = () => {
    if (removeFile) return false;
    if (uploaded && formData.file) return true;
    if (existingDocument && formData.previewFile && formData.previewFile !== "") return true;
    return false;
  };

  const showPreview = shouldShowPreview();

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs z-50">
        <div className="relative p-4 w-full max-w-md">
          <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {existingDocument ? "Update Document" : "Add New Document"}
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
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Document Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    placeholder="Enter document name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    maxLength="50"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    required
                    disabled={isLoading}
                    placeholder="Enter document description"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Upload File
                  </label>
                  
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className={`flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={isLoading ? null : handleDrop}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          {showPreview ? "Replace file" : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOCX, TXT, etc. (MAX. 5MB)</p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        name="file"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isLoading}
                      />
                    </label>
                  </div>

                  {/* Show file preview with appropriate icon */}
                  {showPreview && (
                    <div className="p-2 mt-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Current File:</p>
                      <div className="relative w-full max-w-full">
                        <div className="relative p-4 border rounded bg-gray-50 dark:bg-gray-600 flex items-center space-x-3 w-full max-w-full">
                          {getFileIcon()}
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                              {getFileName()}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formData.file ? `${(formData.file.size / 1024 / 1024).toFixed(2)} MB` : ""}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            disabled={isLoading}
                            className="absolute top-1 right-1 text-red-500 hover:text-red-700 bg-white rounded-full"
                            title="Remove file"
                          >
                            <FaTimesCircle size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}


                  {/* Debug information - uncomment if needed */}
                  {/* <div className="mt-2 text-xs text-gray-500">
                    <p>Debug - Has existing document: {existingDocument ? 'Yes' : 'No'}</p>
                    <p>Debug - Preview file: {formData.previewFile}</p>
                    <p>Debug - Should show preview: {shouldShowPreview() ? 'Yes' : 'No'}</p>
                  </div> */}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-black bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {existingDocument ? "Updating..." : "Adding..."}
                  </span>
                ) : existingDocument ? (
                  "Update Document"
                ) : (
                  "Add New Document"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  );
}