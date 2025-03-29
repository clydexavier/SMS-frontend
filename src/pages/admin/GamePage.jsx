import React from 'react'

const bracketData = {
    rounds: [
      {
        name: "1st Round",
        matches: [
          { id: 1, player1: "B", player2: "D" },
          { id: 2, player1: "A", player2: "C" },
        ],
      },
      {
        name: "Semifinals",
        matches: [
          { id: 3, player1: "Winner of 1", player2: "Winner of 2" },
        ],
      },
      {
        name: "Finals",
        matches: [
          { id: 4, player1: "Winner of Semifinals", player2: "Loser of Semifinals (if necessary)" },
        ],
      },
    ],
  };

export default function GamePage() {
    return (
        <div className="p-6 bg-gray-100 text-gray-900">
          <h2 className="text-xl font-semibold mb-4 text-[#006600]">Tournament Bracket</h2>
          
          {/* Table View */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Round</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Match #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Player 1</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Player 2</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bracketData.rounds.map((round, roundIndex) => (
                  round.matches.map((match, matchIndex) => (
                    <tr key={match.id}>
                      {matchIndex === 0 && (
                        <td rowSpan={round.matches.length} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {round.name}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{match.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{match.player1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{match.player2}</td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
    
          {/* Bracket View */}
          <div className="flex flex-col items-center p-6 bg-gray-900 text-white rounded-lg shadow-md">
            {bracketData.rounds.map((round, index) => (
              <div key={index} className="mb-6 w-full text-center">
                <h3 className="text-lg font-semibold mb-2">{round.name}</h3>
                <div className="flex justify-center gap-6">
                  {round.matches.map((match) => (
                    <div key={match.id} className="border border-gray-400 p-4 rounded-lg bg-gray-700 w-64 text-center">
                      <p className="font-medium">{match.player1}</p>
                      <p className="text-sm text-gray-300">vs.</p>
                      <p className="font-medium">{match.player2}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
}
