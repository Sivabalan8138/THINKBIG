'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function JudgeDashboard() {
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [scores, setScores] = useState({
    presentationSkills: 0,
    technicalExplanation: 0,
    qnaSession: 0
  });
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignedTeams();
  }, []);

  const fetchAssignedTeams = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/judges/assigned-teams`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setTeams(data);
      }
    } catch (error) {
      console.error('Failed to fetch assigned teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTeam = (team: any) => {
    setSelectedTeam(team);
    // Reset form
    setScores({ presentationSkills: 0, technicalExplanation: 0, qnaSession: 0 });
    setComments('');
    setIsLocked(team.evaluationStatus === 'judge_evaluated' || team.evaluationStatus === 'completed');
    
    // In a real app, you would fetch the existing evaluation if it exists to populate the locked view
    // For now, we just lock the UI based on team status
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/evaluations/${selectedTeam._id}/judge`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ scores, comments })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Scores Submitted! This evaluation is now LOCKED.');
        setIsLocked(true);
        // Update local team status
        setTeams(teams.map(t => t._id === selectedTeam._id ? { ...t, evaluationStatus: 'judge_evaluated' } : t));
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('Network error while submitting evaluation.');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateTotal = () => {
    return Number(scores.presentationSkills) + Number(scores.technicalExplanation) + Number(scores.qnaSession);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 circuit-bg text-foreground">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold neon-text mb-8">Judge Portal</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Teams List */}
          <div className="lg:col-span-1 glass rounded-2xl p-6 h-[70vh] flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-accent border-b border-white/10 pb-2">Assigned Teams</h2>
            <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
              {loading ? (
                <p className="text-muted-foreground text-sm">Loading teams...</p>
              ) : teams.length === 0 ? (
                <p className="text-muted-foreground text-sm">No teams assigned yet.</p>
              ) : (
                teams.map((team) => (
                  <div 
                    key={team._id} 
                    onClick={() => handleSelectTeam(team)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedTeam?._id === team._id ? 'border-primary bg-primary/10' : 'border-white/5 hover:border-primary/30 bg-background/50'}`}
                  >
                    <h3 className="font-bold">{team.teamName}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{team.projectTitle}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs bg-secondary px-2 py-1 rounded">{team.domain}</span>
                      <span className={`text-xs ${(team.evaluationStatus === 'judge_evaluated' || team.evaluationStatus === 'completed') ? 'text-green-400' : 'text-yellow-400'}`}>
                        {(team.evaluationStatus === 'judge_evaluated' || team.evaluationStatus === 'completed') ? 'Evaluated 🔒' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Evaluation Panel */}
          <div className="lg:col-span-2 glass rounded-2xl p-6 h-[70vh] overflow-y-auto relative custom-scrollbar">
            {!selectedTeam ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a team to begin evaluation
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-primary">{selectedTeam.teamName}</h2>
                    <p className="text-lg text-muted-foreground">{selectedTeam.projectTitle}</p>
                    <div className="mt-4 flex gap-4">
                      {selectedTeam.files?.pptUrl && (
                        <a href={selectedTeam.files.pptUrl} target="_blank" rel="noreferrer" className="text-sm text-accent hover:underline">
                          📄 View Presentation
                        </a>
                      )}
                      {selectedTeam.files?.pdfUrl && (
                        <a href={selectedTeam.files.pdfUrl} target="_blank" rel="noreferrer" className="text-sm text-accent hover:underline">
                          📄 View Abstract PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-background/50 border border-white/5 rounded-xl p-4 mb-8">
                  <h3 className="font-bold mb-2">Project Abstract</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedTeam.abstract?.problemStatement || 'No abstract provided.'}
                  </p>
                </div>

                {isLocked && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 font-bold flex items-center gap-2">
                    <span>🔒</span> This evaluation is LOCKED. You cannot modify the scores. Contact Admin to unlock.
                  </div>
                )}

                {/* Judge Scoring Form */}
                <h3 className="text-xl font-bold border-b border-white/10 pb-2 mb-6 flex justify-between items-end">
                  <span>Your Evaluation</span>
                  <span className="text-sm font-normal text-muted-foreground">Total: <span className={`font-bold text-lg ${calculateTotal() > 30 ? 'text-red-400' : 'text-primary'}`}>{calculateTotal()}</span> / 30</span>
                </h3>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Presentation Skills (0-10)</label>
                      <input 
                        type="number" min="0" max="10" 
                        value={scores.presentationSkills}
                        onChange={(e) => setScores({...scores, presentationSkills: Number(e.target.value)})}
                        disabled={isLocked}
                        className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none disabled:opacity-50" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Technical Explanation (0-10)</label>
                      <input 
                        type="number" min="0" max="10" 
                        value={scores.technicalExplanation}
                        onChange={(e) => setScores({...scores, technicalExplanation: Number(e.target.value)})}
                        disabled={isLocked}
                        className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none disabled:opacity-50" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Q&A Session (0-10)</label>
                      <input 
                        type="number" min="0" max="10" 
                        value={scores.qnaSession}
                        onChange={(e) => setScores({...scores, qnaSession: Number(e.target.value)})}
                        disabled={isLocked}
                        className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none disabled:opacity-50" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Additional Comments</label>
                    <textarea 
                      rows={4} 
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      disabled={isLocked}
                      className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 focus:border-primary focus:outline-none custom-scrollbar disabled:opacity-50"
                    ></textarea>
                  </div>

                  <div className="flex justify-end">
                    <button 
                      type="submit" 
                      disabled={isLocked || submitting || calculateTotal() > 30}
                      className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit & Lock Scores'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
