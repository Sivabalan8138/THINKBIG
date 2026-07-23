'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    teamName: '',
    projectTitle: '',
    domain: '',
    teamLeaderName: '',
    registerNumber: '',
    department: '',
    year: '',
    mobileNumber: '',
    email: '',
    members: [
      { studentName: '', registerNumber: '', department: '', year: '' },
      { studentName: '', registerNumber: '', department: '', year: '' }
    ] as any[],
  });

  const domains = [
    'Healthcare Technology',
    'Renewable Energy',
    'Agriculture Technology',
    'Artificial Intelligence (AI)',
  ];

  const handleNext = () => {
    if (step === 1) {
      if (!formData.teamName || !formData.projectTitle || !formData.domain) {
        alert('Please fill in all team details.');
        return;
      }
    } else if (step === 2) {
      if (!formData.teamLeaderName || !formData.registerNumber || !formData.department || !formData.year || !formData.mobileNumber || !formData.email) {
        alert('Please fill in all team leader details.');
        return;
      }
    }
    setStep((s) => s + 1);
  };
  const handlePrev = () => setStep((s) => s - 1);

  const addMember = () => {
    if (formData.members.length < 2) {
      setFormData({
        ...formData,
        members: [...formData.members, { studentName: '', registerNumber: '', department: '', year: '' } as never]
      });
    }
  };

  const removeMember = (index: number) => {
    const newMembers = [...formData.members];
    newMembers.splice(index, 1);
    setFormData({ ...formData, members: newMembers });
  };

  const updateMember = (index: number, field: string, value: string) => {
    const newMembers = [...formData.members] as any[];
    newMembers[index][field] = value;
    setFormData({ ...formData, members: newMembers });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate members
    for (const member of formData.members) {
      if (!member.studentName || !member.registerNumber || !member.department || !member.year) {
        alert('Please fill in all details for every team member.');
        return;
      }
    }
    
    try {
      const payload = {
        teamName: formData.teamName,
        projectTitle: formData.projectTitle,
        domain: formData.domain,
        teamLeader: {
          studentName: formData.teamLeaderName,
          registerNumber: formData.registerNumber,
          department: formData.department,
          year: formData.year,
          mobileNumber: formData.mobileNumber,
          email: formData.email,
        },
        members: formData.members,
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/teams/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Team registered successfully! Check your email for the confirmation.');
        router.push('/team-dashboard');
      } else {
        alert(`Registration failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 circuit-bg text-foreground">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 md:p-12 rounded-3xl relative overflow-hidden"
        >
          {/* Neon Glow effect */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[50px]" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/20 rounded-full blur-[50px]" />

          <h2 className="text-3xl font-bold mb-8 neon-text text-center">Team Registration</h2>
          
          <div className="mb-8 flex justify-center gap-4">
            <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-primary/20'}`} />
            <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-primary/20'}`} />
            <div className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-primary/20'}`} />
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h3 className="text-xl font-semibold mb-4 text-accent">Team Details</h3>
                <div className="space-y-4">
                  <input type="text" placeholder="Team Name" value={formData.teamName} onChange={e => setFormData({...formData, teamName: e.target.value})} className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors" required />
                  <input type="text" placeholder="Project / Idea Title" value={formData.projectTitle} onChange={e => setFormData({...formData, projectTitle: e.target.value})} className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors" required />
                  <select value={formData.domain} onChange={e => setFormData({...formData, domain: e.target.value})} className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-muted-foreground" required>
                    <option value="">Select Domain</option>
                    {domains.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="flex justify-end pt-4">
                  <button type="button" onClick={handleNext} className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all">Next Step</button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h3 className="text-xl font-semibold mb-4 text-accent">Team Leader Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name" value={formData.teamLeaderName} onChange={e => setFormData({...formData, teamLeaderName: e.target.value})} className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" required />
                  <input type="text" placeholder="Register Number" value={formData.registerNumber} onChange={e => setFormData({...formData, registerNumber: e.target.value})} className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" required />
                  <input type="text" placeholder="Department" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" required />
                  <input type="text" placeholder="Year (e.g., 3rd Year)" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" required />
                  <input type="tel" placeholder="Mobile Number" value={formData.mobileNumber} onChange={e => setFormData({...formData, mobileNumber: e.target.value})} className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" required />
                  <input type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" required />
                </div>
                <div className="flex justify-between pt-4">
                  <button type="button" onClick={handlePrev} className="bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-secondary/80 transition-all">Previous</button>
                  <button type="button" onClick={handleNext} className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all">Next Step</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h3 className="text-xl font-semibold mb-4 text-accent">Team Members</h3>
                <p className="text-sm text-muted-foreground mb-4">Provide details for the other 2 team members.</p>
                
                <div className="space-y-6">
                  {formData.members.map((member: any, index: number) => (
                    <div key={index} className="space-y-4 p-5 border border-border/50 rounded-xl relative bg-background/30">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-primary">Member {index + 2}</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Student Name" value={member.studentName} onChange={e => updateMember(index, 'studentName', e.target.value)} className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" required />
                        <input type="text" placeholder="Register Number" value={member.registerNumber} onChange={e => updateMember(index, 'registerNumber', e.target.value)} className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" required />
                        <input type="text" placeholder="Department" value={member.department} onChange={e => updateMember(index, 'department', e.target.value)} className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" required />
                        <input type="text" placeholder="Year" value={member.year} onChange={e => updateMember(index, 'year', e.target.value)} className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" required />
                      </div>
                    </div>
                  ))}
                </div>


                
                <div className="flex justify-between pt-6">
                  <button type="button" onClick={handlePrev} className="bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-secondary/80 transition-all">Previous</button>
                  <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]">Submit Registration</button>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
