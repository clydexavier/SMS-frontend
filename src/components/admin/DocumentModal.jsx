import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

export default function DocumentModal({
  isModalOpen,
  closeModal,
  addDocument,
  updateDocument,
  existingDocument,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
  });

  useEffect(() => {
    if (existingDocument) {
      setFormData({ ...existingDocument, file: null });
    } else {
      setFormData({ title: "", description: "", file: null });
    }
  }, [existingDocument]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (existingDocument) {
      updateDocument(existingDocument.id, formData);
    } else {
      addDocument(formData);
    }
    closeModal();
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs">
        <div className="relative p-4 w-full max-w-md">
          <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {existingDocument ? "Update Document" : "Add New Document"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="cursor-pointer text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <IoMdClose size={25} />
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            {/* Form */}
            <form className="p-4 md:p-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 grid-cols-1">
                {/* Title */}
                <div className="col-span-1">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Document Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter document title"
                    required
                  />
                </div>

                {/* Description */}
                <div className="col-span-1">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter document description"
                    required
                  ></textarea>
                </div>

                {/* File Upload */}
                <div className="col-span-1">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Upload file
                    </label>
                    <div className="relative w-full">
                        <label
                        htmlFor="file_input"
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 px-4 py-2 text-center"
                        >
                        {formData.file ? formData.file.name : "Choose File"}
                        </label>
                        <input
                        id="file_input"
                        type="file"
                        onChange={handleFileChange}
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    </div>

            </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="cursor-pointer focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
              >
                {existingDocument ? "Update Document" : "Add New Document"}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  );
}
