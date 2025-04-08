import React, { useState } from "react";
import TeamModal from "../../components/admin/TeamModal";
import Filter from "../../components/Filter";

export default function TeamsPage() {
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: "Tigers",
      logo: "https://via.placeholder.com/50", // Placeholder logo
    },
    {
      id: 2,
      name: "Eagles",
      logo: "https://via.placeholder.com/50",
    },
  ]);

  //filter states
  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Indoor", value: "Indoor" },
    { label: "Outdoor", value: "Outdoor" },
  ];
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  //modal states
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openEditModal = (team) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  const updateTeam = (id, updatedData) => {
    setTeams((prev) =>
      prev.map((team) => (team.id === id ? { ...team, ...updatedData } : team))
    );
    setSelectedTeam(null);
  };

  const addTeam = (newTeam) => {
    setTeams([...teams, { id: teams.length + 1, ...newTeam }]);
  };

  const deleteTeam = (id) => {
    setTeams(teams.filter((team) => team.id !== id));
  };

  const openModal = () => {
    setSelectedTeam(null);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full">
      {/* Section Title */}
      <div>
        <h2 className="text-xl font-semibold mb-2 text-[#006600]">Teams</h2>
      </div>

      {/* Add Button */}
      <div className="flex justify-end pt-4 pb-4 pr-4 mb-4 bg-gray-100">
        <button
          type="button"
          className="cursor-pointer focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          onClick={openModal}
        >
          Add Team
        </button>
      </div>

      {/* Filter and Table */}
      <div className="flex-1 p-6 bg-gray-100 text-gray-900">
      <Filter
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          search={search}
          setSearch={setSearch}
          placeholder="Search team name"
          filterOptions={filterOptions}
        />

        {/* Team Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Logo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeams.map((team) => (
                <tr key={team.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <img
                      src={team.logo}
                      alt={team.name}
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() => openEditModal(team)}
                    >
                      Edit
                    </button>
                    <button
                      className="ml-4 text-red-600 hover:text-red-900"
                      onClick={() => deleteTeam(team.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Modal */}
      <TeamModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        addTeam={addTeam}
        updateTeam={updateTeam}
        existingTeam={selectedTeam}
      />
    </div>
  );
}
