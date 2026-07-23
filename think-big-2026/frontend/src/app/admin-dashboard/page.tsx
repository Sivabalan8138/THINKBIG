'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data State
  const [settings, setSettings] = useState({ 
    isRegistrationOpen: true, 
    isCandidateIdOpen: false, 
    sampleCertificateUrl: '', 
    resultsPublished: false,
    certNameX: 0, certNameY: 325,
    certDeptX: 310, certDeptY: 386,
    certQrX: 46, certQrY: 461,
    certNameFontSize: 48
  });
  const [teams, setTeams] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [judges, setJudges] = useState<any[]>([]);
  
  // UI State
  const [loading, setLoading] = useState(false);

  // New Judge Form State
  const [newJudge, setNewJudge] = useState({ username: '', password: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([
      fetchSettings(),
      fetchTeams(),
      fetchActivities(),
      fetchJudges()
    ]);
    setLoading(false);
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings`);
      const data = await res.json();
      if (res.ok) setSettings(data);
    } catch (e) {}
  };

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/teams`, { headers: { Authorization: `Bearer ${token}` }});
      const data = await res.json();
      if (res.ok) setTeams(Array.isArray(data) ? data : data.teams || []);
    } catch (e) {}
  };

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/activities`, { headers: { Authorization: `Bearer ${token}` }});
      const data = await res.json();
      if (res.ok) setActivities(Array.isArray(data) ? data : []);
    } catch (e) {}
  };

  const fetchJudges = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/judges/all`, { headers: { Authorization: `Bearer ${token}` }});
      const data = await res.json();
      if (res.ok) setJudges(Array.isArray(data) ? data : []);
    } catch (e) {}
  };

  const toggleSetting = async (key: string) => {
    try {
      const token = localStorage.getItem('token');
      const newValue = !(settings as any)[key];
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ [key]: newValue })
      });
      if (res.ok) {
        setSettings(prev => ({ ...prev, [key]: newValue }));
        fetchActivities();
      }
    } catch (e) {}
  };

  const saveCoordinates = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          certNameX: settings.certNameX, certNameY: settings.certNameY,
          certDeptX: settings.certDeptX, certDeptY: settings.certDeptY,
          certQrX: settings.certQrX, certQrY: settings.certQrY,
          certNameFontSize: settings.certNameFontSize,
        })
      });
      if (res.ok) {
        alert('Coordinates saved successfully!');
        fetchActivities();
      }
    } catch (e) {
      alert('Failed to save coordinates');
    }
  };

  const togglePublishResults = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/evaluations/publish`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setSettings(prev => ({ ...prev, resultsPublished: !prev.resultsPublished }));
        fetchActivities();
      }
    } catch (e) {}
  };



  const calculateRankings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/evaluations/calculate-rankings`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      alert(data.message);
      fetchTeams();
    } catch (e) {}
  };

  const downloadReport = async (reportType: string, format: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/reports/${reportType}/export/${format}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to download report');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report.${format === 'excel' ? 'xlsx' : format === 'word' ? 'docx' : format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error downloading report');
    }
  };

  const deleteTeam = async (teamId: string) => {
    if (!window.confirm("Are you sure you want to delete this team? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/teams/${teamId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      alert(data.message);
      if (res.ok) fetchTeams();
    } catch (e) {
      alert("Failed to delete team");
    }
  };

  const submitScore = async (teamId: string) => {
    const scoreStr = prompt("Enter manual Judge Score (0-100):");
    if (scoreStr === null) return;
    const score = Number(scoreStr);
    if (isNaN(score) || score < 0 || score > 100) {
      alert("Invalid score. Must be a number between 0 and 100.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/evaluations/${teamId}/admin-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ score })
      });
      const data = await res.json();
      alert(data.message);
      if (res.ok) fetchTeams();
    } catch (e) {
      alert("Failed to submit score");
    }
  };

  const issueCertificates = async (teamId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/certificates/issue/${teamId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ certificateType: 'Participation Certificate' })
      });
      const data = await res.json();
      alert(data.message || 'Certificates issued and emailed!');
    } catch (err) {
      alert("Failed to issue certificates");
    }
  };

  const uploadCertificateTemplate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('certificate', file);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings/upload-certificate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        alert('Template uploaded successfully!');
        fetchSettings();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Upload failed');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 circuit-bg text-foreground">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-bold neon-text">Admin Master Control</h1>
            <p className="text-muted-foreground mt-2">THINK BIG 2026</p>
          </div>
          <div className="flex gap-4 border-b border-white/10 pb-4">
            {['overview', 'evaluations', 'leaderboard', 'reports'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full font-bold capitalize transition ${activeTab === tab ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'hover:bg-white/5'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading && <div className="text-center py-10">Loading master dashboard...</div>}

        {!loading && activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold neon-text mb-4">Export Hub</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: 'registration', title: 'Team Registration', desc: 'All registered teams and members' },
                { id: 'ai-evaluation', title: 'AI Evaluation', desc: 'Abstract, PPT, and AI sub-scores' },
                { id: 'judge-evaluation', title: 'Judge Evaluation', desc: 'Live presentation scores' },
                { id: 'final-ranking', title: 'Final Ranking', desc: 'Aggregated leaderboard' },
                { id: 'attendance', title: 'Attendance', desc: 'Printable signature sheet' },
                { id: 'winners', title: 'Winners', desc: 'Top 3 and Domain winners' },
                { id: 'certificates', title: 'Certificates', desc: 'All issued certificates log' }
              ].map(report => (
                <div key={report.id} className="glass p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-1">{report.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{report.desc}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <button onClick={() => downloadReport(report.id, 'excel')} className="bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-500/30 py-2 rounded text-sm font-bold transition">Excel</button>
                    <button onClick={() => downloadReport(report.id, 'csv')} className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 py-2 rounded text-sm font-bold transition">CSV</button>
                    <button onClick={() => downloadReport(report.id, 'pdf')} className="bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30 py-2 rounded text-sm font-bold transition">PDF</button>
                    <button onClick={() => downloadReport(report.id, 'word')} className="bg-blue-800/20 text-blue-300 hover:bg-blue-800/30 border border-blue-700/30 py-2 rounded text-sm font-bold transition">Word</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="glass p-6 rounded-2xl text-center">
                <div className="text-3xl font-bold text-primary mb-2">{teams.length}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Teams</div>
              </div>
              <div className="glass p-6 rounded-2xl text-center">
                <div className="text-3xl font-bold text-primary mb-2">{judges.length}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Active Judges</div>
              </div>
              <div className="glass p-6 rounded-2xl text-center">
                <div className="text-3xl font-bold text-primary mb-2">{teams.filter(t => t.evaluationStatus === 'completed').length}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Completed Evals</div>
              </div>
              <div className="glass p-6 rounded-2xl text-center">
                <div className="text-3xl font-bold text-primary mb-2">{settings.resultsPublished ? 'YES' : 'NO'}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Results Published</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-6 text-accent">Global Controls</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-white/5">
                    <div><h4 className="font-bold">Team Registration</h4><p className="text-sm text-muted-foreground">Allow new teams to register</p></div>
                    <button onClick={() => toggleSetting('isRegistrationOpen')} className={`px-4 py-2 rounded-lg font-bold ${settings.isRegistrationOpen ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
                      {settings.isRegistrationOpen ? 'OPEN' : 'CLOSED'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-white/5">
                    <div><h4 className="font-bold">Candidate ID Visibility</h4><p className="text-sm text-muted-foreground">Allow teams to view their ID</p></div>
                    <button onClick={() => toggleSetting('isCandidateIdOpen')} className={`px-4 py-2 rounded-lg font-bold ${settings.isCandidateIdOpen ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
                      {settings.isCandidateIdOpen ? 'OPEN' : 'CLOSED'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-6 text-accent">Audit / Activity Logs</h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {activities.map((act, i) => (
                    <div key={i} className="p-4 bg-background/50 rounded-xl border border-white/5 text-sm">
                      <div className="flex justify-between font-bold text-primary mb-1">
                        <span>{act.action}</span>
                        <span className="text-xs text-muted-foreground font-normal">{new Date(act.createdAt).toLocaleString()}</span>
                      </div>
                      <p>{act.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 mt-8">
              <h3 className="text-xl font-semibold mb-6 text-accent">Attendance Reports</h3>
              <p className="text-sm text-muted-foreground mb-4">Export the approved team attendance roster.</p>
              <div className="flex gap-4">
                <a href={`\${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/attendance/export/excel`} target="_blank" className="bg-green-600/80 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition">
                  📊 Export to Excel
                </a>
                <a href={`\${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/attendance/export/pdf`} target="_blank" className="bg-red-600/80 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition">
                  📄 Export to PDF
                </a>
                <a href={`\${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/attendance/export/word`} target="_blank" className="bg-blue-600/80 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition">
                  📝 Export to Word
                </a>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 mt-8">
              <h3 className="text-xl font-semibold mb-6 text-accent">Certificate Settings</h3>
              <p className="text-sm text-muted-foreground mb-4">Upload a blank certificate template (PNG/JPG). The system will overlay text details on top of this template.</p>
              
              <div className="flex items-center gap-4 bg-background/50 p-4 rounded-xl border border-white/5 mb-6">
                <input 
                  type="file" 
                  accept="image/png, image/jpeg" 
                  onChange={uploadCertificateTemplate} 
                  className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {settings?.sampleCertificateUrl && (
                  <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${settings.sampleCertificateUrl}`} target="_blank" className="text-primary hover:underline text-sm font-bold whitespace-nowrap">
                    View Current Template
                  </a>
                )}
              </div>

              <h4 className="font-bold mb-4">Certificate Layout Coordinates</h4>
              <p className="text-sm text-muted-foreground mb-4">Adjust the X and Y positions of elements drawn on the certificate. (PDF points, origin is top-left).</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-background/50 p-4 rounded-xl border border-white/5">
                  <label className="block text-sm font-bold mb-2">Student Name</label>
                  <div className="flex gap-2">
                    <input type="number" value={settings.certNameX || 0} onChange={e => setSettings({...settings, certNameX: Number(e.target.value)})} className="w-full bg-background/50 border border-white/10 rounded p-2 text-sm" placeholder="X (0 for center)" title="X Coordinate" />
                    <input type="number" value={settings.certNameY || 325} onChange={e => setSettings({...settings, certNameY: Number(e.target.value)})} className="w-full bg-background/50 border border-white/10 rounded p-2 text-sm" placeholder="Y" title="Y Coordinate" />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-bold mb-2">Font Size</label>
                    <input type="number" value={settings.certNameFontSize || 48} onChange={e => setSettings({...settings, certNameFontSize: Number(e.target.value)})} className="w-full bg-background/50 border border-white/10 rounded p-2 text-sm" placeholder="Font Size" />
                  </div>
                </div>

                <div className="bg-background/50 p-4 rounded-xl border border-white/5">
                  <label className="block text-sm font-bold mb-2">Department & Year</label>
                  <div className="flex gap-2">
                    <input type="number" value={settings.certDeptX || 310} onChange={e => setSettings({...settings, certDeptX: Number(e.target.value)})} className="w-full bg-background/50 border border-white/10 rounded p-2 text-sm" placeholder="X" />
                    <input type="number" value={settings.certDeptY || 386} onChange={e => setSettings({...settings, certDeptY: Number(e.target.value)})} className="w-full bg-background/50 border border-white/10 rounded p-2 text-sm" placeholder="Y" />
                  </div>
                </div>

                <div className="bg-background/50 p-4 rounded-xl border border-white/5">
                  <label className="block text-sm font-bold mb-2">QR Code</label>
                  <div className="flex gap-2">
                    <input type="number" value={settings.certQrX || 46} onChange={e => setSettings({...settings, certQrX: Number(e.target.value)})} className="w-full bg-background/50 border border-white/10 rounded p-2 text-sm" placeholder="X" />
                    <input type="number" value={settings.certQrY || 461} onChange={e => setSettings({...settings, certQrY: Number(e.target.value)})} className="w-full bg-background/50 border border-white/10 rounded p-2 text-sm" placeholder="Y" />
                  </div>
                </div>
              </div>

              <button onClick={saveCoordinates} className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-bold transition">
                Save Layout Coordinates
              </button>
            </div>

          </div>
        )}



        {!loading && activeTab === 'evaluations' && (
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-6 text-accent">Evaluation Status</h3>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-sm text-muted-foreground">
                  <th className="pb-3">Team</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Score (100)</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {teams.map(team => (
                  <tr key={team._id}>
                    <td className="py-4">
                      <div className="font-bold">{team.teamName}</div>
                      <div className="text-xs text-muted-foreground">ID: {team._id}</div>
                    </td>
                    <td className="py-4"><span className="text-xs bg-secondary px-2 py-1 rounded capitalize">{team.evaluationStatus.replace('_', ' ')}</span></td>
                    <td className="py-4 font-mono">{team.scores?.judgeScore?.toFixed(2) || '-'}</td>
                    <td className="py-4 flex gap-2">
                      <button onClick={() => submitScore(team._id)} className="text-xs bg-secondary/80 text-secondary-foreground border border-secondary/50 px-2 py-1 rounded hover:bg-secondary">Enter Score</button>
                      <button onClick={() => issueCertificates(team._id)} className="text-xs bg-green-600/20 text-green-500 border border-green-500/50 px-2 py-1 rounded hover:bg-green-600/30">Issue Cert</button>
                      <button onClick={() => deleteTeam(team._id)} className="text-xs bg-red-600/20 text-red-500 border border-red-500/50 px-2 py-1 rounded hover:bg-red-600/30">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && activeTab === 'leaderboard' && (
          <div className="glass rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <h3 className="text-xl font-semibold text-accent">Final Rankings</h3>
              <div className="flex gap-4">
                <button onClick={calculateRankings} className="bg-secondary text-secondary-foreground px-4 py-2 rounded font-bold text-sm">Calculate Ranks</button>
                <button onClick={togglePublishResults} className={`px-4 py-2 rounded font-bold text-sm ${settings.resultsPublished ? 'bg-red-500 text-white' : 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]'}`}>
                  {settings.resultsPublished ? 'Unpublish Results' : 'Publish to Public'}
                </button>
              </div>
            </div>
            
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-sm text-muted-foreground">
                  <th className="pb-3">Overall Rank</th>
                  <th className="pb-3">Domain Rank</th>
                  <th className="pb-3">Team Name</th>
                  <th className="pb-3">Domain</th>
                  <th className="pb-3">Final Score (100)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[...teams].sort((a,b) => (a.rankings?.overallRank || 999) - (b.rankings?.overallRank || 999)).map(team => (
                  <tr key={team._id}>
                    <td className="py-4 font-bold text-xl">{team.rankings?.overallRank || '-'}</td>
                    <td className="py-4 font-bold text-accent">{team.rankings?.domainRank || '-'}</td>
                    <td className="py-4 font-bold">{team.teamName}</td>
                    <td className="py-4 text-sm text-muted-foreground">{team.domain}</td>
                    <td className="py-4 font-mono font-bold text-primary">{team.scores?.finalScore?.toFixed(2) || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
