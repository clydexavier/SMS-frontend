import React, { useState } from "react";
import Filter from "../../components/Filter";
import DocumentModal from "../../components/admin/DocumentModal";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([
    { id: 1, title: "Summer Newsletter", description: "This is a description or excerpt of the publication.", categories: ["Policies", "Staff"], size: "1.1MB", type: "pdf", fileUrl: "/files/summer-newsletter.pdf" },
    { id: 2, title: "White Paper", description: "This is a description or excerpt of the publication.", categories: ["eBooks"], size: "2MB", type: "pdf", fileUrl: "/files/white-paper.pdf" },
    { id: 3, title: "Employee Handbook", description: "This is a description or excerpt of the publication.", categories: ["Staff"], size: "0.5GB", type: "www", fileUrl: "/files/employee-handbook.pdf" },
    { id: 4, title: "Company Brochure", description: "This is a description or excerpt of the publication.", categories: ["Processes"], size: "1.2MB", type: "pages", fileUrl: "/files/company-brochure.pages" },
    { id: 5, title: "Podcast - Latest Edition", description: "This is an embedded audio player:", categories: ["Audio & Video"], size: "249KB", type: "m4a", fileUrl: "/files/podcast.m4a" },
  ]);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Open Add/Edit Modal
  const openModal = (document = null) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => setIsModalOpen(false);

  // Add New Document
  const addDocument = (newDocument) => {
    setDocuments([...documents, { id: documents.length + 1, ...newDocument }]);
  };

  // Update Existing Document
  const updateDocument = (id, updatedDocument) => {
    setDocuments(documents.map((doc) => (doc.id === id ? { ...doc, ...updatedDocument } : doc)));
  };

  // Delete Document
  const deleteDocument = (id) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  // Download Document
  const downloadDocument = (fileUrl) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileUrl.split("/").pop(); // Extract file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter Documents
  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full">
      {/* Section Title */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-[#006600]">Documents</h2>
      </div>

      {/* Add Button */}
      <div className="flex justify-end pt-4 pb-4 pr-4 mb-4 bg-gray-100">
        <button
          type="button"
          className="cursor-pointer focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          onClick={() => openModal()}
        >
          Add Document
        </button>
      </div>

      {/* Filter */}
      <div className="p-6 bg-gray-100 text-gray-900">
        <Filter search={search} setSearch={setSearch} placeholder="Search document" />

        {/* Documents Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <a
                      href={doc.fileUrl}
                      download
                      className="text-blue-600 hover:underline"
                    >
                      {doc.title}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
                    <button onClick={() => openModal(doc)} className="text-blue-600 hover:text-blue-900">
                      Edit
                    </button>
                    <button onClick={() => deleteDocument(doc.id)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Documents Modal */}
      <DocumentModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        addDocument={addDocument}
        updateDocument={updateDocument}
        existingDocument={selectedDocument}
      />
    </div>
  );
}
