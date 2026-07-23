'use client';

import { motion } from 'framer-motion';

export default function RulesPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 circuit-bg text-foreground">
      <div className="container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold neon-text mb-4">Competition Guidelines</h1>
          <p className="text-muted-foreground text-lg">Rules & Evaluation Criteria for THINK BIG 2026</p>
        </motion.div>

        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-8 rounded-3xl relative overflow-hidden">
            <h2 className="text-2xl font-bold text-accent mb-4 border-b border-white/10 pb-2">1. Eligibility & Team Formation</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Open to students of <b>all departments</b> at VSB Engineering College.</li>
              <li>A team must consist of <b>exactly 3 members</b> (1 leader and 2 members).</li>
              <li>Individual participation is strictly prohibited.</li>
              <li>Each team can submit only <b>one idea/project</b>.</li>
              <li>Cross-year teams (e.g., 2nd year and 3rd year students together) are allowed.</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-8 rounded-3xl relative overflow-hidden">
            <h2 className="text-2xl font-bold text-accent mb-4 border-b border-white/10 pb-2">2. Submission Guidelines</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>All teams must register via the online portal.</li>
              <li>Upon registration, teams must log into the <b>Team Portal</b> to upload their Presentation (PPT/PDF).</li>
              <li>The maximum allowed file size for uploads is <b>20MB</b>.</li>
              <li>An abstract outlining the Problem Statement, Solution, and Innovation must be submitted for AI Evaluation.</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-8 rounded-3xl relative overflow-hidden border border-primary/30">
            <h2 className="text-2xl font-bold text-primary mb-4 border-b border-primary/20 pb-2">3. Hybrid Scoring Architecture</h2>
            <p className="mb-4 text-sm text-muted-foreground">THINK BIG 2026 utilizes an advanced dual-tier evaluation system to ensure absolute fairness and technical rigor.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-background/50 p-4 rounded-xl border border-white/5">
                <h3 className="font-bold text-lg mb-2 text-white">40% - AI Evaluation Engine</h3>
                <p className="text-xs text-muted-foreground mb-2">Google Gemini AI analyzes your abstract on 7 parameters:</p>
                <ul className="text-xs list-disc pl-4 space-y-1 text-muted-foreground">
                  <li>Innovation & Uniqueness</li>
                  <li>Technical Feasibility</li>
                  <li>Market Potential & Viability</li>
                  <li>Social & Environmental Impact</li>
                  <li>Scalability</li>
                  <li>Sustainability</li>
                  <li>Problem-Solution Fit</li>
                </ul>
              </div>

              <div className="bg-background/50 p-4 rounded-xl border border-white/5">
                <h3 className="font-bold text-lg mb-2 text-white">60% - Expert Judge Panel</h3>
                <p className="text-xs text-muted-foreground mb-2">Faculty judges score live presentations based on:</p>
                <ul className="text-xs list-disc pl-4 space-y-1 text-muted-foreground">
                  <li>Presentation & Communication Skills</li>
                  <li>Depth of Technical Knowledge</li>
                  <li>Prototype / Simulation Readiness</li>
                  <li>Q&A Defense</li>
                  <li>Practical Application</li>
                  <li>Team Coordination</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
