import React, { useState, useEffect } from "react";
import Filter from "../../components/Filter";
import DocumentModal from "../../components/admin/DocumentModal";
import PaginationControls from "../../components/PaginationControls";
import { useParams } from "react-router-dom";
import axiosClient from "../../axiosClient";

export default function DocumentsPage() {
  const { intrams_id } = useParams();

  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
  });

  const filterOptions = [
    { label: "All", value: "All" },
    { label: "Policies", value: "Policies" },
    { label: "Staff", value: "Staff" },
    { label: "eBooks", value: "eBooks" },
    { label: "Audio & Video", value: "Audio & Video" },
  ];

  const openModal = () => {
    setSelectedDocument(null);
    setIsModalOpen(true);
  };

  const openEditModal = (doc) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
    setError(null);
  };

  const fetchDocuments = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/intramurals/${intrams_id}/documents`, {
        params: {
          page,
          type: activeTab,
          search,
        },
      });

      setDocuments(data.data);
      setPagination({
        currentPage: data.meta.current_page,
        perPage: data.meta.per_page,
        total: data.meta.total,
        lastPage: data.meta.last_page,
      });
    } catch (err) {
      setError("Failed to fetch documents");
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const addDocument = async (newDoc) => {
    try {
      setLoading(true);
      await axiosClient.post(`/intramurals/${intrams_id}/documents/create`, newDoc);
      await fetchDocuments();
      closeModal();
    } catch (err) {
      setError("Failed to add document");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateDocument = async (id, updatedDoc) => {
    try {
      setLoading(true);
      await axiosClient.post(`/intramurals/${intrams_id}/documents/${id}/edit`, updatedDoc);
      await fetchDocuments();
      closeModal();
    } catch (err) {
      setError("Failed to update document");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${name}?`);
    if (confirmDelete) {
      try {
        setLoading(true);
        await axiosClient.delete(`/intramurals/${intrams_id}/documents/${id}`);
        await fetchDocuments();
      } catch (err) {
        setError("Failed to delete document");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (intrams_id) {
        fetchDocuments(pagination.currentPage);
      }
    }, 1000);
    return () => clearTimeout(delayDebounce);
  }, [search, activeTab, pagination.currentPage, intrams_id]);

  const SkeletonLoader = () => (
    <div className="animate-pulse overflow-x-auto">
      <div className="shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>{[1, 2, 3, 4].map((i) => <th key={i} className="px-6 py-3"><div className="h-4 bg-gray-200 rounded w-20"></div></th>)}</tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, row) => (
              <tr key={row}>{[1, 2, 3, 4].map((col) => <td key={col} className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full text-sm">
      <h2 className="text-xl font-semibold mb-2 text-[#006600]">Documents</h2>

      <div className="w-full bg-gray-100 pt-4 pb-4 px-4 mb-4">
        <div className="flex justify-end">
          <button
            type="button"
            className="cursor-pointer focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 rounded-lg text-sm px-5 py-2.5 mb-2"
            onClick={openModal}
            disabled={loading}
          >
            Add Document
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
          {error}
        </div>
      )}

      <div className="flex-1 p-2 sm:p-4 md:p-6 bg-gray-100 text-gray-900 rounded-lg">
        <Filter
          activeTab={activeTab}
          setActiveTab={(value) => {
            setPagination((prev) => ({ ...prev, currentPage: 1 }));
            setActiveTab(value);
          }}
          search={search}
          setSearch={(value) => {
            setPagination((prev) => ({ ...prev, currentPage: 1 }));
            setSearch(value);
          }}
          placeholder="Search document"
          filterOptions={filterOptions}
        />

        {loading ? (
          <SkeletonLoader />
        ) : documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No documents found. Click "Add Document" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                      <a href={doc.fileUrl} download>{doc.name}</a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.size}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.mime_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
                      <button onClick={() => openEditModal(doc)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                      <button onClick={() => deleteDocument(doc.id, doc.name)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PaginationControls
              pagination={pagination}
              handlePageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      <DocumentModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        addDocument={addDocument}
        updateDocument={updateDocument}
        existingDocument={selectedDocument}
        isLoading={loading}
        error={error}
      />
    </div>
  );
}
