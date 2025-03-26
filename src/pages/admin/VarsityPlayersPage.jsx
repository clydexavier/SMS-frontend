import React, { useState } from "react";
import VarsityPlayerModal from "../../components/admin/VarsityPlayerModal";
import Filter from "../../components/Filter";

export default function VarsityPlayersPage() {
  const [players, setPlayers] = useState([
    {
      id: 1,
      name: "John Doe",
      studentNumber: "2021001",
      sport: "Basketball",
    },
    {
      id: 2,
      name: "Jane Smith",
      studentNumber: "2021002",
      sport: "Volleyball",
    },
  ]);

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openEditModal = (player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  const updatePlayer = (id, updatedData) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p)));
    setSelectedPlayer(null);
  };

  const addPlayer = (newPlayer) => {
    setPlayers([...players, { id: players.length + 1, ...newPlayer }]);
  };

  const deletePlayer = (id) => {
    setPlayers(players.filter((player) => player.id !== id));
  };

  const openModal = () => {
    setSelectedPlayer(null);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const [search, setSearch] = useState("");
  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full">
      <h2 className="text-xl font-semibold mb-2 text-[#006600]">Varsity Players</h2>

      <div className="flex justify-end pt-4 pb-4 pr-4 mb-4 bg-gray-100">
        <button
          type="button"
          className="cursor-pointer focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5"
          onClick={openModal}
        >
          Add Player
        </button>
      </div>

      <div className="flex-1 p-6 bg-gray-100 text-gray-900">
        <Filter search={search} setSearch={setSearch} placeholder="Search player" />

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sport</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPlayers.map((player) => (
                <tr key={player.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{player.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.studentNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.sport}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() => openEditModal(player)}
                    >
                      Edit
                    </button>
                    <button
                      className="ml-4 text-red-600 hover:text-red-900"
                      onClick={() => deletePlayer(player.id)}
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

      <VarsityPlayerModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        addPlayer={addPlayer}
        updatePlayer={updatePlayer}
        existingPlayer={selectedPlayer}
      />
    </div>
  );
}
