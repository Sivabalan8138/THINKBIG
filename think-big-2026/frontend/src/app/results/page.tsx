'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ResultsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSettingsAndLeaderboard = async () => {
    try {
      const settingsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings`);
      const settings = await settingsRes.json();
      
      if (settings.resultsPublished) {
        setPublished(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/evaluations/leaderboard`);
        const data = await res.json();
        setTeams(data);
      } else {
        setPublished(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettingsAndLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 circuit-bg text-foreground flex items-center justify-center">
        <h1 className="text-2xl neon-text animate-pulse">Loading Results...</h1>
      </div>
    );
  }

  if (!published) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 circuit-bg text-foreground flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">⏳</span>
          <h1 className="text-4xl font-bold neon-text mb-4">Results Not Yet Published</h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
            The THINK BIG 2026 evaluations are still underway. Final rankings and winners will be announced soon!
          </p>
          <Link href="/" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:bg-primary/90 transition-all">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 circuit-bg text-foreground">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
            THINK BIG 2026
          </h1>
          <h2 className="text-3xl font-bold neon-text mb-4">Final Leaderboard</h2>
          <p className="text-muted-foreground text-lg">Congratulations to all the innovators!</p>
        </div>

        <div className="glass rounded-3xl p-8 overflow-x-auto shadow-[0_0_50px_rgba(37,99,235,0.1)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-primary/30 text-sm uppercase tracking-wider text-muted-foreground">
                <th className="p-4 font-medium">Rank</th>
                <th className="p-4 font-medium">Domain Rank</th>
                <th className="p-4 font-medium">Team Name</th>
                <th className="p-4 font-medium">Project Title</th>
                <th className="p-4 font-medium">Domain</th>
                <th className="p-4 font-medium text-right">Judge Score</th>
                <th className="p-4 font-medium text-right">Final Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {teams.sort((a,b) => (a.rankings?.overallRank || 999) - (b.rankings?.overallRank || 999)).map((team, index) => (
                <motion.tr 
                  key={team._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`transition-colors ${index === 0 ? 'bg-yellow-500/10' : index === 1 ? 'bg-gray-300/10' : index === 2 ? 'bg-amber-700/10' : 'hover:bg-white/5'}`}
                >
                  <td className="p-4 font-bold text-2xl flex items-center gap-2">
                    {index === 0 ? '🥇 1' : index === 1 ? '🥈 2' : index === 2 ? '🥉 3' : team.rankings?.overallRank || '-'}
                  </td>
                  <td className="p-4 font-bold text-accent">{team.rankings?.domainRank || '-'}</td>
                  <td className="p-4 font-bold text-lg">{team.teamName}</td>
                  <td className="p-4 text-sm text-muted-foreground">{team.projectTitle}</td>
                  <td className="p-4 text-sm">
                    <span className="bg-secondary px-2 py-1 rounded text-xs">{team.domain}</span>
                  </td>
                  <td className="p-4 font-mono text-right text-sm">
                    {team.scores?.judgeScore?.toFixed(2) || '-'}
                  </td>
                  <td className="p-4 font-mono font-bold text-primary text-right text-xl shadow-inner">
                    {team.scores?.finalScore?.toFixed(2) || '-'}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
