'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // States for Forced Password Change
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [tempToken, setTempToken] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      setLoading(false);
      
      if (response.ok) {
        if (data.isFirstLogin) {
          setUserId(data._id);
          setOldPassword(password);
          setTempToken(data.token);
          setNeedsPasswordChange(true);
        } else {
          localStorage.setItem('token', data.token);
          if (data.role === 'judge') {
            router.push('/judge-dashboard');
          } else {
            router.push('/admin-dashboard');
          }
        }
      } else {
        setErrorMsg(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setLoading(false);
      setErrorMsg('Network error. Is the backend running?');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword === oldPassword) {
      setErrorMsg('New password must be different from the default password.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/change-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempToken}`
        },
        body: JSON.stringify({ userId, oldPassword, newPassword })
      });
      const data = await response.json();
      
      if (response.ok) {
        // Re-authenticate to get the token
        const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password: newPassword })
        });
        const loginData = await loginRes.json();
        setLoading(false);
        
        if (loginRes.ok) {
          localStorage.setItem('token', loginData.token);
          if (loginData.role === 'judge') {
            router.push('/judge-dashboard');
          } else {
            router.push('/admin-dashboard');
          }
        } else {
          setErrorMsg('Failed to log in with new password.');
        }
      } else {
        setLoading(false);
        setErrorMsg(data.message || 'Failed to change password.');
      }
    } catch (error) {
      setLoading(false);
      setErrorMsg('Network error.');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 circuit-bg text-foreground flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="glass p-8 md:p-12 rounded-3xl w-full max-w-md relative overflow-hidden"
      >
        <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[60px]" />
        
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-3xl font-bold neon-text mb-2">
            {needsPasswordChange ? 'Security Update' : 'Sign In'}
          </h1>
          <p className="text-muted-foreground">
            {needsPasswordChange ? 'Please change your default password' : 'Admin & Judge Portal'}
          </p>
          {errorMsg && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-4 bg-red-500/10 py-2 rounded-md border border-red-500/20">
              {errorMsg}
            </motion.p>
          )}
        </div>

        {!needsPasswordChange ? (
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors" 
                required 
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors" 
                required 
                autoComplete="new-password"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition shadow-[0_0_15px_rgba(37,99,235,0.4)] disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors" 
                required 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition shadow-[0_0_15px_rgba(37,99,235,0.4)] disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password & Enter'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
