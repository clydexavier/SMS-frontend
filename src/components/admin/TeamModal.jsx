import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

export default function TeamModal({
  isModalOpen,
  closeModal,
  addTeam,
  updateTeam,
  existingTeam,
}) {
  const [formData, setFormData] = useState({ name: "", logo: null, previewLogo: "" });
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    if (existingTeam) {
      setFormData({ name: existingTeam.name || "", logo: null, previewLogo: existingTeam.logo || "" });
    } else {
      setFormData({ name: "", logo: null, previewLogo: "" });
    }
    setUploaded(false);
  }, [existingTeam]);

  const handleChange = (e) => {
    setFormData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const uploadFile = (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setFormData((prevData) => ({ ...prevData, logo: file, previewLogo: URL.createObjectURL(file) }));
    setUploaded(true);
  };

  const handleFileChange = (e) => uploadFile(e.target.files);
  const handleDrop = (e) => { e.preventDefault(); uploadFile(e.dataTransfer.files); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const teamData = new FormData();
    teamData.append("name", formData.name);
    if (formData.logo) teamData.append("logo", formData.logo);

    existingTeam ? updateTeam(existingTeam.id, teamData) : addTeam(teamData);
    closeModal();
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs">
        <div className="relative p-4 w-full max-w-md">
          <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {existingTeam ? "Update Team" : "Add New Team"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 dark:hover:bg-gray-600 dark:hover:text-white">
                <IoMdClose size={25} />
              </button>
            </div>

            <form className="p-4 md:p-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Team Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  placeholder="Enter team name" />
                </div>
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Team Logo</label>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-[50%] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">{uploaded ? formData.logo.name : "Click to upload or drag and drop"}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                      </div>
                      <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>
              </div>
              <button type="submit" className="text-black bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5" onClick={closeModal}>
                {existingTeam ? "Update Team" : "Add New Team"}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  );
}
