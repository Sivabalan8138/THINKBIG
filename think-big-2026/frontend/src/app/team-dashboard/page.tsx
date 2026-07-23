'use client';

import { useState } from 'react';


export default function TeamDashboard() {
  const [teamId, setTeamId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [abstract, setAbstract] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId || !file || !abstract) {
      alert('Please fill in all fields.');
      return;
    }
    setUploading(true);

    try {
      const formData = new FormData();
      
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (fileExt === 'pdf') {
        formData.append('pdf', file);
      } else if (fileExt === 'ppt' || fileExt === 'pptx') {
        formData.append('ppt', file);
      } else {
        alert('Invalid file format. Please upload PDF or PPT/PPTX.');
        setUploading(false);
        return;
      }
      
      formData.append('abstract', abstract);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/teams/${teamId}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert('File and abstract successfully uploaded!');
        setFile(null);
        setAbstract('');
        setTeamId('');
      } else {
        alert(`Upload failed: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('Network error during upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 circuit-bg text-foreground">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold neon-text mb-8">Team Portal</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 glass p-6 rounded-2xl h-fit">
            <h2 className="text-xl font-bold text-accent border-b border-white/10 pb-2 mb-4">Team Status</h2>
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground mb-4">Enter your Team ID to upload your presentation and abstract. Your Team ID is in your registration email (e.g. TB26-XXXXXX).</p>
              <div>
                <label className="block text-sm font-bold text-accent mb-1">Your Team ID:</label>
                <input 
                  type="text" 
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value.toUpperCase())}
                  placeholder="TB26-XXXXXX"
                  className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 font-mono focus:outline-none focus:border-primary uppercase" 
                  required 
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 glass p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6">Submit Presentation & Abstract</h2>
            
            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Upload PPT / PDF (Max 20MB)</label>
                <input 
                  type="file" 
                  accept=".ppt,.pptx,.pdf"
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Project Abstract Summary</label>
                <textarea 
                  rows={6}
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  placeholder="Problem Statement, Solution, Innovation..."
                  className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" 
                  required 
                />
                <p className="text-xs text-muted-foreground mt-2">This abstract will be analyzed by our Advanced AI Evaluation Engine.</p>
              </div>

              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={uploading}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition shadow-[0_0_15px_rgba(37,99,235,0.4)] disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Submit Files'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
