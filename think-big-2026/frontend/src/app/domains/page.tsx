'use client';

import { motion } from 'framer-motion';

const domains = [
  { id: 1, name: 'Healthcare Technology', icon: '🏥' },
  { id: 2, name: 'Renewable Energy', icon: '☀️' },
  { id: 3, name: 'Agriculture Technology', icon: '🌾' },
  { id: 4, name: 'Artificial Intelligence (AI)', icon: '🤖' },
];

export default function Domains() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 circuit-bg text-foreground">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold neon-text mb-4"
          >
            Innovation Domains
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Select a domain that best fits your idea and present it to our expert judging panel.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {domains.map((domain, index) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="glass p-6 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 transition-colors group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{domain.icon}</div>
              <h3 className="text-lg font-semibold">{domain.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
