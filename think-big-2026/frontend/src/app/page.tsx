'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen circuit-bg text-foreground relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />

      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10 flex flex-col items-center justify-center text-center min-h-[90vh]">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-block px-4 py-2 glass rounded-full mb-8 text-sm font-semibold tracking-wider text-accent border border-accent/20 uppercase"
        >
          Electrical Club • EEE Dept • VSB Engineering College
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 neon-text"
        >
          THINK BIG <span className="text-primary">2026</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-xl md:text-3xl font-light text-muted-foreground mb-12 max-w-3xl"
        >
          Innovate. Create. Present. Inspire.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-2xl"
        >
          <Link
            href="/register"
            className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] text-lg"
          >
            Register Team
          </Link>
          <Link
            href="/domains"
            className="px-8 py-4 glass text-foreground font-bold rounded-lg hover:bg-white/10 transition-all text-lg"
          >
            Submit Idea
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 flex gap-8 text-sm font-medium text-muted-foreground"
        >
          <Link href="/rules" className="hover:text-primary transition-colors">Event Rules</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
        </motion.div>
      </main>
    </div>
  );
}
