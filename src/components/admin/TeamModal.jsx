import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

export default function TeamModal({
  isModalOpen,
  closeModal,
  addTeam,
  updateTeam,
  existingTeam,
}) {
  const [formData, setFormData] = useState({
    name: "",
    logo: null, // Stores file object
    previewLogo: "", // Stores preview URL for the logo
  });

  const [dragText, changeDragText] = useState(
    <>
      <span className="font-semibold">Click to upload logo</span> or drag and
      drop
    </>
  );

  const [dragLabel, setDragLabel] = useState(
    <p className="text-xs text-gray-500 dark:text-gray-400">
      SVG, PNG, JPG or GIF (MAX. 800x400px)
    </p>
  );

  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    if (existingTeam) {
      setFormData({
        name: existingTeam.name || "",
        logo: null,
        previewLogo: existingTeam.logo || "", // Assuming `existingTeam.logo` is a URL
      });
    } else {
      setFormData({ name: "", logo: null, previewLogo: "" });
    }

    changeDragText(
      <>
        <span className="font-semibold">Click to upload logo</span> or drag and
        drop
      </>
    );
    setDragLabel(
      <p className="text-xs text-gray-500 dark:text-gray-400">
        SVG, PNG, JPG or GIF (MAX. 800x400px)
      </p>
    );
  }, [existingTeam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const uploadFile = (files) => {
    if (!files) return;

    const file = files[0];

    changeDragText(<span className="font-semibold">{file.name}</span>);
    setDragLabel(undefined);

    setFormData((prevData) => ({
      ...prevData,
      logo: file,
      previewLogo: URL.createObjectURL(file),
    }));

    setUploaded(true);
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    uploadFile(e.target.files);
  };

  const fileUploadDragOver = (e) => {
    e.preventDefault();
    changeDragText(
      <span className="font-semibold">Release to upload file.</span>
    );
  };

  const fileUploadDragLeave = (e) => {
    e.preventDefault();

    if (uploaded) {
      return;
    }
    changeDragText(
      <>
        <span className="font-semibold">Click to upload logo</span> or drag and
        drop
      </>
    );
  };

  const fileUploadDrop = (e) => {
    e.preventDefault();
    uploadFile(e.dataTransfer.files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const teamData = new FormData();
    teamData.append("name", formData.name);
    if (formData.logo) {
      teamData.append("logo", formData.logo);
    }

    if (existingTeam) {
      updateTeam(existingTeam.id, teamData);
    } else {
      addTeam(teamData);
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
                {existingTeam ? "Update Team" : "Add New Team"}
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
              <div className="grid gap-4 mb-4 grid-cols-2">
                {/* Team Name */}
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Team Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter team name"
                    required
                  />
                </div>

                {/* Team Logo */}
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Team Logo
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-[50%] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                      onChange={handleFileChange}
                      onDragOver={fileUploadDragOver}
                      onDragLeave={fileUploadDragLeave}
                      onDrop={fileUploadDrop}
                    >
                      <div
                        className="flex flex-col items-center justify-center pt-5 pb-6"
                        style={{ pointerEvents: "none" }}
                      >
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
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
                          {dragText}
                        </p>
                        {dragLabel}
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="cursor-pointer focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
              >
                {existingTeam ? "Update Team" : "Add New Team"}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  );
}
