import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

export default function GameModal({ isOpen, onClose, match }) {
  const [scores, setScores] = useState({ [match?.player1]: "", [match?.player2]: "" });
  const [winner, setWinner] = useState("");

  const handleScoreChange = (player, value) => {
    setScores((prev) => ({ ...prev, [player]: value }));
  };

  const handleSubmit = () => {
    if (winner && scores[match.player1] !== "" && scores[match.player2] !== "") {
      // Your submission logic here
      console.log("Submitted:", { scores, winner });
      onClose(); // Close modal after submission
    } else {
      alert("Please enter both scores and select a winner.");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="bg-gray-900 text-white max-w-lg w-full rounded-lg shadow-lg p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <X />
          </button>

          <Dialog.Title className="text-xl font-bold mb-4">Report Scores</Dialog.Title>

          <table className="w-full text-left mb-6">
            <thead>
              <tr className="text-sm text-gray-400 border-b border-gray-700">
                <th className="py-2">Participant</th>
                <th className="py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {[match.player1, match.player2].map((player) => (
                <tr key={player}>
                  <td className="py-2">{player}</td>
                  <td className="py-2">
                    <input
                      type="number"
                      value={scores[player]}
                      onChange={(e) => handleScoreChange(player, e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-center mb-4">
            <h4 className="font-semibold text-lg mb-2">Verify the winner</h4>
            <div className="flex justify-center gap-4">
              {[match.player1, match.player2].map((player) => (
                <button
                  key={player}
                  onClick={() => setWinner(player)}
                  className={`px-4 py-2 rounded-lg ${
                    winner === player ? "bg-green-600" : "bg-gray-700"
                  }`}
                >
                  {player}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold"
          >
            Submit Scores
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
