'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed w-full z-50 glass border-b border-white/10 px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold neon-text tracking-widest">
          THINK BIG <span className="text-primary">26</span>
        </Link>
        
        <div className="hidden md:flex gap-6 items-center font-medium">
          <Link href="/domains" className="hover:text-primary transition-colors">Domains</Link>
          <Link href="/rules" className="hover:text-primary transition-colors">Rules</Link>
          <Link href="/results" className="hover:text-primary transition-colors">Leaderboard</Link>
          <Link href="/team-dashboard" className="text-muted-foreground hover:text-white transition-colors text-sm">Team Portal</Link>
          <Link href="/register" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all">
            Register
          </Link>
          <Link href="/login" className="text-xs text-muted-foreground/50 hover:text-primary transition-colors ml-2" title="Admin/Judge Login">
            Admin
          </Link>
          
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-white/10 transition-colors ml-2"
          >
            {mounted && theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="md:hidden">
          <button className="p-2">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}
