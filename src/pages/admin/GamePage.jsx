import React, { useState } from 'react';
import PaginationControls from '../../components/PaginationControls';
import ScoreModal from '../../components/admin/ScoreModal';

const bracketData = {
  rounds: [
    {
        "match": {
            "id": 409256398,
            "tournament_id": 16106052,
            "state": "open",
            "player1_id": 260320316,
            "player2_id": 260320319,
            "round": 1,
            "suggested_play_order": 1,
            "scores_csv": ""
        }
    },
    {
        "match": {
            "id": 409256399,
            "tournament_id": 16106052,
            "state": "open",
            "player1_id": 260320317,
            "player2_id": 260320318,
            "round": 1,
            "suggested_play_order": 2,
            "scores_csv": ""
        }
    },
    {
        "match": {
            "id": 409256401,
            "tournament_id": 16106052,
            "state": "pending",
            "player1_id": null,
            "player2_id": null,
            "round": -1,
            "suggested_play_order": 3,
            "scores_csv": ""
        }
    },
    {
        "match": {
            "id": 409256400,
            "tournament_id": 16106052,
            "state": "pending",
            "player1_id": null,
            "player2_id": null,
            "round": 2,
            "suggested_play_order": 4,
            "scores_csv": ""
        }
    },
    {
        "match": {
            "id": 409256402,
            "tournament_id": 16106052,
            "state": "pending",
            "player1_id": null,
            "player2_id": null,
            "round": -2,
            "suggested_play_order": 5,
            "scores_csv": ""
        }
    },
    {
        "match": {
            "id": 409256403,
            "tournament_id": 16106052,
            "state": "pending",
            "player1_id": null,
            "player2_id": null,
            "round": 3,
            "suggested_play_order": 6,
            "scores_csv": ""
        }
    },
    {
        "match": {
            "id": 409256404,
            "tournament_id": 16106052,
            "state": "pending",
            "player1_id": null,
            "player2_id": null,
            "round": 3,
            "suggested_play_order": 7,
            "scores_csv": ""
        }
    }
],
};

// Simulated player data - in a real app, you'd fetch this
const playerData = {
  260320316: "Team A",
  260320317: "Team B",
  260320318: "Team C",
  260320319: "Team D",
};

export default function GamePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedWinner, setSelectedWinner] = useState(null);
  const [scoreSets, setScoreSets] = useState([{ player1Score: "", player2Score: "" }]);

  const allMatches = bracketData.rounds
    .map(({ match }) => ({
      id: match.id,
      round:
        match.round > 0
          ? `Round ${match.round}`
          : match.round === -1
          ? "Losers 1"
          : "Losers 2",
      player1Id: match.player1_id,
      player2Id: match.player2_id,
      player1: playerData[match.player1_id] || "TBD",
      player2: playerData[match.player2_id] || "TBD",
      state: match.state,
      playOrder: match.suggested_play_order,
    }))
    .sort((a, b) => a.playOrder - b.playOrder);

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 4,
    total: allMatches.length,
    lastPage: Math.ceil(allMatches.length / 4),
  });

  const paginatedMatches = allMatches.slice(
    (pagination.currentPage - 1) * pagination.perPage,
    pagination.currentPage * pagination.perPage
  );

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  const openScoreModal = (match) => {
    setSelectedMatch(match);
    setScoreSets([{ player1Score: "", player2Score: "" }]);
    setSelectedWinner(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMatch(null);
  };

  const submitScores = () => {
    console.log({ matchId: selectedMatch.id, scoreSets, winner: selectedWinner });
    closeModal();
  };

  const addSet = () => setScoreSets([...scoreSets, { player1Score: "", player2Score: "" }]);
  const removeSet = () => scoreSets.length > 1 && setScoreSets(scoreSets.slice(0, -1));
  const updateScore = (index, player, value) => {
    const updated = [...scoreSets];
    updated[index][`player${player}Score`] = value;
    setScoreSets(updated);
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="bg-[#F7FAF7] px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-semibold text-[#2A6D3A]">Bracket Matches</h2>
      </div>

      <div className="flex-1 p-6 bg-[#F7FAF7]">
        <div className="grid gap-4">
          {paginatedMatches.map((match) => (
            <div
              key={match.id}
              className="bg-white rounded-xl border border-[#E6F2E8] shadow-sm p-4 flex flex-col sm:flex-row justify-between items-center gap-4 hover:bg-[#F7FAF7] transition"
            >
              <div className="text-sm text-gray-500 font-medium">
                #{match.playOrder} • {match.round}
              </div>
              <div className="flex items-center gap-2 font-medium text-base text-gray-800">
                <span>{match.player1}</span>
                <span className="text-gray-400">vs</span>
                <span>{match.player2}</span>
              </div>
              <button
                onClick={() => openScoreModal(match)}
                className="text-[#2A6D3A] bg-white border border-[#6BBF59]/30 hover:bg-[#F7FAF7] font-medium rounded-lg text-xs px-4 py-2 transition-colors"
              >
                Report Score
              </button>

            </div>
          ))}
        </div>

        <div className="mt-6">
          <PaginationControls pagination={pagination} handlePageChange={handlePageChange} />
        </div>
      </div>

      {/* Score Modal */}
      {isModalOpen && selectedMatch && (
        <ScoreModal
        isOpen={isModalOpen}
        selectedMatch={selectedMatch}
        onClose={closeModal}
        scoreSets={scoreSets}
        updateScore={updateScore}
        addSet={addSet}
        removeSet={removeSet}
        selectedWinner={selectedWinner}
        setSelectedWinner={setSelectedWinner}
        submitScores={submitScores}
      />
      )}
    </div>
  );
}