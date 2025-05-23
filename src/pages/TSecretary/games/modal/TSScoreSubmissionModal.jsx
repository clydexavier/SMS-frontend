import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Plus, Minus, Loader } from "lucide-react";

export default function TSScoreSubmissionModal({ 
  isOpen, 
  match, 
  onClose, 
  submitScore
}) {
  // Initial state for score type selection
  const [scoreType, setScoreType] = useState("simple");
  
  // For simple scoring - initialize with empty strings instead of 0
  const [simpleScores, setSimpleScores] = useState({
    score_team1: "",
    score_team2: "",
  });
  
  // For set-based scoring - initialize with empty strings instead of 0
  const [sets, setSets] = useState([{ team1: "", team2: "" }]);
  
  // For winner-only (no scores)
  const [winnerId, setWinnerId] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  if (!isOpen) return null;
  
  // Convert sets to Challonge's scores_csv format
  function createScoresCsv() {
    return sets.map(set => `${set.team1 || 0}-${set.team2 || 0}`).join(',');
  }
  
  // Handle simple score change
  const handleSimpleScoreChange = (team, value) => {
    // Allow empty string or valid numbers
    const score = value === "" ? "" : parseInt(value) || 0;
    setSimpleScores(prev => ({
      ...prev,
      [`score_${team}`]: score
    }));
  };
  
  // Handle set score change
  const handleSetScoreChange = (index, team, value) => {
    // Allow empty string or valid numbers
    const score = value === "" ? "" : parseInt(value) || 0;
    setSets(prev => {
      const newSets = [...prev];
      newSets[index] = { 
        ...newSets[index], 
        [team]: score 
      };
      return newSets;
    });
  };
  
  // Add a new set
  const addSet = () => {
    setSets(prev => [...prev, { team1: "", team2: "" }]);
  };
  
  // Remove a set
  const removeSet = (index) => {
    if (sets.length <= 1) return;
    setSets(prev => prev.filter((_, i) => i !== index));
  };
  
  // Determine the winner based on the scoring type
  const determineWinner = () => {
    if (scoreType === "winner_only") {
      return winnerId;
    }
    
    if (scoreType === "simple") {
      const team1Score = simpleScores.score_team1 === "" ? 0 : simpleScores.score_team1;
      const team2Score = simpleScores.score_team2 === "" ? 0 : simpleScores.score_team2;
      return team1Score > team2Score ? match.team_1 : match.team_2;
    }
    
    // For set-based scoring, count sets won by each team
    let team1Sets = 0;
    let team2Sets = 0;
    
    sets.forEach(set => {
      const team1Score = set.team1 === "" ? 0 : set.team1;
      const team2Score = set.team2 === "" ? 0 : set.team2;
      
      if (team1Score > team2Score) team1Sets++;
      else if (team2Score > team1Score) team2Sets++;
    });
    
    return team1Sets > team2Sets ? match.team_1 : match.team_2;
  };
  
  // Handle score form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate that at least one score is entered for non-winner-only modes
    if (scoreType === "simple") {
      if (simpleScores.score_team1 === "" && simpleScores.score_team2 === "") {
        setError("Please enter at least one score.");
        return;
      }
    } else if (scoreType === "sets") {
      const hasAnyScores = sets.some(set => set.team1 !== "" || set.team2 !== "");
      if (!hasAnyScores) {
        setError("Please enter at least one score.");
        return;
      }
    }
    
    const winner = determineWinner();
    if (!winner) {
      setError("Please select a winner or enter scores that determine a winner.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      let payload = { winner_id: winner };
      
      // Add appropriate score data based on the scoring type
      if (scoreType === "simple") {
        payload.score_team1 = simpleScores.score_team1 === "" ? 0 : simpleScores.score_team1;
        payload.score_team2 = simpleScores.score_team2 === "" ? 0 : simpleScores.score_team2;
      } else if (scoreType === "sets") {
        payload.scores_csv = createScoresCsv();
      } else if (scoreType === "winner_only") {
        // Set 1-0 score for winner instead of 0-0
        if (winner === match.team_1) {
          payload.score_team1 = 1;
          payload.score_team2 = 0;
        } else {
          payload.score_team1 = 0;
          payload.score_team2 = 1;
        }
      }
      
      await submitScore(match.match_id, payload);
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      setError("Failed to submit scores. Please try again.");
      console.error(err);
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <div className="relative w-full max-w-md mx-auto max-h-[90vh] flex flex-col">
        <div className="relative bg-white rounded-xl shadow-lg border border-[#E6F2E8] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[#E6F2E8] bg-[#F7FAF7]">
            <h3 className="text-lg font-semibold text-[#2A6D3A] flex items-center">
              Report Match Results
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-[#2A6D3A]/70 hover:bg-[#F7FAF7] hover:text-[#2A6D3A] rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center transition-colors duration-200"
              aria-label="Close modal"
              disabled={isSubmitting}
            >
              <IoMdClose size={22} />
            </button>
          </div>
          
          {/* Form - Added scrollbar with overflow-y-auto */}
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto max-h-[calc(90vh-120px)]">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-6 border border-red-200">
                {error}
              </div>
            )}
            
            {/* Match Info - always visible even when submitting */}
            <div className="flex items-center justify-center mb-6 bg-[#F7FAF7] p-3 rounded-lg">
              <div className="text-center">
                <span className="font-medium text-lg text-[#2A6D3A]">{match.team1_name || "Team 1"}</span>
              </div>
              <div className="mx-4 text-gray-500">vs</div>
              <div className="text-center">
                <span className="font-medium text-lg text-[#2A6D3A]">{match.team2_name || "Team 2"}</span>
              </div>
            </div>
            
            {isSubmitting ? (
              /* Form loading state animation */
              <div className="space-y-4 animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded" />
                ))}
              </div>
            ) : (
              /* Form content */
              <>
                {/* Score Type Selection */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium text-[#2A6D3A]">Score Type</div>
                    {scoreType === "sets" && (
                      <button
                        type="button"
                        onClick={addSet}
                        className="text-[#6BBF59] text-sm flex items-center hover:text-[#5CAF4A]"
                      >
                        <Plus size={16} className="mr-1" />
                        Add Set
                      </button>
                    )}
                  </div>
                  <div className="flex space-x-2 bg-[#F7FAF7] p-1 rounded-lg border border-[#E6F2E8]">
                    <button
                      type="button"
                      onClick={() => setScoreType("winner_only")}
                      className={`flex-1 px-3 py-1.5 text-sm rounded-md ${
                        scoreType === "winner_only" ? "bg-[#6BBF59] text-white" : "text-[#2A6D3A] hover:bg-[#E6F2E8]"
                      }`}
                    >
                      Winner Only
                    </button>
                    <button
                      type="button"
                      onClick={() => setScoreType("simple")}
                      className={`flex-1 px-3 py-1.5 text-sm rounded-md ${
                        scoreType === "simple" ? "bg-[#6BBF59] text-white" : "text-[#2A6D3A] hover:bg-[#E6F2E8]"
                      }`}
                    >
                      Simple Score
                    </button>
                    <button
                      type="button"
                      onClick={() => setScoreType("sets")}
                      className={`flex-1 px-3 py-1.5 text-sm rounded-md ${
                        scoreType === "sets" ? "bg-[#6BBF59] text-white" : "text-[#2A6D3A] hover:bg-[#E6F2E8]"
                      }`}
                    >
                      Sets
                    </button>
                  </div>
                </div>
                
                {/* Winner Only UI */}
                {scoreType === "winner_only" && (
                  <div className="mb-8">
                    <div className="text-center mb-2">
                      <div className="text-lg font-medium text-[#2A6D3A] mb-4">Select the winner</div>
                      <div className="flex justify-center gap-4">
                        <button
                          type="button"
                          onClick={() => setWinnerId(match.team_1)}
                          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                            winnerId === match.team_1 
                              ? "bg-[#6BBF59] text-white" 
                              : "bg-white border border-[#E6F2E8] text-[#2A6D3A] hover:bg-[#F7FAF7]"
                          }`}
                        >
                          {match.team1_name || "Team 1"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setWinnerId(match.team_2)}
                          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                            winnerId === match.team_2 
                              ? "bg-[#6BBF59] text-white" 
                              : "bg-white border border-[#E6F2E8] text-[#2A6D3A] hover:bg-[#F7FAF7]"
                          }`}
                        >
                          {match.team2_name || "Team 2"}
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-center text-gray-600">
                      <span className="text-[#2A6D3A] font-medium">Note:</span> The winner will receive a score of 1, and the loser will receive a score of 0.
                    </div>
                  </div>
                )}
                
                {/* Simple Score UI */}
                {scoreType === "simple" && (
                  <div className="mb-8">
                    <table className="w-full text-left mb-6">
                      <thead>
                        <tr className="text-sm text-[#2A6D3A] border-b border-[#E6F2E8]">
                          <th className="py-2">Participant</th>
                          <th className="py-2 text-right">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[#E6F2E8]">
                          <td className="py-3 text-gray-700">{match.team1_name || "Team 1"}</td>
                          <td className="py-2">
                            <input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={simpleScores.score_team1}
                              onChange={(e) => handleSimpleScoreChange("team1", e.target.value)}
                              className="w-full bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] px-3 py-2 text-right transition-all duration-200"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 text-gray-700">{match.team2_name || "Team 2"}</td>
                          <td className="py-2">
                            <input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={simpleScores.score_team2}
                              onChange={(e) => handleSimpleScoreChange("team2", e.target.value)}
                              className="w-full bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] px-3 py-2 text-right transition-all duration-200"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    
                    <div className="text-center mb-2">
                      <div className="text-lg font-medium text-[#2A6D3A] mb-4">Verify the winner</div>
                      <div className="flex justify-center gap-4">
                        <button
                          type="button"
                          onClick={() => setWinnerId(match.team_1)}
                          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                            (winnerId === match.team_1 || ((simpleScores.score_team1 !== "" && simpleScores.score_team2 !== "") && 
                              (parseInt(simpleScores.score_team1) > parseInt(simpleScores.score_team2)) && !winnerId)) 
                              ? "bg-[#6BBF59] text-white" 
                              : "bg-white border border-[#E6F2E8] text-[#2A6D3A] hover:bg-[#F7FAF7]"
                          }`}
                        >
                          {match.team1_name || "Team 1"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setWinnerId(match.team_2)}
                          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                            (winnerId === match.team_2 || ((simpleScores.score_team1 !== "" && simpleScores.score_team2 !== "") && 
                              (parseInt(simpleScores.score_team2) > parseInt(simpleScores.score_team1)) && !winnerId)) 
                              ? "bg-[#6BBF59] text-white" 
                              : "bg-white border border-[#E6F2E8] text-[#2A6D3A] hover:bg-[#F7FAF7]"
                          }`}
                        >
                          {match.team2_name || "Team 2"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Set-based Score UI */}
                {scoreType === "sets" && (
                  <div className="mb-8">
                    <table className="w-full text-left mb-6">
                      <thead>
                        <tr className="text-sm text-[#2A6D3A] border-b border-[#E6F2E8]">
                          <th className="py-2">Set</th>
                          <th className="py-2 text-center">{match.team1_name || "Team 1"}</th>
                          <th className="py-2 text-center">{match.team2_name || "Team 2"}</th>
                          <th className="py-2 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {sets.map((set, index) => (
                          <tr key={index} className="border-b border-[#E6F2E8]">
                            <td className="py-3 text-gray-700">#{index + 1}</td>
                            <td className="py-2">
                              <input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={set.team1}
                                onChange={(e) => handleSetScoreChange(index, "team1", e.target.value)}
                                className="w-full bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] px-3 py-2 text-center transition-all duration-200"
                              />
                            </td>
                            <td className="py-2">
                              <input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={set.team2}
                                onChange={(e) => handleSetScoreChange(index, "team2", e.target.value)}
                                className="w-full bg-white border border-[#E6F2E8] text-gray-700 text-sm rounded-lg focus:ring-[#6BBF59] focus:border-[#6BBF59] px-3 py-2 text-center transition-all duration-200"
                              />
                            </td>
                            <td className="py-2 text-right">
                              {sets.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeSet(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Minus size={16} />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {/* Display set summary */}
                    <div className="text-sm text-gray-600 mb-6 p-3 bg-[#F7FAF7] rounded-lg">
                      <div className="flex justify-between">
                        <span>Sets Won</span>
                        <div>
                          <span className="font-medium text-[#2A6D3A]">{match.team1_name || "Team 1"}: </span>
                          <span>{sets.filter(set => set.team1 !== "" && set.team2 !== "" && parseInt(set.team1) > parseInt(set.team2)).length}</span>
                          <span className="mx-2">|</span>
                          <span className="font-medium text-[#2A6D3A]">{match.team2_name || "Team 2"}: </span>
                          <span>{sets.filter(set => set.team1 !== "" && set.team2 !== "" && parseInt(set.team2) > parseInt(set.team1)).length}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center mb-2">
                      <div className="text-lg font-medium text-[#2A6D3A] mb-4">Verify the winner</div>
                      <div className="flex justify-center gap-4">
                        <button
                          type="button"
                          onClick={() => setWinnerId(match.team_1)}
                          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                            (winnerId === match.team_1 || (sets.filter(set => set.team1 !== "" && set.team2 !== "" && 
                              parseInt(set.team1) > parseInt(set.team2)).length > 
                              sets.filter(set => set.team1 !== "" && set.team2 !== "" && 
                              parseInt(set.team2) > parseInt(set.team1)).length && !winnerId)) 
                              ? "bg-[#6BBF59] text-white" 
                              : "bg-white border border-[#E6F2E8] text-[#2A6D3A] hover:bg-[#F7FAF7]"
                          }`}
                        >
                          {match.team1_name || "Team 1"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setWinnerId(match.team_2)}
                          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                            (winnerId === match.team_2 || (sets.filter(set => set.team1 !== "" && set.team2 !== "" && 
                              parseInt(set.team2) > parseInt(set.team1)).length > 
                              sets.filter(set => set.team1 !== "" && set.team2 !== "" && 
                              parseInt(set.team1) > parseInt(set.team2)).length && !winnerId)) 
                              ? "bg-[#6BBF59] text-white" 
                              : "bg-white border border-[#E6F2E8] text-[#2A6D3A] hover:bg-[#F7FAF7]"
                          }`}
                        >
                          {match.team2_name || "Team 2"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            
            {/* Action Buttons - always visible */}
            <div className="flex justify-end mt-6 space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="text-[#2A6D3A] bg-white border border-[#E6F2E8] hover:bg-[#F7FAF7] font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="text-white bg-[#6BBF59] hover:bg-[#5CAF4A] font-medium rounded-lg text-sm px-5 py-2.5 transition-colors duration-200 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader size={16} className="mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Scores"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}