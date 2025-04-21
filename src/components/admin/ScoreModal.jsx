import React from "react";
import { IoMdClose } from "react-icons/io";

export default function ScoreModal({
  selectedMatch,
  isOpen,
  onClose,
  scoreSets,
  updateScore,
  addSet,
  removeSet,
  selectedWinner,
  setSelectedWinner,
  submitScores,
}) {
  if (!isOpen || !selectedMatch) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative p-4 w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#E6F2E8] rounded-t">
            <h3 className="text-lg font-semibold text-[#2A6D3A]">Report Scores</h3>
            <button
              onClick={onClose}
              className="text-[#2A6D3A]/70 hover:bg-[#F7FAF7] hover:text-[#2A6D3A] rounded-lg text-sm w-8 h-8 flex items-center justify-center transition-colors duration-200"
            >
              <IoMdClose size={22} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4">
            {scoreSets.map((set, i) => (
              <div key={i} className="mb-4">
                <div className="text-sm text-[#2A6D3A]/80 mb-1">Set {i + 1}</div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder={`${selectedMatch.player1} Score`}
                    className="bg-white border border-[#6BBF59]/30 text-gray-900 text-sm rounded-lg focus:ring-[#6BBF59]/50 focus:border-[#6BBF59] block w-full p-2.5"
                    value={set.player1Score}
                    onChange={(e) => updateScore(i, 1, e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder={`${selectedMatch.player2} Score`}
                    className="bg-white border border-[#6BBF59]/30 text-gray-900 text-sm rounded-lg focus:ring-[#6BBF59]/50 focus:border-[#6BBF59] block w-full p-2.5"
                    value={set.player2Score}
                    onChange={(e) => updateScore(i, 2, e.target.value)}
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-between mb-6 text-sm">
              <button onClick={removeSet} className="text-red-500 hover:underline">
                Remove a Set
              </button>
              <button onClick={addSet} className="text-blue-600 hover:underline">
                Add a Set
              </button>
            </div>

            {/* Winner Selection */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-[#2A6D3A]">
                Select Winner
              </label>
              <div className="flex gap-3">
                {[1, 2].map((n) => {
                  const playerId = selectedMatch[`player${n}Id`];
                  const name = selectedMatch[`player${n}`];
                  return (
                    <button
                      key={playerId}
                      onClick={() => setSelectedWinner(playerId)}
                      className={`flex-1 text-sm px-4 py-2 rounded-lg border transition-all duration-200 ${
                        selectedWinner === playerId
                          ? "bg-[#6BBF59] text-white"
                          : "bg-white border-[#6BBF59]/30 text-[#2A6D3A] hover:bg-[#F7FAF7]"
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Button */}
                <button
                onClick={submitScores}
                className="w-full text-white bg-[#6BBF59] hover:bg-[#5CAF4A] font-medium rounded-lg text-sm px-5 py-2.5 transition duration-200"
                >
                Submit Scores
                </button>

          </div>
        </div>
      </div>
    </div>
  );
}
