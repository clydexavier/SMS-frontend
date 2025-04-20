import React, { useState } from 'react';

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
  260320316: "Player A",
  260320317: "Player B",
  260320318: "Player C",
  260320319: "Player D",
};

export default function GamePage() {
  // Extract matches and sort by suggested play order
  const matches = bracketData.rounds
    .map(item => ({
      id: item.match.id,
      round: item.match.round > 0 
        ? `Round ${item.match.round}` 
        : item.match.round === -1 
          ? "Losers 1" 
          : "Losers 2",
      player1Id: item.match.player1_id,
      player2Id: item.match.player2_id,
      player1: item.match.player1_id ? playerData[item.match.player1_id] || "TBD" : "TBD",
      player2: item.match.player2_id ? playerData[item.match.player2_id] || "TBD" : "TBD",
      state: item.match.state,
      playOrder: item.match.suggested_play_order
    }))
    .sort((a, b) => a.playOrder - b.playOrder);

  // State for the score reporting modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedWinner, setSelectedWinner] = useState(null);
  
  // State for multiple sets of scores
  const [scoreSets, setScoreSets] = useState([
    { player1Score: "", player2Score: "" }
  ]);

  // Handle opening the score reporting modal
  const openScoreModal = (match) => {
    setSelectedMatch(match);
    setScoreSets([{ player1Score: "", player2Score: "" }]);
    setSelectedWinner(null);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMatch(null);
  };

  // Handle submitting scores
  const submitScores = () => {
    // In a real app, you would send this data to your server
    console.log("Submitting scores:", {
      matchId: selectedMatch.id,
      scoreSets,
      winner: selectedWinner
    });
    
    // Close the modal after submission
    closeModal();
  };

  // Add a new set of scores
  const addSet = () => {
    setScoreSets([...scoreSets, { player1Score: "", player2Score: "" }]);
  };

  // Remove the last set of scores
  const removeSet = () => {
    if (scoreSets.length > 1) {
      setScoreSets(scoreSets.slice(0, -1));
    }
  };

  // Update score for a specific set
  const updateScore = (setIndex, player, value) => {
    const newScoreSets = [...scoreSets];
    newScoreSets[setIndex][`player${player}Score`] = value;
    setScoreSets(newScoreSets);
  };

  return (
    <div className="p-6 bg-gray-100 text-gray-900">
      <h2 className="text-xl font-semibold mb-4 text-green-700">Tournament Bracket</h2>
      
      {/* Matches Table View */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Play Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Round</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Match #</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Player1</th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase">vs.</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Player2</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {matches.map((match) => (
              <tr key={match.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{match.playOrder}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {match.round}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{match.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{match.player1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">vs.</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{match.player2}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button 
                    className="text-orange-500 hover:text-orange-700"
                    onClick={() => openScoreModal(match)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Score Reporting Modal */}
      {isModalOpen && selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white rounded-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <div className="flex space-x-6">
                <button className="text-gray-400 hover:text-white">Match details</button>
                <button className="text-white border-b-2 border-orange-500 pb-1">Report scores</button>
              </div>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4">
              <div className="flex justify-between mb-4">
                {scoreSets.length > 1 && (
                  <button 
                    onClick={removeSet}
                    className="text-orange-500 hover:text-orange-400"
                  >
                    REMOVE A SET
                  </button>
                )}
                {scoreSets.length === 1 && <div></div>}
                <button 
                  onClick={addSet}
                  className="text-orange-500 hover:text-orange-400"
                >
                  ADD A SET
                </button>
              </div>

              <div className="bg-gray-900 rounded-lg">
                <div className="flex justify-between bg-gray-800 px-6 py-3">
                  <div className="text-sm font-medium">Participant</div>
                  <div className="text-sm font-medium">Score</div>
                  {scoreSets.length > 1 && (
                    <div className="text-sm font-medium">Set {scoreSets.length}</div>
                  )}
                </div>

                <div className="flex justify-between px-6 py-4 items-center">
                  <div>{selectedMatch.player1}</div>
                  <input
                    type="number"
                    value={scoreSets[0].player1Score}
                    onChange={(e) => updateScore(0, 1, e.target.value)}
                    className="bg-gray-700 text-white w-20 p-2 rounded"
                    placeholder="Score"
                  />
                  {scoreSets.length > 1 && (
                    <input
                      type="number"
                      value={scoreSets[1].player1Score}
                      onChange={(e) => updateScore(1, 1, e.target.value)}
                      className="bg-gray-700 text-white w-20 p-2 rounded"
                      placeholder="Score"
                    />
                  )}
                </div>

                <div className="flex justify-between px-6 py-4 items-center">
                  <div>{selectedMatch.player2}</div>
                  <input
                    type="number"
                    value={scoreSets[0].player2Score}
                    onChange={(e) => updateScore(0, 2, e.target.value)}
                    className="bg-gray-700 text-white w-20 p-2 rounded"
                    placeholder="Score"
                  />
                  {scoreSets.length > 1 && (
                    <input
                      type="number"
                      value={scoreSets[1].player2Score}
                      onChange={(e) => updateScore(1, 2, e.target.value)}
                      className="bg-gray-700 text-white w-20 p-2 rounded"
                      placeholder="Score"
                    />
                  )}
                </div>
              </div>

              <div className="text-center my-8">
                <h3 className="text-2xl font-bold mb-4">Verify the winner</h3>
                <div className="flex justify-center">
                  <div className="bg-gray-700 rounded-full flex overflow-hidden">
                    <button
                      className={`px-8 py-2 ${selectedWinner === selectedMatch.player1Id ? 'bg-gray-600' : ''}`}
                      onClick={() => setSelectedWinner(selectedMatch.player1Id)}
                    >
                      {selectedMatch.player1}
                    </button>
                    <button
                      className={`px-8 py-2 ${selectedWinner === selectedMatch.player2Id ? 'bg-gray-600' : ''}`}
                      onClick={() => setSelectedWinner(selectedMatch.player2Id)}
                    >
                      {selectedMatch.player2}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <button
                  onClick={submitScores}
                  className="bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold py-3 px-8 rounded-full"
                >
                  SUBMIT SCORES
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}